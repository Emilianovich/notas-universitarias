import type { ObjectId } from "mongodb"

export type ValidMigrationNames =
	| "001-update-font-families"
	| "002-remove-pixel-b-font"

export interface MigrationDocument {
	_id?: ObjectId
	name: ValidMigrationNames
	ranAt: Date
}

export type MigrationDto = Omit<MigrationDocument, "_id">
