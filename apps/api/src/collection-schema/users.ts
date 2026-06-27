import type { ObjectId } from "mongodb"

export interface UserDocument {
	_id: ObjectId
	name: string
	email: string
	password: string
}
