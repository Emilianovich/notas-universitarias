import {
	getLastElementFromArray,
	updateCourseInstanceFinalGrade
} from "@notas-universitarias/helpers"
import type {
	AcademicPeriodDocument,
	AcademicPeriodPresentation,
	CourseInstanceDocument,
	CourseInstancePresentation,
	CreateAcademicPeriodsDto,
	CurrentAcademicPeriod,
	CurrentAcademicPeriodSubjects
} from "@notas-universitarias/types"
import { HTTPException } from "hono/http-exception"
import type { ObjectId } from "mongodb"

import type { MongoService } from "../../modules/db/MongoService.js"
import { AcademicPeriodsRepository } from "../../repositories/academicPeriods.js"
import { CoursesRepository } from "../../repositories/courses.js"

export class AcademicPeriodService {
	private readonly academicPeriodsRepository: AcademicPeriodsRepository
	private readonly coursesRepository: CoursesRepository
	constructor(mongoService: MongoService) {
		this.academicPeriodsRepository = new AcademicPeriodsRepository(mongoService)
		this.coursesRepository = new CoursesRepository(mongoService)
	}
	async createAcademicPeriod(
		dto: CreateAcademicPeriodsDto,
		currentUserId: ObjectId
	) {
		const existingAcademicPeriod = await this.academicPeriodsRepository
			.getCollection()
			.findOne({ isActive: true, userId: currentUserId })
		if (existingAcademicPeriod) {
			throw new HTTPException(400, {
				message: `El periodo actual no ha finalizado. El ${existingAcademicPeriod.name} termina el ${new Intl.DateTimeFormat(
					"es-MX",
					{
						year: "numeric",
						month: "2-digit",
						day: "2-digit"
					}
				).format(existingAcademicPeriod.endDate)}`
			})
		}
		const insertedAcademicPeriod =
			await this.academicPeriodsRepository.insertOne(dto, currentUserId)
		if (!insertedAcademicPeriod.acknowledged)
			throw new HTTPException(422, {
				message: "No se pudo crear el periodo académico, intente nuevamente"
			})
		const rawInsertedAcademicPeriod =
			await this.academicPeriodsRepository.getOneById(
				insertedAcademicPeriod.insertedId
			)
		// NOTE if a document was just inserted, it has an id but oh well
		if (!rawInsertedAcademicPeriod)
			throw new HTTPException(422, {
				message:
					"No se encontró el periodo académico solicitado, intente nuevamente"
			})
		const { _id, userId, isActive, courseInstances, ...content } =
			rawInsertedAcademicPeriod
		return content
	}
	async getCurrentAcademicPeriod(
		currentUserId: ObjectId
	): Promise<CurrentAcademicPeriod> {
		const academicPeriod: AcademicPeriodDocument | null =
			await this.academicPeriodsRepository.getCurrentAcademicPeriod(
				currentUserId
			)
		if (!academicPeriod)
			return {
				isActive: false,
				name: "",
				startDate: new Date(),
				endDate: new Date(),
				courseInstances: []
			}
		const {
			name,
			startDate,
			endDate,
			userId,
			isActive,
			registeredCourses,
			_id,
			...rest
		} = academicPeriod
		const courseInstances: CurrentAcademicPeriodSubjects[] = []
		// NOTE: added this because some academic periods did not have courseInstances
		if (rest.courseInstances?.length) {
			for await (const instance of rest.courseInstances) {
				const name =
					await this.coursesRepository.getCourseNameByCourseInstanceId(
						instance._id as ObjectId
					)
				courseInstances.push({
					id: instance._id?.toString() as string,
					name: name as string
				})
			}
		}
		return {
			name,
			startDate,
			endDate,
			courseInstances,
			isActive
		}
	}
	// TODO make sure all courseInstances are updated
	async getUnactiveAcademicPeriods(userId: ObjectId) {
		const academicPeriods: AcademicPeriodDocument[] = []
		academicPeriods.push(
			...(await this.academicPeriodsRepository.getAllUnactive(userId))
		)
		const preparedAcademicPeriods: AcademicPeriodPresentation[] = []
		// TODO might need to remove for prod cause theoretically courseInstances when updated get updated in academicPeriod
		try {
			await this.updateAcademicPeriods(academicPeriods, preparedAcademicPeriods)
		} catch (_err) {
			throw new HTTPException(500, {
				message:
					"Ocurrió un error al actualizar su historial académico, intente nuevamente"
			})
		}
		return preparedAcademicPeriods
	}
	// REVIEW: maybe separate in different functions
	private async updateAcademicPeriods(
		academicPeriods: AcademicPeriodDocument[],
		preparedAcademicPeriods: AcademicPeriodPresentation[]
	) {
		for await (const period of academicPeriods) {
			const courseInstances: CourseInstancePresentation[] = []
			const updatedCourseInstances: CourseInstanceDocument[] = []
			for await (const instance of period.courseInstances) {
				const course = await this.coursesRepository.findByCourseInstanceId(
					instance._id as ObjectId
				)
				if (!course) break
				const { _id, ...rest } = instance
				updateCourseInstanceFinalGrade(rest)
				updatedCourseInstances.push({
					_id,
					...rest
				})
				courseInstances.push({
					_id: instance._id as ObjectId,
					name: course.name,
					finalGrade: getLastElementFromArray<CourseInstanceDocument>(
						updatedCourseInstances
					).finalGrade
				})
				const updatedAcademicPeriod: AcademicPeriodDocument = {
					...period,
					courseInstances: updatedCourseInstances
				}
				await this.academicPeriodsRepository.updateCourseInstance(
					period,
					updatedAcademicPeriod
				)
			}
			preparedAcademicPeriods.push({
				_id: period._id as ObjectId,
				name: period.name,
				startDate: period.startDate,
				endDate: period.endDate,
				courseInstances
			})
		}
		return preparedAcademicPeriods
	}
}
