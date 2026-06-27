import type { AcademicPeriod } from "@notas-universitarias/types"
import type { ObjectId } from "mongodb"

interface AcademicPeriodInterface {
	_id: ObjectId
	isActive: boolean
	startDate: number
	endDate: number
	courseInstances: null | ObjectId[]
}
export type AcademicPeriodDocument = AcademicPeriod & AcademicPeriodInterface
