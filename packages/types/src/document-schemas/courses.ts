import type { CourseInstance } from "@notas-universitarias/types/db"
import type { ObjectId } from "mongodb"

export type CourseInstanceDocument = CourseInstance & { _id?: ObjectId }
export type CourseDocument = {
	_id?: ObjectId
	name: string
	averageGrade: number
	courseInstances: ObjectId[]
	userId: ObjectId
}
export type CourseInstancePresentation = {
	_id: ObjectId
	name: string
	finalGrade: number
}
