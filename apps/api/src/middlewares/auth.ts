import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import type { MiddlewareVars } from "../index.js"
import { AuthService } from "../services/auth/AuthService.js"

const authMiddleware = createMiddleware<MiddlewareVars>(async (ctx, next) => {
	const cookies = getCookie(ctx, "user_session")
	if (!cookies)
		throw new HTTPException(401, {
			message: "No se pudo validar la sesión, vuelva a iniciar sesión"
		})
	const [sessionId, rawHash] = cookies.split(".")
	const mongoService = ctx.get("mongoService")
	const authService = new AuthService(mongoService)
	const userId = await authService.validateSession(sessionId, rawHash)
	ctx.set("userId", userId)
	await next()
})
export default authMiddleware
