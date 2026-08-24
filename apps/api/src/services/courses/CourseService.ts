import { updateCourseAverageGrade } from "@notas-universitarias/helpers"
import type {
	AcademicPeriodDocument,
	Course,
	CourseDocument,
	CourseInstance,
	CourseInstanceDocument,
	CourseInstanceToBeCreated,
	CoursesInfo,
	UpdateCourseInstanceDto
} from "@notas-universitarias/types"
import { HTTPException } from "hono/http-exception"
import type { FindCursor, ObjectId, WithId } from "mongodb"

import getValidObjectId, {
	mapCreateCourseInstanceToDTO
} from "../../helpers/helpers.js"
import type { MongoService } from "../../modules/db/MongoService.js"
import { AcademicPeriodsRepository } from "../../repositories/academicPeriods.js"
import { CourseInstancesRepository } from "../../repositories/courseInstances.js"
import { CoursesRepository } from "../../repositories/courses.js"

export class CourseService {
	private readonly courseInstancesRepository: CourseInstancesRepository
	private readonly coursesRepository: CoursesRepository
	private readonly academicPeriodRepository: AcademicPeriodsRepository
	constructor(mongoService: MongoService) {
		this.courseInstancesRepository = new CourseInstancesRepository(mongoService)
		this.coursesRepository = new CoursesRepository(mongoService)
		this.academicPeriodRepository = new AcademicPeriodsRepository(mongoService)
	}
	async handleCourseCreation(
		dto: CourseInstanceToBeCreated,
		userId: ObjectId,
		previousCourseId: string | undefined
	) {
		const currentAcademicPeriod =
			await this.academicPeriodRepository.getCurrentAcademicPeriod(userId)
		if (!currentAcademicPeriod)
			throw new HTTPException(400, {
				message:
					"No se puede registrar un curso fuera de un periodo académico activo"
			})
		let existingCourse: CourseDocument | null
		let validCourseId: ObjectId
		// NOTE: checking if the user has already registered a courseInstance for a particular course during the current academic period
		// NOTE: in theory from DTO previousCourseId === "string" && isRegistered === true
		if (previousCourseId) {
			validCourseId = getValidObjectId(previousCourseId)
			existingCourse = await this.coursesRepository.findById(validCourseId)
			if (!existingCourse)
				throw new HTTPException(404, {
					message: "No se encontró una materia registrada con ese id"
				})
			if (
				currentAcademicPeriod.registeredCourses.some((id: ObjectId) =>
					id.equals(existingCourse?._id)
				)
			) {
				throw new HTTPException(409, {
					message: `Ya tiene registrado un curso de ${existingCourse.name} para el periodo académico actual`
				})
			}
		}
		const courseInstanceId = await this.courseInstancesRepository.insertOne(
			mapCreateCourseInstanceToDTO(dto)
		)
		const courseInstance =
			await this.courseInstancesRepository.findById(courseInstanceId)
		if (!courseInstance) {
			await this.courseInstancesRepository
				.getCollection()
				.deleteOne({ _id: courseInstanceId })
			throw new HTTPException(400, {
				message: "No se pudo guardar la materia, intente nuevamente"
			})
		}
		await this.academicPeriodRepository.addCourseInstance(
			currentAcademicPeriod,
			courseInstance
		)
		if (!dto.isRegistered) {
			const newCourseId = await this.coursesRepository.insertOne(
				{
					name: dto.name as string,
					averageGrade: 0,
					courseInstances: []
				},
				courseInstanceId,
				userId
			)
			await this.academicPeriodRepository.registerCourse(
				currentAcademicPeriod,
				newCourseId
			)
			return
		}
		// REVIEW
		// NOTE in theory if you reach this condition, a course was previously registered and previousCourseId has been validated
		existingCourse = (await this.coursesRepository.findById(
			getValidObjectId(previousCourseId)
		)) as CourseDocument
		await this.academicPeriodRepository.registerCourse(
			currentAcademicPeriod,
			existingCourse._id as ObjectId
		)
		await this.coursesRepository.addCourseInstance(
			existingCourse,
			courseInstanceId
		)
	}
	// NOTE: courseInstances do not have a userId so its necessary a validation to ensure it belongs to logged user
	async getCourseInstance(
		courseInstanceId: ObjectId,
		userId: ObjectId
	): Promise<{
		courseInstance: Omit<CourseInstance, "finalGrade">
		courseInstanceDoc: CourseInstanceDocument
		courseName: string
	}> {
		const courseInstanceDoc =
			await this.courseInstancesRepository.findById(courseInstanceId)
		if (!courseInstanceDoc)
			throw new HTTPException(404, {
				message: "No se encontró la materia especificada"
			})
		const courses: CourseDocument[] = []
		for await (const course of await this.coursesRepository.findAllByUserId(
			userId
		)) {
			courses.push(course)
		}
		if (!courses.length)
			throw new HTTPException(404, {
				message: "Usted no tiene cursos registrados todavía"
			})
		const copyCourseInstance = { ...courseInstanceDoc }
		let courseInstanceBelongToUser = false
		let courseName: string = "Nombre no definido"
		for (const course of courses) {
			courseInstanceBelongToUser = course.courseInstances.some((id) => {
				if (id.equals(courseInstanceId)) {
					courseName = course.name
					return true
				} else return false
			})
			if (courseInstanceBelongToUser) break
		}
		if (!courseInstanceBelongToUser)
			throw new HTTPException(404, {
				message: "Usted no tiene una materia registrada con ese id"
			})
		const { _id, ...rest } = copyCourseInstance
		const { finalGrade, ...courseInstance } = rest
		// TODO REVIEW: consider moving fully to client
		courseInstance.breakdown.forEach((breakdown) => {
			breakdown.percentage *= 100
			if (breakdown.laboratoryDetails) {
				breakdown.laboratoryDetails.breakdown.forEach((detail) => {
					detail.percentage *= 100
				})
			}
		})
		return { courseInstance, courseInstanceDoc, courseName }
	}

	// OPTIMIZE
	async handleCourseInstanceUpdate(
		dto: UpdateCourseInstanceDto,
		courseInstanceId: ObjectId,
		userId: ObjectId
	) {
		const academicPeriod =
			await this.academicPeriodRepository.findByCourseInstanceId(
				courseInstanceId
			)
		if (!academicPeriod)
			throw new HTTPException(404, {
				message:
					"La materia especificada no aparece registrada en ningún periodo académico"
			})
		if (!academicPeriod.courseInstances)
			throw new HTTPException(400, {
				message:
					"For some reason un periodo académico con un id de materia no tiene materias!!!"
			})
		const courseDoc =
			await this.coursesRepository.findByCourseInstanceId(courseInstanceId)
		if (!courseDoc)
			throw new HTTPException(404, {
				message:
					"No tiene ninguna materia donde en su historial aparezca ese id"
			})
		const { courseInstanceDoc } = await this.getCourseInstance(
			courseInstanceId,
			userId
		)
		const { result, updatedCourseInstance } =
			await this.courseInstancesRepository.updateOne(dto, courseInstanceDoc)
		if (!result.modifiedCount)
			throw new HTTPException(400, {
				message: "Ocurrió un error al actualizar, intente nuevamente"
			})
		const updatedPeriodCourseInstances: CourseInstanceDocument[] = []
		academicPeriod.courseInstances.forEach(
			(instance: CourseInstanceDocument) => {
				const { _id, ...rest } = instance
				if (!_id?.equals(updatedCourseInstance._id)) {
					updatedPeriodCourseInstances.push({
						_id,
						...rest
					})
				} else {
					updatedPeriodCourseInstances.push({
						...updatedCourseInstance
					})
				}
			}
		)
		const updatedAcademicPeriod: AcademicPeriodDocument = {
			...academicPeriod,
			courseInstances: updatedPeriodCourseInstances
		}
		await this.academicPeriodRepository.updateCourseInstance(
			academicPeriod,
			updatedAcademicPeriod
		)
		const courseInstancesInCourseArray =
			await this.coursesRepository.getAllCourseInstances(courseDoc)
		const { name, averageGrade } = courseDoc
		const courseForFn: Course = {
			name,
			averageGrade,
			courseInstances: courseInstancesInCourseArray
		}
		updateCourseAverageGrade(courseForFn)
		const { courseInstances, ...rest } = courseForFn
		const updatedCourse: CourseDocument = {
			_id: courseDoc._id,
			userId: courseDoc.userId,
			courseInstances: courseDoc.courseInstances,
			...rest
		}
		// NOTE probably should do something like a rollback if anything goes bad but bruuhhh
		await this.coursesRepository.updateCourse(courseDoc, updatedCourse)
		return updatedCourseInstance
	}

	async getAvailableCoursesInAcademicPeriod(
		userId: ObjectId
	): Promise<CoursesInfo[]> {
		const currentAcademicPeriod =
			await this.academicPeriodRepository.getCurrentAcademicPeriod(userId)
		if (!currentAcademicPeriod)
			throw new HTTPException(400, {
				message: "No tienes ningún periodo académico activo"
			})
		let coursesInfoCursor: FindCursor<WithId<CourseDocument>>
		const coursesInfo: CoursesInfo[] = []
		if (!currentAcademicPeriod.registeredCourses.length) {
			coursesInfoCursor = this.coursesRepository
				.getCollection()
				.find({ userId })
		} else {
			coursesInfoCursor = this.coursesRepository.getCollection().find({
				_id: { $nin: currentAcademicPeriod.registeredCourses },
				userId
			})
		}
		for await (const course of coursesInfoCursor) {
			const { name, _id } = course
			coursesInfo.push({
				name,
				_id
			})
		}
		return coursesInfo
	}
}
