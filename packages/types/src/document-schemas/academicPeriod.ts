import type { ObjectId } from "mongodb"
import type {
	CourseInstanceDocument,
	CourseInstancePresentation
} from "./courses"

export type AcademicPeriodDocument = {
	_id?: ObjectId
	name: string
	startDate: Date
	endDate: Date
	isActive: boolean
	userId: ObjectId
	courseInstances: CourseInstanceDocument[]
	registeredCourses: ObjectId[]
}

export type AcademicPeriodPresentation = {
	_id: ObjectId
	name: string
	startDate: Date
	endDate: Date
	courseInstances: CourseInstancePresentation[]
}
