import type {
	CourseBreakdown,
	CourseInstance,
	Laboratory
} from "@notas-universitarias/types"
import type { Collection, Db, ObjectId } from "mongodb"
import type { MongoService } from "../../modules/db/MongoService.js"
import { CourseInstancesRepository } from "../../repositories/courseInstances.js"
import type { MigrationObject } from "../index.js"

const courseBreakdownSchema = {
	bsonType: "object",
	required: [
		"name",
		"percentage",
		"contribution",
		"entries",
		"allowsMultipleEntries"
	],
	properties: {
		name: { bsonType: "string" },
		percentage: {
			bsonType: "number",
			minimum: 0,
			maximum: 1
		},
		contribution: {
			bsonType: "number",
			minimum: 0
		},
		entries: {
			bsonType: "array",
			items: {
				bsonType: "object",
				required: ["rawScore", "maxScore"],
				properties: {
					name: { bsonType: "string" },
					rawScore: { bsonType: "number" },
					maxScore: { bsonType: "int" }
				}
			}
		},
		allowsMultipleEntries: { bsonType: "bool" }
	}
}

const breakdownsSchema = {
	bsonType: "array",
	items: courseBreakdownSchema
}

const laboratoryBreakdownsSchema = {
	...breakdownsSchema,
	minItems: 1
}

const laboratorySchema = {
	bsonType: "object",
	required: ["profesorName", "finalGrade", "percentage", "breakdowns"],
	properties: {
		profesorName: { bsonType: "string" },
		finalGrade: {
			bsonType: "number",
			minimum: 0,
			maximum: 1
		},
		percentage: {
			bsonType: "number",
			minimum: 0,
			maximum: 1
		},
		breakdowns: laboratoryBreakdownsSchema
	}
}

const validateBreakdowns = (path: string) => ({
	$allElementsTrue: {
		$map: {
			input: { $ifNull: [path, []] },
			as: "item",
			in: {
				$and: [
					{
						$lte: ["$$item.contribution", "$$item.percentage"]
					},
					{
						$allElementsTrue: {
							$map: {
								input: "$$item.entries",
								as: "entry",
								in: {
									$lte: ["$$entry.rawScore", "$$entry.maxScore"]
								}
							}
						}
					}
				]
			}
		}
	}
})

export const newCourseInstancesValidator = {
	$and: [
		{
			$jsonSchema: {
				bsonType: "object",
				title: "Course Instances Validations",
				required: ["profesorName", "finalGrade", "breakdowns"],
				properties: {
					profesorName: { bsonType: "string" },
					finalGrade: {
						bsonType: "number",
						minimum: 0,
						maximum: 1
					},
					breakdowns: breakdownsSchema,
					laboratory: laboratorySchema
				}
			}
		},
		{
			$expr: {
				$and: [
					validateBreakdowns("$breakdowns"),
					validateBreakdowns("$laboratory.breakdowns")
				]
			}
		}
	]
}

type LegacyBreakdownBase = Omit<CourseBreakdown, "allowsMultipleEntries">

type LegacyStandaloneBreakdown = LegacyBreakdownBase & {
	type: "STANDALONE"
}

type LegacyNotNestedBreakdown = LegacyBreakdownBase & {
	type: "NOT-NESTED"
}

type LegacyLaboratoryDetails = {
	profesorName: string
	finalGrade: number
	breakdown: (LegacyStandaloneBreakdown | LegacyNotNestedBreakdown)[]
}

type LegacyNestedBreakdown = LegacyBreakdownBase & {
	type: "NESTED"
	laboratoryDetails?: LegacyLaboratoryDetails
}

type LegacyBreakdown =
	| LegacyStandaloneBreakdown
	| LegacyNotNestedBreakdown
	| LegacyNestedBreakdown

type LegacyCourseInstance = {
	_id: ObjectId
	profesorName: string
	finalGrade: number
	breakdown: LegacyBreakdown[]
	breakdowns?: CourseBreakdown[]
	laboratory?: Laboratory
}

function mapBreakdown(
	{ name, percentage, contribution, entries }: LegacyBreakdownBase,
	allowsMultipleEntries: boolean
): CourseBreakdown {
	return {
		name,
		percentage,
		contribution,
		entries,
		allowsMultipleEntries
	}
}

export const migration: MigrationObject = {
	name: "003-change-course-instance-schema",
	up: async (db: Db, mongoService: MongoService) => {
		const repository = new CourseInstancesRepository(mongoService)

		const collection =
			repository.getCollection() as unknown as Collection<LegacyCourseInstance>

		const documents = await collection
			.find({ breakdown: { $exists: true } })
			.toArray()

		const updates = documents.map(
			({ _id, profesorName, finalGrade, breakdown: oldBreakdowns }) => {
				const nested = oldBreakdowns.filter(
					(item): item is LegacyNestedBreakdown => item.type === "NESTED"
				)

				if (nested.length > 1) {
					throw new Error(`Multiple NESTED breakdowns in ${_id}`)
				}

				const [nestedBreakdown] = nested
				let laboratory: Laboratory | undefined

				if (nestedBreakdown) {
					const { percentage, laboratoryDetails: details } = nestedBreakdown

					if (!details?.breakdown.length) {
						throw new Error(`Missing laboratory breakdowns in ${_id}`)
					}

					const {
						profesorName: labProfessor,
						finalGrade: labGrade,
						breakdown: labBreakdowns
					} = details

					laboratory = {
						profesorName: labProfessor,
						finalGrade: labGrade,
						percentage,
						breakdowns: labBreakdowns.map(({ type, ...breakdown }) =>
							mapBreakdown(breakdown, type === "NOT-NESTED")
						)
					}
				}

				const breakdowns = oldBreakdowns.flatMap((item): CourseBreakdown[] => {
					if (item.type === "NESTED") return []

					return [mapBreakdown(item, item.type === "NOT-NESTED")]
				})

				const courseInstance: CourseInstance = {
					profesorName,
					finalGrade,
					breakdowns,
					...(laboratory ? { laboratory } : {})
				}

				return { _id, courseInstance }
			}
		)

		if (updates.length) {
			await collection.bulkWrite(
				updates.map(({ _id, courseInstance }) => ({
					updateOne: {
						filter: { _id },
						update: { $set: courseInstance }
					}
				}))
			)
		}

		await db.command({
			collMod: "courseInstances",
			validationLevel: "strict",
			validationAction: "error",
			validator: newCourseInstancesValidator
		})

		await collection.updateMany(
			{ breakdown: { $exists: true } },
			{ $unset: { breakdown: "" } }
		)
	}
}
