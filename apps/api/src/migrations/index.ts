import type { Db } from "mongodb"
import type { MigrationDocument } from "../collection-schema/migrations.js"
import type { MongoService } from "../modules/db/MongoService.js"
import { migration as updateFontFamilies } from "./migration-objects/001-update-font-families.js"
import { migration as removePixelBFont } from "./migration-objects/002-remove-pixel-b-font.js"
import { migration as changeCourseInstanceSchema } from "./migration-objects/003-change-course-instance-schema.js"
import { migration as  updateCourseInstancesInAcademicPeriod } from "./migration-objects/004-update-academic-period-course-instances.js"
import { migration as updateUserPreferences } from "./migration-objects/005-update-user-preferences-schema.js" 
export type MigrationObject = Omit<MigrationDocument, "_id" | "ranAt"> & {
	up: (db: Db, mongoService: MongoService) => Promise<void>
	down?: (db: Db, mongoService: MongoService) => Promise<void>
}

const migrations: MigrationObject[] = [
	updateFontFamilies,
	removePixelBFont,
	changeCourseInstanceSchema,
	updateCourseInstancesInAcademicPeriod,
	updateUserPreferences
]

export default migrations
