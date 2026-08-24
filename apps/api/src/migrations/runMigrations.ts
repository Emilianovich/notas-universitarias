import { MongoService } from "../modules/db/MongoService.js"
import { MigrationsRepository } from "../repositories/migrations.js"
import { log } from "../services/logging/LogService.js"
import migrations from "./index.js"

const mongoService = new MongoService()

async function runMigrations() {
	try {
		await mongoService.connect()
		const migrationRepository = new MigrationsRepository(mongoService)
		const allUsersMigrations = await migrationRepository.findAllMigrations()
		for await (const migration of migrations) {
			const hasBeenRun = allUsersMigrations.some(
				(userMigration) => userMigration.name === migration.name
			)
			if (!hasBeenRun) {
				await migration.up(mongoService.db)
				const { name } = migration
				await migrationRepository.insertOne({ name, ranAt: new Date() })
			}
		}
	} finally {
		await mongoService.disconnect()
	}
}

runMigrations()
	.then(() => {
		log("info", "Successfully ran pending migrations")
	})
	.catch((error) => {
		log("error", error)
	})
