import type { CourseInstance } from "@notas-universitarias/types"
import type { ObjectId } from "mongodb"

// interface CourseInstanceInterface {
// 	_id?: ObjectId
// 	userId: ObjectId
// 	courseId: ObjectId
// }

export type CourseInstanceDocument = CourseInstance & { _id?: ObjectId }
