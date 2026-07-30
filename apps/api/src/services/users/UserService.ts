import argon2, { argon2id } from "argon2"
import { HTTPException } from "hono/http-exception"
import type { ObjectId } from "mongodb"
import type { CreateUserDTO } from "../../../../../packages/types/src/dtos/users/createUsers.js"
import type { UpdateUserDTO } from "../../../../../packages/types/src/dtos/users/updateUsers.js"
import type { UserDocument } from "../../collection-schema/users.js"
import type { MongoService } from "../../modules/db/MongoService.js"
import { UsersRepository } from "../../repositories/users.js"

export class UserService {
	private readonly userRepository: UsersRepository
	constructor(mongoService: MongoService) {
		this.userRepository = new UsersRepository(mongoService)
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
		if (user)
			throw new HTTPException(400, {
				message: "Ya existe un usuario con ese correo"
			})
		dto.email = dto.email.toLowerCase()
		dto.password = await argon2.hash(dto.password, { type: argon2.argon2id })
		await this.userRepository.insertOne(dto)
		return dto.name
	}
	async updateUser(
		userId: ObjectId,
		dto: UpdateUserDTO | undefined
	): Promise<void> {
		// TODO think about moving this to the handler
		if (!dto || !Object.keys(dto).length)
			throw new HTTPException(400, {
				message: "Por lo menos un campo tiene que ser actualizado"
			})
		const currentUser = await this.userRepository.findById(userId)
		if (!currentUser)
			throw new HTTPException(404, { message: "No se encontró un usuario" })
		if (dto.email) {
			if ((await this.userRepository.findByEmail(dto.email)) !== null)
				throw new HTTPException(404, {
					message: "Ya existe un usuario con ese correo"
				})
		}
		if (dto.password) {
			dto.password = await argon2.hash(dto.password, { type: argon2id })
		}
		const { _id, ...updatedUser } = {
			...currentUser,
			...dto
		}
		await this.userRepository.updateOne(userId, updatedUser)
	}
}
