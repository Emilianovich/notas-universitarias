import { Hono } from "hono"
import { createAcademicPeriodsDTO } from "../../../../packages/types/src/dtos/academicPeriods/createAcademicPeriods.js"
import { getContextVars } from "../helpers/helpers.js"
import authMiddleware from "../middlewares/auth.js"
import { ZodMiddleware } from "../middlewares/zod.js"
import { AcademicPeriodService } from "../services/academic-periods/AcademicPeriodService.js"
import { log } from "../services/logging/LogService.js"

const academicPeriodsRoutes = new Hono()
	.basePath("/academic-periods")
	.use(authMiddleware)
academicPeriodsRoutes.get("/", async (ctx) => {
	const academicPeriodService = new AcademicPeriodService(
		getContextVars(ctx).mongoService
	)
	const currentAcademicPeriod =
		await academicPeriodService.getCurrentAcademicPeriod(
			getContextVars(ctx).userId
		)
	return ctx.json(currentAcademicPeriod)
})

academicPeriodsRoutes.post(
	"/",
	ZodMiddleware("json", createAcademicPeriodsDTO),
	async (ctx) => {
		const { userId } = getContextVars(ctx)
		log("info", `User id ${userId}`)
		const academicPeriodService = new AcademicPeriodService(
			getContextVars(ctx).mongoService
		)
		const rawDTO = ctx.req.valid("json")
		const { name, startDate, endDate } = rawDTO
		const dto = {
			name,
			startDate: new Date(startDate),
			endDate: new Date(endDate)
		}
		const content = await academicPeriodService.createAcademicPeriod(
			dto,
			userId
		)
		return ctx.json(
			`Registro del periodo académico exitoso. El ${content.name} comienza el ${content.startDate} y termina el ${content.endDate}`
		)
	}
)
academicPeriodsRoutes.get("/history", async (ctx) => {
	const academicPeriodService = new AcademicPeriodService(
		getContextVars(ctx).mongoService
	)
	return ctx.json(
		await academicPeriodService.getUnactiveAcademicPeriods(
			getContextVars(ctx).userId
		)
	)
})
export default academicPeriodsRoutes
