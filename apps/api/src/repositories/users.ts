import type { ObjectId } from "mongodb"
import type { CreateUserDTO } from "../../../../packages/types/src/dtos/users/createUsers.js"
import type { UserDocument } from "../collection-schema/users.js"
import { Repository } from "./repository.js"

export class UsersRepository extends Repository<UserDocument> {
	getCollection() {
		return this.mongoService.collection<UserDocument>("users")
	}
	async findById(userId: ObjectId): Promise<UserDocument | null> {
		return this.getCollection().findOne({ _id: userId })
	}
	async findByEmail(email: string): Promise<UserDocument | null> {
		return this.getCollection().findOne({ email })
	}
	async insertOne(user: CreateUserDTO) {
		return this.getCollection().insertOne({
			name: user.name,
			email: user.email,
			password: user.password
		})
	}
	async updateOne(userId: ObjectId, dto: CreateUserDTO) {
		await this.getCollection().replaceOne({ _id: userId }, dto)
	}
}
