import type { Collection, Document } from "mongodb"
import type { MongoService } from "../modules/db/MongoService.js"

export abstract class Repository<T extends Document> {
	public readonly mongoService: MongoService
	constructor(mongoService: MongoService) {
		this.mongoService = mongoService
	}
	abstract getCollection(): Collection<T>
	// throwMongoErrors<T extends MongoError>(
	// 	err: T,
	// 	status: ContentfulStatusCode = 500,
	// 	message: string
	// ) {
	// 	if (err instanceof MongoServerError) {
	// 		throw new HTTPException(status, { message })
	// 	} else if (err instanceof MongoNetworkError) {
	// 		throw new HTTPException(500, {
	// 			message:
	// 				"Ocurrió un error de red. Asegúrese que su contenedor de Docker (MongoDB) esté corriendo"
	// 		})
	// 	} else {
	// 		throw new HTTPException(500, {
	// 			message:
	// 				"Ocurrió error inesperado con MongoDB. Asegúrese que su contenedor de Docker esté corriendo"
	// 		})
	// 	}
	// }
}
