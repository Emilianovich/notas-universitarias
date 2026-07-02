import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import { getContextVars } from "../helpers/helpers.js"
import type { MiddlewareVars } from "../index.js"
import { AuthService } from "../services/auth/AuthService.js"

const authMiddleware = createMiddleware<MiddlewareVars>(async (ctx, next) => {
	const cookies = getCookie(ctx, "user_session")
	if (!cookies)
		throw new HTTPException(401, {
			message: "No se pudo validar la sesión, vuelva a iniciar sesión"
		})
	const [sessionId, rawHash] = cookies.split(".")
	const [mongoService, userId] = getContextVars(ctx)
	const authService = new AuthService(mongoService)
	await authService.validateSession(sessionId, rawHash)
	ctx.set("userId", userId)
	await next()
})
export default authMiddleware
