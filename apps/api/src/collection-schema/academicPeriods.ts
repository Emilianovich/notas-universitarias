import type { AcademicPeriod } from "@notas-universitarias/types"
import type { ObjectId } from "mongodb"
import type { CourseInstanceDocument } from "./courseInstances.js"

interface AcademicPeriodInterface {
	_id?: ObjectId
	isActive: boolean
	userId: ObjectId
	courseInstances?: CourseInstanceDocument[]
}
export type AcademicPeriodDocument = AcademicPeriod & AcademicPeriodInterface
