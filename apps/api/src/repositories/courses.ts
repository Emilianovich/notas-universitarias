import type { Collection } from "mongodb"
import type { CourseDocument } from "../collection-schema/courses.js"
import type { MongoService } from "../modules/db/MongoService.js"
import { Repository } from "./repository.js"

export class CoursesRepository extends Repository<CourseDocument> {
	constructor(mongoService: MongoService) {
		super(mongoService)
	}
	getCollection(): Collection<CourseDocument> {
		return this.mongoService.collection<CourseDocument>("courses")
	}
}
