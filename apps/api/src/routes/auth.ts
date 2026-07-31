import { Hono } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import {
	type LoginDTO,
	loginDTO
} from "../../../../packages/types/src/dtos/auth/login.js"
import { getContextVars } from "../helpers/helpers.js"
import type { MiddlewareVars } from "../index.js"
import authMiddleware from "../middlewares/auth.js"
import { ZodMiddleware } from "../middlewares/zod.js"
import env from "../modules/config/env.js"
import { AuthService } from "../services/auth/AuthService.js"

const authRoutes = new Hono<MiddlewareVars>().basePath("/auth")

authRoutes.post("/login", ZodMiddleware("json", loginDTO), async (ctx) => {
	const authService = new AuthService(getContextVars(ctx).mongoService)
	const dto: LoginDTO = ctx.req.valid("json")
	const [sessionId, hash, maxAge] = await authService.login(dto)
	const sessionCookie = `${sessionId.toString()}.${hash}`
	setCookie(ctx, env.SESSION_COOKIE_NAME, sessionCookie, {
		path: "/api",
		secure: env.SESSION_COOKIE_SECURE,
		sameSite: env.COOKIE_SAME_SITE,
		httpOnly: true,
		maxAge
	})
	return ctx.json("Greetings and salutations")
})

authRoutes.post("/logout", authMiddleware, async (ctx) => {
	const authService = new AuthService(getContextVars(ctx).mongoService)
	await authService.logout(getContextVars(ctx).userId)
	if (getCookie(ctx, env.SESSION_COOKIE_NAME)) {
		deleteCookie(ctx, env.SESSION_COOKIE_NAME)
	}
	return ctx.json("Sesión cerrada exitosamente")
})

export default authRoutes
