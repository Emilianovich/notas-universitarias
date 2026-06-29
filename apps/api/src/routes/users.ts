import { Hono } from "hono"

const usersRoutes = new Hono().basePath("/users")
usersRoutes.get("/", (ctx)  => {
	return ctx.json({
		text: "Hi! I finally handle the responses for errors and non errors"
	})
})
export default usersRoutes
