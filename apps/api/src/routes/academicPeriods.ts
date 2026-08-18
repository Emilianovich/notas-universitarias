import { formatDate } from "@notas-universitarias/helpers"
import { createAcademicPeriodsDTO } from "@notas-universitarias/types"
import { Hono } from "hono"
import { getContextVars } from "../helpers/helpers.js"
import authMiddleware from "../middlewares/auth.js"
import { ZodMiddleware } from "../middlewares/zod.js"
import { AcademicPeriodService } from "../services/academic-periods/AcademicPeriodService.js"

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
		const academicPeriodService = new AcademicPeriodService(
			getContextVars(ctx).mongoService
		)
		const rawDTO = ctx.req.valid("json")
		const { name, startDate, endDate } = rawDTO
		const dto = {
			name,
			startDate,
			endDate
		}
		// REVIEW
		const content = await academicPeriodService.createAcademicPeriod(
			dto,
			userId
		)
		return ctx.json(
			`Registro del periodo académico exitoso. El ${content.name} comienza el ${formatDate(content.startDate)} y termina el ${formatDate(content.endDate)}`
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
