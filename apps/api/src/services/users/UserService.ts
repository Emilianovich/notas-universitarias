import argon2 from "argon2"
import { HTTPException } from "hono/http-exception"
import type { CreateUserDTO } from "../../dtos/users/createUsers.js"
import type { MongoService } from "../../modules/db/MongoService.js"
import { UsersRepository } from "../../repositories/users.js"

export class UserService {
	private userRepository: UsersRepository
	constructor(mongoService: MongoService) {
		this.userRepository = new UsersRepository(mongoService)
	}
	async createUser(dto: CreateUserDTO): Promise<string> {
		const user = await this.userRepository.findByEmail(dto.email)
		if (user)
			throw new HTTPException(400, {
				message: "Ya existe un usuario con ese correo"
			})
		dto.password = await argon2.hash(dto.password, { type: argon2.argon2id })
		await this.userRepository.insertOne(dto)
		return dto.name
	}
}
