import type { Collection } from "mongodb"
import type {
	MigrationDocument,
	MigrationDto
} from "../collection-schema/migrations.js"
import { Repository } from "./repository.js"

export class MigrationsRepository extends Repository<MigrationDocument> {
	getCollection(): Collection<MigrationDocument> {
		return this.mongoService.collection("migrations")
	}
	async insertOne(migration: MigrationDto) {
		await this.getCollection().insertOne(migration)
	}
	async findAllMigrations(): Promise<MigrationDocument[]> {
		return this.getCollection().find().toArray()
	}
}
