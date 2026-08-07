import { addDate, convertToSeconds } from "@notas-universitarias/helpers"
import argon2, { argon2id } from "argon2"
import { HTTPException } from "hono/http-exception"
import { ObjectId } from "mongodb"
import type { LoginDTO } from "../../../../../packages/types/src/dtos/auth/login.js"
import type { MongoService } from "../../modules/db/MongoService.js"
import { SessionsRepository } from "../../repositories/sessions.js"
import { UsersRepository } from "../../repositories/users.js"
import { log } from "../logging/LogService.js"

export class AuthService {
	private sessionsRepository: SessionsRepository
	private usersRepository: UsersRepository
	constructor(mongoService: MongoService) {
		this.sessionsRepository = new SessionsRepository(mongoService)
		this.usersRepository = new UsersRepository(mongoService)
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
}
