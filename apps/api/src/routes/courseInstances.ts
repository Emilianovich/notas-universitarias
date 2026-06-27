import { Hono } from "hono"

const courseInstancesRoutes = new Hono().basePath("/course-instances")
courseInstancesRoutes.get("/", (ctx) => {
	return ctx.text("Welcome to the course instances route!")
})
export default courseInstancesRoutes
