import { Context, Hono } from "hono"
import { type CreateUserDTO, createUserDto } from "../dtos/users/createUsers.js"
import { updateUserDTO } from "../dtos/users/updateUsers.js"
import { getContextVars } from "../helpers/helpers.js"
import type { MiddlewareVars } from "../index.js"
import authMiddleware from "../middlewares/auth.js"
import { ZodMiddleware } from "../middlewares/zod.js"
import { log } from "../services/logging/LogService.js"
import { UserService } from "../services/users/UserService.js"

const usersRoutes = new Hono<MiddlewareVars>().basePath("/users")

// Get user profile
usersRoutes.get("/", authMiddleware, async (ctx) => {
	const [mongoService, userId] = getContextVars(ctx)
	const user = await new UserService(mongoService).getUser(userId)
	return ctx.json({ user })
})

// Create user
usersRoutes.post("/", ZodMiddleware("json", createUserDto), async (ctx) => {
	const [mongoService] = getContextVars(ctx)
	const dto: CreateUserDTO = ctx.req.valid("json")
	const username = await new UserService(mongoService).createUser(dto)
	log("info", `New user created!`)
	ctx.status(201)
	return ctx.json(`Bienvenido ${username}`)
})

// Update users
usersRoutes.put(
	"/",
	authMiddleware,
	ZodMiddleware("json", updateUserDTO),
	async (ctx) => {
		const [mongoService, userId] = getContextVars(ctx)
		const dto = ctx.req.valid("json")
		await new UserService(mongoService).updateUser(userId, dto)
		return ctx.json(`Sus datos fueron actualizados exitosamente`)
	}
)

export default usersRoutes
