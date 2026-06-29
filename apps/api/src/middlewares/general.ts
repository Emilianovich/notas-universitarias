import { createMiddleware } from "hono/factory"
import type {Env} from "../index.js"
import { MongoService } from "../modules/db/MongoService.js"
import {customLog} from "../services/logging/LogService.js";
import {formatDate} from "@notas-universitarias/helpers";

const generalMiddleware = createMiddleware<Env>(async (ctx, next) => {
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
			issuedAt: formatDate(new Date()),
		})
	}
	customLog({level: "info", message:`This request took ${end - start}ms`})
})
export default generalMiddleware
