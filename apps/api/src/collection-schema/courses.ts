import type { ObjectId } from "mongodb"

interface CourseInterface {
	_id: ObjectId
	name: string
	averageGrade: number
	courseInstances: ObjectId[]
}
export type CourseDocument = CourseInterface
