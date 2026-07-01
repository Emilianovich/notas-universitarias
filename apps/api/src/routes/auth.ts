import { Hono } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { type LoginDTO, loginDTO } from "../dtos/auth/login.js"
import type { MiddlewareVars } from "../index.js"
import authMiddleware from "../middlewares/auth.js"
import { ZodMiddleware } from "../middlewares/zod.js"
import { AuthService } from "../services/auth/AuthService.js"
import { log } from "../services/logging/LogService.js"

const authRoutes = new Hono<MiddlewareVars>().basePath("/auth")

authRoutes.post("/login", ZodMiddleware("json", loginDTO), async (ctx) => {
	const authService = new AuthService(ctx.get("mongoService"))
	const dto: LoginDTO = ctx.req.valid("json")
	const [sessionId, hash, maxAge] = await authService.login(dto)
	const sessionCookie = `${sessionId.toString()}.${hash}`
	setCookie(ctx, "user_session", sessionCookie, {
		path: "/api",
		secure: true,
		sameSite: "lax",
		httpOnly: true,
		maxAge
	})
	return ctx.json("Greetings and salutations")
})

authRoutes.post("/logout", authMiddleware, async (ctx) => {
	const authService = new AuthService(ctx.get("mongoService"))
	await authService.logout(ctx.get("userId"))
	if (getCookie(ctx, "user_session")) {
		log("info", "Got a cookie")
		deleteCookie(ctx, "user_session")
		log("info", `${getCookie(ctx, "user_session")}`)
	}
	return ctx.json("Sesión cerrada exitosamente")
})

export default authRoutes
