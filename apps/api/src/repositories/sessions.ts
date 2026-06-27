import type { Collection } from "mongodb"
import type { SessionsDocument } from "../collection-schema/sessions.js"
import type { MongoService } from "../modules/db/MongoService.js"
import { Repository } from "./repository.js"

export class SessionsRepository extends Repository<SessionsDocument> {
	constructor(mongoService: MongoService) {
		super(mongoService)
	}
	getCollection(): Collection<SessionsDocument> {
		return this.mongoService.collection<SessionsDocument>("sessions")
	}
}
