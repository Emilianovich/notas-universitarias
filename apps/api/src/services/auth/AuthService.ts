import {addDate, convertToMillis, convertToSeconds} from "@notas-universitarias/helpers"
import type {
	ChangePasswordDto,
	CreateSettingsDto,
	CreateUserDTO,
	DataAfterRegister,
	LoginDTO
} from "@notas-universitarias/types"
import argon2, { argon2id } from "argon2"
import { HTTPException } from "hono/http-exception"
import { ObjectId } from "mongodb"
import type { MongoService } from "../../modules/db/MongoService.js"
import { AcademicPeriodsRepository } from "../../repositories/academicPeriods.js"
import { SessionsRepository } from "../../repositories/sessions.js"
import { UsersRepository } from "../../repositories/users.js"
import { log } from "../logging/LogService.js"

export class AuthService {
	private sessionsRepository: SessionsRepository
	private usersRepository: UsersRepository
	private academicPeriodsRepository: AcademicPeriodsRepository
	constructor(mongoService: MongoService) {
		this.sessionsRepository = new SessionsRepository(mongoService)
		this.usersRepository = new UsersRepository(mongoService)
		this.academicPeriodsRepository = new AcademicPeriodsRepository(mongoService)
	}
	async login(dto: LoginDTO): Promise<[ObjectId, string, number]> {
		const user = await this.usersRepository.findByEmail(dto.email)
		if (!user)
			throw new HTTPException(400, {
				message: "Correo o contraseña incorrectos"
			})
		const arePasswordEqual = await argon2.verify(user.password, dto.password)
		if (!arePasswordEqual)
			throw new HTTPException(400, {
				message: "Correo o contraseña incorrectos"
			})
		await this.sessionsRepository.deleteAllUserSessions(user._id as ObjectId)
		const issuedAt = Date.now()
		const cookieMaxAge = convertToSeconds({ amount: 1, units: "days" })
		const expiresAt = addDate({ date: Date.now(), amount: 1, units: "days" })
		// TODO this might change in the future
		const sessionHash = crypto.randomUUID()
		const hash = await argon2.hash(sessionHash, { type: argon2id })
		const session = await this.sessionsRepository.insertOne({
			issuedAt: new Date(issuedAt),
			expiresAt: new Date(expiresAt),
			userId: user._id as ObjectId,
			hash
		})
		await this.sessionsRepository.deleteAllSessionsExcept(
			user._id as ObjectId,
			session.insertedId
		)
		await this.academicPeriodsRepository.finalizeUnactive(user._id as ObjectId)
		return [session.insertedId, sessionHash, cookieMaxAge]
	}
	async validateSession(sessionId: string, rawHash: string): Promise<ObjectId> {
		if (!ObjectId.isValid(sessionId)) {
			log("error", "La sesión fue alterada. No es válida")
			throw new HTTPException(400, { message: "No se pudo validar su sesión" })
		}
		const session = await this.sessionsRepository.findOneByID(
			new ObjectId(sessionId)
		)
		if (!session)
			throw new HTTPException(401, { message: "No se pudo validar su sesión" })
		const sessionValid = await argon2.verify(session.hash, rawHash)
		if (!sessionValid)
			throw new HTTPException(401, {
				message: "La sesión fue alterada. No es válida"
			})
		return session.userId
	}
	async logout(userId: ObjectId): Promise<void> {
		await this.sessionsRepository.deleteAllUserSessions(userId)
	}
	async handlePasswordChange(userId: ObjectId, dto: ChangePasswordDto) {
		const user = await this.usersRepository.findById(userId)
		if (!user)
			throw new HTTPException(404, {
				message: "No se encontró el usuario especificado"
			})
		if (await argon2.verify(user.password, dto.password))
			throw new HTTPException(400, {
				message: "Ingresa una contraseña distinta a la anterior"
			})
		user.password = await argon2.hash(dto.password, { type: argon2.argon2id })
		await this.usersRepository.updateOne(userId, user)
	}
	async handleUpdateAfterRegister(dto: DataAfterRegister, userId: ObjectId) {
		// 1. Validate user exists
		const user = await this.usersRepository.findById(userId)
		if (!user)
			throw new HTTPException(404, {
				message: "No existe un usuario con esas credenciales"
			})
		// 2. Use UserDocument to update user with settings
		try {
			if (dto.settings) {
				user.preferences = {
					...dto.settings
				}
				await this.usersRepository.updateOne(userId, user)
			}
			if (dto.academicPeriod) {
				await this.academicPeriodsRepository.insertOne(dto.academicPeriod, userId)
			}
		} catch (_err) {
			throw new HTTPException(500, {  message: "Ocurrió un error al actualizar sus datos. Redirígese al login."  })
		}
	}

	async createUser(dto: CreateUserDTO) {
		// 1. Validate if user email does not exist
		const user = await this.usersRepository.findByEmail(dto.email)
		if (user)
			throw new HTTPException(400, {
				message: "Ya existe un usuario con ese correo"
			})
		// 2. Hash password
		dto.password = await argon2.hash(dto.password, { type: argon2.argon2id })
		// 3. Lower case user email
		dto.email = dto.email.toLowerCase()
		// 4. Return new userId
		const maxAge = convertToMillis({  amount: 30, units: "min"  })
		return {
			userId: (await this.usersRepository.insertOne(dto)).insertedId,
			maxAge
		}
	}
}
