import { updateCourseInstanceFinalGrade } from "@notas-universitarias/helpers"
import type { Collection, ObjectId } from "mongodb"
import type { CreateAcademicPeriodsDto } from "../../../../packages/types/src/dtos/academicPeriods/createAcademicPeriods.js"
import type { AcademicPeriodDocument } from "../collection-schema/academicPeriods.js"
import type { CourseInstanceDocument } from "../collection-schema/courseInstances.js"
import { log } from "../services/logging/LogService.js"
import { Repository } from "./repository.js"

export class AcademicPeriodsRepository extends Repository<AcademicPeriodDocument> {
	getCollection(): Collection<AcademicPeriodDocument> {
		return this.mongoService.collection<AcademicPeriodDocument>(
			"academicPeriods"
		)
	}
	async insertOne(academicPeriod: CreateAcademicPeriodsDto, userId: ObjectId) {
		const { name, startDate, endDate } = academicPeriod
		return await this.getCollection().insertOne({
			name,
			startDate,
			endDate,
			userId,
			isActive: true
		})
	}
	async getOneById(id: ObjectId): Promise<AcademicPeriodDocument | null> {
		return this.getCollection().findOne({ _id: id })
	}
	async getCurrentAcademicPeriod(
		userId: ObjectId
	): Promise<AcademicPeriodDocument | null> {
		await this.finalizeUnactive(userId)
		return this.getCollection().findOne({ isActive: true, userId })
	}
	private async finalizeUnactive(userId: ObjectId) {
		await this.getCollection().updateMany(
			{ endDate: { $lt: new Date() }, userId },
			{
				$set: {
					isActive: false
				}
			}
		)
	}
	async getAllUnactive(userId: ObjectId): Promise<AcademicPeriodDocument[]> {
		await this.finalizeUnactive(userId)
		const cursor = this.getCollection()
			.find({ isActive: false, userId })
			.sort({ endDate: -1 })
		const academicPeriods: AcademicPeriodDocument[] = []
		for await (const document of cursor) {
			academicPeriods.push(document)
		}
		// const courseInstances: CourseInstanceDocument[] = []
		academicPeriods.forEach((academicPeriod) => {
			academicPeriod.courseInstances?.forEach((courseInstance) => {
				// const { _id, ...rest } = courseInstance
				updateCourseInstanceFinalGrade(courseInstance)
			})
		})
		return academicPeriods
	}

	async addCourseInstance(
		academicPeriod: AcademicPeriodDocument,
		courseInstance: CourseInstanceDocument
	): Promise<void> {
		try {
			const update = await this.getCollection().updateOne(
				{ _id: academicPeriod._id },
				{ $push: { courseInstances: courseInstance } }
			)
			log(
				"error",
				`Was acknowledged: ${update.acknowledged}, amount updated: ${update.matchedCount}`
			)
		} catch (error) {
			log("error", error)
		}
	}
	async registerCourse(
		academicPeriod: AcademicPeriodDocument,
		courseId: ObjectId
	): Promise<void> {
		try {
			const _update = await this.getCollection().updateOne(
				{ _id: academicPeriod._id },
				{ $push: { registeredCourses: courseId } }
			)
		} catch (error) {
			log("error", error)
		}
	}
	async findByCourseInstanceId(
		courseInstanceId: ObjectId
	): Promise<AcademicPeriodDocument | null> {
		return this.getCollection().findOne({
			courseInstances: {
				$elemMatch: { _id: courseInstanceId }
			}
		})
	}

	async updateCourseInstance(
		oldAcademicPeriod: AcademicPeriodDocument,
		newAcademicPeriod: AcademicPeriodDocument
	): Promise<void> {
		await this.getCollection().replaceOne(
			{ _id: oldAcademicPeriod._id },
			newAcademicPeriod
		)
	}
}
