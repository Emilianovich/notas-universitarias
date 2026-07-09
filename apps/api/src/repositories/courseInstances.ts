import type { Collection } from "mongodb"
import type { CourseInstanceDocument } from "../collection-schema/courseInstances.js"
import { Repository } from "./repository.js"

export class CourseInstancesRepository extends Repository<CourseInstanceDocument> {
	getCollection(): Collection<CourseInstanceDocument> {
		return this.mongoService.collection("courseInstances")
	}
}
