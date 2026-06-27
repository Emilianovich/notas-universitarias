import type { Collection } from "mongodb"
import type { AcademicPeriodDocument } from "../collection-schema/academicPeriods.js"
import { Repository } from "./repository.js"

export class AcademicPeriodsRepository extends Repository<AcademicPeriodDocument> {
	getCollection(): Collection<AcademicPeriodDocument> {
		return this.mongoService.collection<AcademicPeriodDocument>(
			"academicPeriods"
		)
	}
}
