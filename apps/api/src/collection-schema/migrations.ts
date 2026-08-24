import type { ObjectId } from "mongodb"

export type ValidMigrationNames = ""

export interface MigrationDocument {
	_id?: ObjectId
	name: ValidMigrationNames
	ranAt: Date
}

export type MigrationDto = Omit<MigrationDocument, "_id">
