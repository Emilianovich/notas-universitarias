import { Hono } from "hono"

const academicPeriodsRoutes = new Hono().basePath("/academic-periods")
academicPeriodsRoutes.get("/", (ctx) => {
	return ctx.text("Welcome to the academic periods route!")
})
export default academicPeriodsRoutes
