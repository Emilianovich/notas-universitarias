import type { Collection } from "mongodb"
import type { AcademicPeriodDocument } from "../collection-schema/academicPeriods.js"
import type { MongoService } from "../modules/db/MongoService.js"
import { Repository } from "./repository.js"

export class AcademicPeriodsRepository extends Repository<AcademicPeriodDocument> {
	constructor(mongoService: MongoService) {
		super(mongoService)
	}
	getCollection(): Collection<AcademicPeriodDocument> {
		return this.mongoService.collection<AcademicPeriodDocument>(
			"academicPeriods"
		)
	}
}
