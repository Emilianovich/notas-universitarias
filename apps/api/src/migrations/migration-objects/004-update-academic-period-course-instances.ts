
import type {
    CourseBreakdown,
    CourseInstanceDocument,
    Laboratory
} from "@notas-universitarias/types"
import type { Db, Filter, ObjectId } from "mongodb"
import type { MigrationObject } from "../index.js"

type LegacyBreakdownBase = Omit<
    CourseBreakdown,
    "allowsMultipleEntries"
>

type LegacyStandaloneBreakdown = LegacyBreakdownBase & {
    type: "STANDALONE"
}

type LegacyNotNestedBreakdown = LegacyBreakdownBase & {
    type: "NOT-NESTED"
}

type LegacyLaboratoryDetails = {
    profesorName: string
    finalGrade: number
    breakdown: (
        | LegacyStandaloneBreakdown
        | LegacyNotNestedBreakdown
        )[]
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
    _id?: ObjectId
    profesorName: string
    finalGrade: number
    breakdown: LegacyBreakdown[]
}

type AcademicPeriodForMigration = {
    _id: ObjectId
    courseInstances?: (
        | LegacyCourseInstance
        | CourseInstanceDocument
        )[] | null
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

function mapLegacyCourseInstance({
                                     _id,
                                     profesorName,
                                     finalGrade,
                                     breakdown: oldBreakdowns
                                 }: LegacyCourseInstance): CourseInstanceDocument {
    const nested = oldBreakdowns.filter(
        (item): item is LegacyNestedBreakdown =>
            item.type === "NESTED"
    )

    if (nested.length > 1) {
        throw new Error("Multiple NESTED breakdowns in an academic period")
    }

    const [nestedBreakdown] = nested
    let laboratory: Laboratory | undefined

    if (nestedBreakdown) {
        const {
            percentage,
            laboratoryDetails: details
        } = nestedBreakdown

        if (!details?.breakdown?.length) {
            throw new Error(
                "Missing laboratory breakdowns in an academic period"
            )
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
            breakdowns: labBreakdowns.map(
                ({ type, ...breakdown }) =>
                    mapBreakdown(
                        breakdown,
                        type === "NOT-NESTED"
                    )
            )
        }
    }

    const breakdowns = oldBreakdowns.flatMap(
        (item): CourseBreakdown[] => {
            if (item.type === "NESTED") return []

            return [
                mapBreakdown(
                    item,
                    item.type === "NOT-NESTED"
                )
            ]
        }
    )

    return {
        ...(_id ? { _id } : {}),
        profesorName,
        finalGrade,
        breakdowns,
        ...(laboratory ? { laboratory } : {})
    }
}

export const migration: MigrationObject = {
    name: "004-update-academic-period-course-instances",

    up: async (db: Db) => {
        const collection =
            db.collection<AcademicPeriodForMigration>("academicPeriods")

        const periods = await collection
            .find({
                "courseInstances.breakdown": { $exists: true }
            } as Filter<AcademicPeriodForMigration>)
            .toArray()

        const updates = periods.map(({ _id, courseInstances }) => ({
            updateOne: {
                filter: { _id },
                update: {
                    $set: {
                        courseInstances: (courseInstances ?? []).map(
                            (instance) =>
                                "breakdown" in instance
                                    ? mapLegacyCourseInstance(instance)
                                    : instance
                        )
                    }
                }
            }
        }))

        if (updates.length > 0) {
            await collection.bulkWrite(updates)
        }
    }
}
