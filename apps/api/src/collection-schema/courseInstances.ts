import type { CourseInstance } from "@notas-universitarias/types"
import type { ObjectId } from "mongodb"

export type CourseInstanceDocument = CourseInstance & { _id?: ObjectId }
