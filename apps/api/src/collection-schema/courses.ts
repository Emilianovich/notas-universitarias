import type { Course } from "@notas-universitarias/types"
import type { ObjectId } from "mongodb"

interface CourseInterface {
	_id: ObjectId
	courseInstances: ObjectId[]
}
export type CourseDocument = CourseInterface & Course
