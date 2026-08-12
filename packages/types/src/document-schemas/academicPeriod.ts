import type { AcademicPeriod } from "@notas-universitarias/types/db"
import type { ObjectId } from "mongodb"
import type {
	CourseInstanceDocument,
	CourseInstancePresentation
} from "./courses"

interface AcademicPeriodInterface {
	_id?: ObjectId
	isActive: boolean
	userId: ObjectId
	courseInstances: CourseInstanceDocument[]
	registeredCourses: ObjectId[]
}
export type AcademicPeriodDocument = AcademicPeriod & AcademicPeriodInterface

export type AcademicPeriodPresentation = {
	_id: ObjectId
	name: string
	startDate: Date
	endDate: Date
	courseInstances: CourseInstancePresentation[]
}
