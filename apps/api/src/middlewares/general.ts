import { formatDate } from "@notas-universitarias/helpers"
import { createMiddleware } from "hono/factory"
import type { MiddlewareVars } from "../index.js"
import { MongoService } from "../modules/db/MongoService.js"
import { log } from "../services/logging/LogService.js"

const generalMiddleware = createMiddleware<MiddlewareVars>(
	async (ctx, next) => {
		const start = Date.now()
		const mongoService = new MongoService()
		await mongoService.connect()
		ctx.set("mongoService", mongoService)
		await next()
		const end = Date.now()
		if (ctx.res.status <= 299) {
			ctx.res = ctx.json({
				statusCode: ctx.res.status,
				content: await ctx.res.json(),
				issuedAt: formatDate(new Date())
			})
		}
		log("info", `This request took ${end - start} ms`)
	}
)
export default generalMiddleware
