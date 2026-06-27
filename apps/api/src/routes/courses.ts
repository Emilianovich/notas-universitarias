import { Hono } from "hono"

const coursesRoutes = new Hono().basePath("/courses")
coursesRoutes.get("/", (ctx) => {
	return ctx.text("Welcome to the courses route!")
})
export default coursesRoutes
