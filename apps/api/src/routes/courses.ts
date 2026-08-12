import { Hono } from "hono"
import authMiddleware from "../middlewares/auth.js";
import {getContextVars} from "../helpers/helpers.js";
import {CourseService} from "../services/courses/CourseService.js";

const coursesRoutes = new Hono().basePath("/courses")
coursesRoutes.get("/", authMiddleware, async (ctx) => {
	const { mongoService, userId } = getContextVars(ctx)
	const courseService = new CourseService(mongoService)
	return ctx.json(await courseService.getAvailableCoursesInAcademicPeriod(userId))
})
export default coursesRoutes
