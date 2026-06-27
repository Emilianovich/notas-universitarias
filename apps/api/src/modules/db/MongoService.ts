import * as process from "node:process"
import type { ValidCollections } from "@notas-universitarias/types"
import { type Db, type Document, MongoClient } from "mongodb"
import ConfigService from "../config/ConfigService.js"

export class MongoService {
	private client: MongoClient
	// @ts-expect-error
	public db: Db
	constructor() {
		const config = new ConfigService()
		if (process.env.NODE_ENV !== "production") {
			this.client = new MongoClient(config.getConfig("DB_URI_DEV"))
		} else {
			this.client = new MongoClient(config.getConfig("DB_URI_PROD"))
		}
	}

	async connect() {
		const connection = await this.client.connect()
		this.db = connection.db()
	}
	collection<T extends Document>(name: ValidCollections) {
		return this.db.collection<T>(name)
	}
}
