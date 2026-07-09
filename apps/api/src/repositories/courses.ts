import type { Collection } from "mongodb"
import type { CourseDocument } from "../collection-schema/courses.js"
import { Repository } from "./repository.js"

export class CoursesRepository extends Repository<CourseDocument> {
	getCollection(): Collection<CourseDocument> {
		return this.mongoService.collection<CourseDocument>("courses")
	}
}
