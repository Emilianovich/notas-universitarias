import { convertToMillis } from "@notas-universitarias/helpers"
import type { ValidCollections } from "@notas-universitarias/types"
import { HTTPException } from "hono/http-exception"
import {
	type Db,
	type Document,
	MongoClient,
	MongoServerSelectionError
} from "mongodb"
import env from "../config/env.js"
export class MongoService {
	private client: MongoClient
	// @ts-expect-error
	public db: Db
	private tryConnect = async () => {
		const connection = await this.client.connect()
		this.db = connection.db()
	}
	private isConnected: boolean = false
	constructor() {
		this.client = new MongoClient(
			env.IS_PROD ? env.DB_URI_PROD : env.DB_URI_DEV,
			{
				serverSelectionTimeoutMS: convertToMillis({ amount: 3, units: "s" })
			}
		)
	}

	private async handleMongoErrors(fn: () => Promise<void>) {
		try {
			await fn()
		} catch (err) {
			if (err instanceof MongoServerSelectionError) {
				throw new HTTPException(500, {
					message:
						"No se logró la conexión a MongoDB. Asegúrate que tu contenedor Docker esté corriendo"
				})
			} else {
				throw new HTTPException(500, {
					message: `Ocurrió algo inesperado : ${err}`
				})
			}
		}
	}
	async connect() {
		await this.handleMongoErrors(this.tryConnect)
		this.isConnected = true
	}
	async disconnect() {
		if (this.isConnected) {
			await this.db.client.close()
		}
	}
	collection<T extends Document>(name: ValidCollections) {
		return this.db.collection<T>(name)
	}
}
