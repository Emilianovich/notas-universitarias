import { serve } from "@hono/node-server"
import { Hono } from "hono"
import type { ObjectId } from "mongodb"
import generalMiddleware from "./middlewares/general.js"
import type { MongoService } from "./modules/db/MongoService.js"
import academicPeriodsRoutes from "./routes/academicPeriods.js"
import authRoutes from "./routes/auth.js"
import courseInstancesRoutes from "./routes/courseInstances.js"
import coursesRoutes from "./routes/courses.js"
import usersRoutes from "./routes/users.js"

export type Env = {
	Variables: {
		mongoService: MongoService
		sessionId: ObjectId
	}
}

const app = new Hono<Env>().basePath("/api/v1")

// Middlewares
app.use(generalMiddleware)

app.get("/", (c) => {
	return c.text(`DB connection works wonders!`)
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
		console.log(`Server is running on http://localhost:${info.port}`)
	}
)
