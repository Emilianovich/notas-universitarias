import type { ObjectId } from "mongodb"

export type ValidMigrationNames =
	| "001-update-font-families"
	| "002-remove-pixel-b-font"
	| "003-change-course-instance-schema"
	| "004-update-academic-period-course-instances"
	| "005-update-user-preferences-schema"

export interface MigrationDocument {
	_id?: ObjectId
	name: ValidMigrationNames
	ranAt: Date
}

export type MigrationDto = Omit<MigrationDocument, "_id">
