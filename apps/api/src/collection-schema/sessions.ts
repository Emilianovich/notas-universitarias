import type { ObjectId } from "mongodb"

export interface SessionsDocument {
	_id: ObjectId
	issuedAt: number
	expiresAt: number
	userId: ObjectId
	hash: string
}
