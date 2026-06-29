import { serve } from "@hono/node-server"
import {Context, Hono} from "hono"
import type { ObjectId } from "mongodb"
import generalMiddleware from "./middlewares/general.js"
import type { MongoService } from "./modules/db/MongoService.js"
import academicPeriodsRoutes from "./routes/academicPeriods.js"
import authRoutes from "./routes/auth.js"
import courseInstancesRoutes from "./routes/courseInstances.js"
import coursesRoutes from "./routes/courses.js"
import usersRoutes from "./routes/users.js"
import {customLog} from "./services/logging/LogService.js";
import {formatDate} from "@notas-universitarias/helpers";
import {HTTPException} from "hono/http-exception";

export type Env = {
	Variables: {
		mongoService: MongoService
		sessionId: ObjectId
	}
}
const app = new Hono<Env>().basePath("/api/v1")

// Middlewares
app.use(generalMiddleware)
app.onError((err, c) => {
	if (err instanceof HTTPException) {
		customLog({level: "error", message: err.message})
		return c.json({
			statusCode: err.status,
			errors: err.message,
			issuedAt: formatDate(new Date()),
		}, err.status)
	}
	c.status(500)
	customLog({level: "error", message: `${err.message}`})
	return c.json({
		statusCode: 500,
		errors: "Something unexpected happened",
		issuedAt: formatDate(new Date()),
	})
})

// Routes
app.get("/", (ctx) => {
	return ctx.json("Welcome to my API for Notas Universitarias")
})
app.route("/", authRoutes)
app.route("/", usersRoutes)
app.route("", coursesRoutes)
app.route("/", courseInstancesRoutes)
app.route("/", academicPeriodsRoutes)

serve(
	{
		fetch: app.fetch,
		port: 3035
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}/api/v1`)
	}
)
