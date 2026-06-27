import { Hono } from "hono"

const authRoutes = new Hono().basePath("/auth")
authRoutes.get("/", (ctx) => {
	return ctx.text("Welcome to the auth route!")
})
export default authRoutes
