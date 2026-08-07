import { serve } from "@hono/node-server"
import { convertToSeconds, formatDate } from "@notas-universitarias/helpers"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { HTTPException } from "hono/http-exception"
import type { ObjectId } from "mongodb"
import generalMiddleware from "./middlewares/general.js"
import env from "./modules/config/env.js"
import type { MongoService } from "./modules/db/MongoService.js"
import academicPeriodsRoutes from "./routes/academicPeriods.js"
import authRoutes from "./routes/auth.js"
import courseInstancesRoutes from "./routes/courseInstances.js"
import coursesRoutes from "./routes/courses.js"
import usersRoutes from "./routes/users.js"
import { log } from "./services/logging/LogService.js"

export type MiddlewareVars = {
	Variables: {
		mongoService: MongoService
		userId: ObjectId
		user_session: string
	}
}
const app = new Hono<MiddlewareVars>().basePath("/api/v1")
// Middlewares
app.use(
	"*",
	cors({
		origin: env.CORS_ALLOWED_ORIGINS,
		allowMethods: ["GET", "POST", "PUT", "DELETE"],
		allowHeaders: ["Content-Type"],
		credentials: true,
		maxAge: convertToSeconds({ amount: 1, units: "hour" })
	})
)
app.use(generalMiddleware)
app.onError((err, c) => {
	if (err instanceof HTTPException) {
		log(
			"error",
			!err.message.trim().length
				? "Ocurrió un error, imprime la propiedad 'errors' de la respuesta para ver qué pasó"
				: err.message
		)
		return c.json(
			{
				statusCode: err.status,
				errors: err.cause ? err.cause : err.message,
				issuedAt: formatDate(new Date())
			},
			err.status
		)
	}
	c.status(500)
	log("error", `${err.message} ${err.cause}`)
	return c.json({
		statusCode: 500,
		errors: "Something unexpected happened",
		issuedAt: formatDate(new Date())
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
