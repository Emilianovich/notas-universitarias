import type { ObjectId } from "mongodb"

export type CourseDocument = {
	_id?: ObjectId
	name: string
	averageGrade: number
	courseInstances: ObjectId[]
	userId: ObjectId
}
