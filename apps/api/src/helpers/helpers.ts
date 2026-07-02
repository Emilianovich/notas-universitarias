import type { Context } from "hono"
import type { ObjectId } from "mongodb"
import type { MiddlewareVars } from "../index.js"
import type { MongoService } from "../modules/db/MongoService.js"

export function getContextVars(
	ctx: Context<MiddlewareVars>
): [MongoService, ObjectId] {
	const mongoService = ctx.get("mongoService")
	const userId = ctx.get("userId")
	return [mongoService, userId]
}
