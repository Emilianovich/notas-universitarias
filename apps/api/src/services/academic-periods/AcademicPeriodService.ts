import { updateCourseInstanceFinalGrade } from "@notas-universitarias/helpers"
import { HTTPException } from "hono/http-exception"
import type { ObjectId } from "mongodb"
import type { CreateAcademicPeriodsDto } from "../../../../../packages/types/src/dtos/academicPeriods/createAcademicPeriods.js"
import type { AcademicPeriodDocument } from "../../collection-schema/academicPeriods.js"
import type { CourseInstanceDocument } from "../../collection-schema/courseInstances.js"
import type { MongoService } from "../../modules/db/MongoService.js"
import { AcademicPeriodsRepository } from "../../repositories/academicPeriods.js"

export class AcademicPeriodService {
	private readonly academicPeriodsRepository: AcademicPeriodsRepository
	constructor(mongoService: MongoService) {
		this.academicPeriodsRepository = new AcademicPeriodsRepository(mongoService)
	}
	async createAcademicPeriod(
		dto: CreateAcademicPeriodsDto,
		currentUserId: ObjectId
	) {
		const existingAcademicPeriod = await this.academicPeriodsRepository
			.getCollection()
			.findOne({ isActive: true })
		if (existingAcademicPeriod)
			throw new HTTPException(400, {
				message: `No puede registrar un nuevo periodo académico mientras que el actual no ha terminado. El actual abarca desde ${existingAcademicPeriod.name} hasta el ${existingAcademicPeriod.endDate}`
			})
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
	async getCurrentAcademicPeriod(currentUserId: ObjectId) {
		const academicPeriod: AcademicPeriodDocument | null =
			await this.academicPeriodsRepository.getCurrentAcademicPeriod(
				currentUserId
			)
		if (!academicPeriod) return null
		const { userId, isActive, registeredCourses, _id, ...rest } = academicPeriod
		return rest
	}
	// TODO make sure all courseInstances are updated
	async getUnactiveAcademicPeriods(userId: ObjectId) {
		const academicPeriods: AcademicPeriodDocument[] = []
		academicPeriods.push(
			...(await this.academicPeriodsRepository.getAllUnactive(userId))
		)
		// TODO might need to remove for prod cause theoretically courseInstances when updated get updated in academicPeriod
		try {
			academicPeriods.forEach((period) => {
				const updatedCourseInstances: CourseInstanceDocument[] = []
				period.courseInstances?.forEach((instance) => {
					const { _id, ...rest } = instance
					updateCourseInstanceFinalGrade(rest)
					updatedCourseInstances.push({
						_id,
						...rest
					})
				})
				const updatedAcademicPeriod: AcademicPeriodDocument = {
					...period,
					courseInstances: updatedCourseInstances
				}
				this.academicPeriodsRepository.updateCourseInstance(
					period,
					updatedAcademicPeriod
				)
			})
		} catch (_err) {
			throw new HTTPException(500, {
				message:
					"Ocurrió un error al actualizar su historial académico, intente nuevamente"
			})
		}

		return academicPeriods.map((period) => {
			const { _id, isActive, userId, ...rest } = period
			return rest
		})
	}
}
