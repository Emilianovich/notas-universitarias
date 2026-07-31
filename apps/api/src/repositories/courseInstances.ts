import { updateCourseInstanceFinalGrade } from "@notas-universitarias/helpers"
import type { CourseInstance } from "@notas-universitarias/types"
import type { Collection, ObjectId } from "mongodb"
import type { UpdateCourseInstanceDto } from "../../../../packages/types/src/dtos/courseInstances/updateCourseInstances.js"
import type { CourseInstanceDocument } from "../collection-schema/courseInstances.js"
import { mapUpdateCourseInstance } from "../helpers/helpers.js"
import { Repository } from "./repository.js"

export class CourseInstancesRepository extends Repository<CourseInstanceDocument> {
	getCollection(): Collection<CourseInstanceDocument> {
		return this.mongoService.collection("courseInstances")
	}
	async insertOne(dto: CourseInstance): Promise<ObjectId> {
		return (await this.getCollection().insertOne(dto)).insertedId
	}
	async findById(_id: ObjectId): Promise<CourseInstanceDocument | null> {
		return await this.getCollection().findOne({ _id })
	}
	async updateOne(
		dto: UpdateCourseInstanceDto,
		courseInstance: CourseInstanceDocument
	) {
		const { _id, ...currentCourseInstance } = courseInstance
		const updatedCourseInstance = mapUpdateCourseInstance(
			currentCourseInstance,
			dto
		)
		updateCourseInstanceFinalGrade(updatedCourseInstance)
		return {
			result: await this.getCollection().replaceOne(
				{ _id: _id },
				updatedCourseInstance
			),
			updatedCourseInstance: { _id, ...updatedCourseInstance }
		}
	}
}
