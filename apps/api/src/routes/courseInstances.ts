import { Hono } from "hono"
import type { ObjectId } from "mongodb"
import { CreateCourseInstanceSchema } from "../../../../packages/types/src/dtos/courseInstances/createCourseInstances.js"
import {
	type UpdateCourseInstanceDto,
	updateCourseInstanceSchema
} from "../../../../packages/types/src/dtos/courseInstances/updateCourseInstances.js"
import type { CourseDocument } from "../collection-schema/courses.js"
import getValidObjectId, { getContextVars } from "../helpers/helpers.js"
import type { MiddlewareVars } from "../index.js"
import authMiddleware from "../middlewares/auth.js"
import { ZodMiddleware } from "../middlewares/zod.js"
import { CoursesRepository } from "../repositories/courses.js"
import { CourseService } from "../services/courses/CourseService.js"

const courseInstancesRoutes = new Hono<MiddlewareVars>().basePath(
	"/course-instances"
)
courseInstancesRoutes.use(authMiddleware)

// TODO remove this for prod, it's only for dev
courseInstancesRoutes.get("/", async (ctx) => {
	const { mongoService, userId } = getContextVars(ctx)
	const courses: CourseDocument[] = []
	const repo = new CoursesRepository(mongoService)
	for await (const course of await repo.findAllByUserId(userId)) {
		courses.push(course)
	}
	const courseInstances: ObjectId[] = []

	for (const course of courses) {
		courseInstances.push(...course.courseInstances)
	}
	return ctx.json(courseInstances)
})

// Get a specific course instance
courseInstancesRoutes.get("/:id", async (ctx) => {
	const courseInstanceId = getValidObjectId(ctx.req.param("id"))
	const { mongoService, userId } = getContextVars(ctx)
	const { courseInstance } = await new CourseService(
		mongoService
	).getCourseInstance(courseInstanceId, userId)
	return ctx.json(courseInstance)
})

// Create a course instance and maybe a Course
courseInstancesRoutes.post(
	"/",
	ZodMiddleware("json", CreateCourseInstanceSchema),
	async (ctx) => {
		const { mongoService, userId } = getContextVars(ctx)
		const { previousCourseId, ...dto } = ctx.req.valid("json")
		await new CourseService(mongoService).handleCourseCreation(
			dto,
			userId,
			previousCourseId
		)
		return ctx.json("La materia fue agregada exitosamente")
	}
)

courseInstancesRoutes.put(
	"/:id",
	ZodMiddleware("json", updateCourseInstanceSchema),
	async (ctx) => {
		const courseInstanceId = getValidObjectId(ctx.req.param("id"))
		const { mongoService, userId } = getContextVars(ctx)
		const dto: UpdateCourseInstanceDto = ctx.req.valid("json")
		await new CourseService(mongoService).handleCourseInstanceUpdate(
			dto,
			courseInstanceId,
			userId
		)
		return ctx.json("La materia fue actualizada exitosamente")
	}
)

export default courseInstancesRoutes
