import type { Collection } from "mongodb"
import type { CourseInstanceDocument } from "../collection-schema/courseInstances.js"
import type { MongoService } from "../modules/db/MongoService.js"
import { Repository } from "./repository.js"

export class CourseInstancesRepository extends Repository<CourseInstanceDocument> {
	constructor(mongoService: MongoService) {
		super(mongoService)
	}
	getCollection(): Collection<CourseInstanceDocument> {
		return this.mongoService.collection("courseInstances")
	}
}
