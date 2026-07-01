import type { Collection, ObjectId } from "mongodb"
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
	async insertOne(session: SessionsDocument) {
		return await this.getCollection().insertOne(session)
	}
	async findOneByID(sessionId: ObjectId): Promise<SessionsDocument | null> {
		return await this.getCollection().findOne({ _id: sessionId })
	}
	async deleteAllUserSessions(userId: ObjectId) {
		return await this.getCollection().deleteMany({ userId: userId })
	}
	async deleteAllSessionsExcept(userId: ObjectId, sessionId: ObjectId) {
		await this.getCollection().deleteMany({
			userId: userId,
			_id: { $ne: sessionId }
		})
	}
}
