import { Hono } from "hono"
import { type CreateUserDTO, createUserDto } from "../dtos/users/createUsers.js"
import type { MiddlewareVars } from "../index.js"
import { ZodMiddleware } from "../middlewares/zod.js"
import { log } from "../services/logging/LogService.js"
import { UserService } from "../services/users/UserService.js"

const usersRoutes = new Hono<MiddlewareVars>().basePath("/users")

usersRoutes.get("/", (ctx) => {
	return ctx.json({
		text: "Hi! I finally handle the responses for errors and non errors"
	})
})

// Create user
usersRoutes.post("/", ZodMiddleware("json", createUserDto), async (ctx) => {
	const mongoService = ctx.get("mongoService")
	const dto: CreateUserDTO = ctx.req.valid("json")
	const username = await new UserService(mongoService).createUser(dto)
	log("info", `New user created!`)
	ctx.status(201)
	return ctx.json(`Bienvenido ${username}`)
})

export default usersRoutes
