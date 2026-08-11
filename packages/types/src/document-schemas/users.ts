import type { UserPreferences } from "@notas-universitarias/types/db"
import type { ObjectId } from "mongodb"

export interface UserDocument {
	_id?: ObjectId
	name: string
	email: string
	password: string
	preferences: UserPreferences
}
