import type { ObjectId } from "mongodb"
import type { UserDocument } from "../collection-schema/users.js"
import type { MongoService } from "../modules/db/MongoService.js"
import { Repository } from "./repository.js"

export class UsersRepository extends Repository<UserDocument> {
	constructor(mongoService: MongoService) {
		super(mongoService)
	}

	getCollection() {
		return this.mongoService.collection<UserDocument>("users")
	}
	async findById(userId: ObjectId): Promise<UserDocument | null> {
		return this.getCollection().findOne({ _id: userId })
	}
	async findByEmail(email: string): Promise<UserDocument | null> {
		return this.getCollection().findOne({ email })
	}
}
