import type { Collection } from "mongodb"
import type { SessionsDocument } from "../collection-schema/sessions.js"
import { Repository } from "./repository.js"

export class SessionsRepository extends Repository<SessionsDocument> {
	getCollection(): Collection<SessionsDocument> {
		return this.mongoService.collection<SessionsDocument>("sessions")
	}
}
