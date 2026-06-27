import { createMiddleware } from "hono/factory"
import type { Env } from "../index.js"
import { MongoService } from "../modules/db/MongoService.js"

const generalMiddleware = createMiddleware<Env>(async (ctx, next) => {
	const mongoService = new MongoService()
	await mongoService.connect()
	ctx.set("mongoService", mongoService)
	await next()
})
export default generalMiddleware
