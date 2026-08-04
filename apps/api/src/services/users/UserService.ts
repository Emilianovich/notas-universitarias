import argon2, { argon2id } from "argon2"
import { HTTPException } from "hono/http-exception"
import type { ObjectId } from "mongodb"
import type { CreateAcademicPeriodsDto } from "../../../../../packages/types/src/dtos/academicPeriods/createAcademicPeriods.js"
import type { CreateUserDTO } from "../../../../../packages/types/src/dtos/users/createUsers.js"
import type { UpdateUserDTO } from "../../../../../packages/types/src/dtos/users/updateUsers.js"
import type { UserDocument } from "../../collection-schema/users.js"
import { mapUpdateUserDtoToUserDocument } from "../../helpers/helpers.js"
import type { MongoService } from "../../modules/db/MongoService.js"
import { AcademicPeriodsRepository } from "../../repositories/academicPeriods.js"
import { UsersRepository } from "../../repositories/users.js"
import { log } from "../logging/LogService.js"

export class UserService {
	private readonly userRepository: UsersRepository
	private readonly academicPeriodRepository: AcademicPeriodsRepository
	constructor(mongoService: MongoService) {
		this.userRepository = new UsersRepository(mongoService)
		this.academicPeriodRepository = new AcademicPeriodsRepository(mongoService)
	}
	async getUser(
		userId: ObjectId
	): Promise<Omit<UserDocument, "_id" | "password">> {
		const rawUser = await this.userRepository.findById(userId)
		if (!rawUser)
			throw new HTTPException(404, {
				message: "No se encontró el usuario solicitado"
			})
		const { _id, password, ...user } = rawUser
		return user
	}
	async createUser(dto: CreateUserDTO): Promise<string> {
		const user = await this.userRepository.findByEmail(dto.email)
		const { name, startDate, endDate } = dto
		if (user)
			throw new HTTPException(400, {
				message: "Ya existe un usuario con ese correo"
			})
		dto.email = dto.email.toLowerCase()
		dto.password = await argon2.hash(dto.password, { type: argon2.argon2id })
		const academicPeriod: CreateAcademicPeriodsDto = {
			name,
			startDate: new Date(startDate),
			endDate: new Date(endDate)
		}
		try {
			const userId = (await this.userRepository.insertOne(dto)).insertedId
			await this.academicPeriodRepository.insertOne(academicPeriod, userId)
		} catch (_err) {
			log("error", _err, "/users/register")
			throw new HTTPException(500, {
				message:
					"Ocurrió un error al tratar de registrar el periodo académico actual"
			})
		}
		return dto.username
	}
	async updateUser(userId: ObjectId, dto: UpdateUserDTO): Promise<void> {
		// TODO think about moving this to the handler
		const currentUser = await this.userRepository.findById(userId)
		if (!currentUser)
			throw new HTTPException(404, { message: "No se encontró un usuario" })
		if (
			dto.email &&
			(await this.userRepository.findByEmail(dto.email)) !== null
		) {
			throw new HTTPException(404, {
				message: "Ya existe un usuario con ese correo"
			})
		}
		if (dto.password) {
			dto.password = await argon2.hash(dto.password, { type: argon2id })
		}
		const updatedUser = mapUpdateUserDtoToUserDocument(currentUser, dto)
		await this.userRepository.updateOne(userId, updatedUser)
	}
}
