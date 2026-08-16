import {
	type ChangePasswordDto,
	changePasswordSchema, type CreateUserDTO, createUserDto, type DataAfterRegister, dataAfterUserRegisterSchema,
	type LoginDTO,
	loginDTO
} from "@notas-universitarias/types"
import { Hono } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import getValidObjectId, { getContextVars } from "../helpers/helpers.js"
import type { MiddlewareVars } from "../index.js"
import authMiddleware from "../middlewares/auth.js"
import { ZodMiddleware } from "../middlewares/zod.js"
import env from "../modules/config/env.js"
import { AuthService } from "../services/auth/AuthService.js"

const authRoutes = new Hono<MiddlewareVars>().basePath("/auth")

authRoutes.post("/register", ZodMiddleware("json", createUserDto),async (ctx) => {
	const { mongoService } = getContextVars(ctx)
	const dto : CreateUserDTO = ctx.req.valid("json")
	const {userId, maxAge} = await (new AuthService(mongoService)).createUser(dto)
	setCookie(ctx, env.TEMP_USER_COOKIE_NAME, userId.toString(), {
		path: "/",
		secure: env.SESSION_COOKIE_SECURE,
		sameSite: env.COOKIE_SAME_SITE,
		httpOnly: true,
		maxAge
	})
	// TODO REVIEW: cambiar quizás el nombre
	return ctx.json("Tu cuenta fue creada. Si quieres, puedes terminar unas configuraciones")
})

authRoutes.post("/register-after-creation", ZodMiddleware("json", dataAfterUserRegisterSchema),async (ctx) => {
	const userId = getValidObjectId(getCookie(ctx, env.TEMP_USER_COOKIE_NAME))
	const { mongoService } = getContextVars(ctx)
	const dto : DataAfterRegister = ctx.req.valid("json")
	const authService = new AuthService(mongoService)
	await authService.handleUpdateAfterRegister(dto, userId)
	return ctx.json("¡Tu cuenta está preparada!")
})

authRoutes.post("/login", ZodMiddleware("json", loginDTO), async (ctx) => {
	const authService = new AuthService(getContextVars(ctx).mongoService)
	const dto: LoginDTO = ctx.req.valid("json")
	const [sessionId, hash, maxAge] = await authService.login(dto)
	const sessionCookie = `${sessionId.toString()}.${hash}`
	setCookie(ctx, env.SESSION_COOKIE_NAME, sessionCookie, {
		path: "/",
		secure: env.SESSION_COOKIE_SECURE,
		sameSite: env.COOKIE_SAME_SITE,
		httpOnly: true,
		maxAge
	})
	return ctx.json("Greetings and salutations")
})

authRoutes.delete("/logout", authMiddleware, async (ctx) => {
	const authService = new AuthService(getContextVars(ctx).mongoService)
	await authService.logout(getContextVars(ctx).userId)
	if (getCookie(ctx, env.SESSION_COOKIE_NAME)) {
		deleteCookie(ctx, env.SESSION_COOKIE_NAME)
	}
	return ctx.json("Sesión cerrada exitosamente")
})

authRoutes.put(
	"/change-password",
	authMiddleware,
	ZodMiddleware("json", changePasswordSchema),
	async (ctx) => {
		const { mongoService, userId } = getContextVars(ctx)
		const authService = new AuthService(mongoService)
		const dto: ChangePasswordDto = ctx.req.valid("json")
		await authService.handlePasswordChange(userId, dto)
		return ctx.json("Contraseña actualizada exitosamente")
	}
)
export default authRoutes
