import type { ObjectId } from "mongodb"

export interface SessionsDocument {
	_id?: ObjectId
	issuedAt: Date
	expiresAt: Date
	userId: ObjectId
	hash: string
}
