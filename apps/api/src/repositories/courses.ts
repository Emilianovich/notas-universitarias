import type { Course, CourseInstance } from "@notas-universitarias/types"
import { HTTPException } from "hono/http-exception"
import type { Collection, ObjectId, UpdateResult } from "mongodb"
import type { CourseInstanceDocument } from "../collection-schema/courseInstances.js"
import type { CourseDocument } from "../collection-schema/courses.js"
import { CourseInstancesRepository } from "./courseInstances.js"
import { Repository } from "./repository.js"

export class CoursesRepository extends Repository<CourseDocument> {
	private courseInstanceRepository: CourseInstancesRepository =
		new CourseInstancesRepository(this.mongoService)
	getCollection(): Collection<CourseDocument> {
		return this.mongoService.collection<CourseDocument>("courses")
	}
	async insertOne(
		rawDTO: Course,
		courseInstanceId: ObjectId,
		userId: ObjectId
	): Promise<ObjectId> {
		const { courseInstances, ...dto } = rawDTO
		return (
			await this.getCollection().insertOne({
				...dto,
				courseInstances: [courseInstanceId],
				userId
			})
		).insertedId
	}

	async findById(id: ObjectId): Promise<CourseDocument | null> {
		return this.getCollection().findOne({ _id: id })
	}

	async findAllByUserId(userId: ObjectId) {
		return this.getCollection().find({ userId: userId })
	}

	async addCourseInstance(course: CourseDocument, courseInstanceId: ObjectId) {
		try {
			await this.getCollection().updateOne(
				{ course },
				{ $push: { courseInstances: courseInstanceId } }
			)
		} catch (error) {
			throw new HTTPException(500, { message: `${error}` })
		}
	}

	// TODO test
	// async updateCourseAverageGrade(courseDoc: CourseDocument) : Promise<UpdateResult<CourseDocument>> {
	// 	const { _id, name, courseInstances, userId, averageGrade } = courseDoc
	// 	const course : Course = {
	// 		name,
	// 		averageGrade,
	// 		courseInstances: await this.getAllCourseInstances(courseDoc)
	// 	}
	// 	updateCourseAverageGrade(course)
	// 	const newCourse : CourseDocument = {
	// 		_id,
	// 		userId,
	// 		name,
	// 		courseInstances,
	// 		averageGrade: course.averageGrade
	// 	}
	// 	return await this.updateCourse(courseDoc, newCourse)
	// }

	async getAllCourseInstances(
		course: CourseDocument
	): Promise<CourseInstance[]> {
		const courseInstancesDocArray: CourseInstanceDocument[] = []
		const cursor = this.courseInstanceRepository.getCollection().find({
			_id: {
				$in: course.courseInstances
			}
		})
		for await (const courseInstance of cursor) {
			courseInstancesDocArray.push(courseInstance)
		}
		return courseInstancesDocArray.map((courseInstance) => {
			const { _id, ...rest } = courseInstance
			return rest
		})
	}

	async updateCourse(
		oldCourse: CourseDocument,
		newCourse: CourseDocument
	): Promise<UpdateResult<CourseDocument>> {
		return await this.getCollection().replaceOne(oldCourse, newCourse)
	}

	async findByCourseInstanceId(
		courseInstanceId: ObjectId
	): Promise<CourseDocument | null> {
		return this.getCollection().findOne({ courseInstances: courseInstanceId })
	}
}
