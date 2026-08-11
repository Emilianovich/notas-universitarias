import type { Collection, Document } from "mongodb"
import type { MongoService } from "../modules/db/MongoService.js"

export abstract class Repository<T extends Document> {
	public readonly mongoService: MongoService
	constructor(mongoService: MongoService) {
		this.mongoService = mongoService
	}
	abstract getCollection(): Collection<T>
}
