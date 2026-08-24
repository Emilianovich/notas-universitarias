import type { Db } from "mongodb"
import type { MigrationDocument } from "../collection-schema/migrations.js"

export type MigrationObject = Omit<MigrationDocument, "_id" | "ranAt"> & {
	up: (db: Db) => Promise<void>
}

const migrations: MigrationObject[] = []

export default migrations
