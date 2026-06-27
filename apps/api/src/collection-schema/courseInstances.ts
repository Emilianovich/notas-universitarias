import type { CourseInstance } from "@notas-universitarias/types"
import type { ObjectId } from "mongodb"

interface CourseInstanceInterface {
	_id: ObjectId
}

export type CourseInstanceDocument = CourseInstance & CourseInstanceInterface
