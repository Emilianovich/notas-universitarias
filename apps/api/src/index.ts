import { serve } from "@hono/node-server"
import { Hono } from "hono"
import type { ObjectId } from "mongodb"
import { MongoService } from "./modules/db/MongoService.js"

type MiddlewareVars = {
	mongoService: MongoService
	sessionId: ObjectId
}

const app = new Hono<{ Variables: MiddlewareVars }>()

// TODO move middlewares to another file
app.use(async (ctx, next) => {
	const mongoService = new MongoService()
	await mongoService.connect()
	ctx.set("mongoService", mongoService)
	await next()
})

app.get("/", (c) => {
	return c.text(`DB connection works wonders!`)
})

serve(
	{
		fetch: app.fetch,
		port: 3035
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`)
	}
)
