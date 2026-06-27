import { Hono } from "hono"

const usersRoutes = new Hono().basePath("/users")
usersRoutes.get("/", (ctx) => {
	return ctx.text("Welcome to the users route!")
})
export default usersRoutes
