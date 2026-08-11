import {
	type CreateUserDTO,
	createUserDto,
	updateUserDTO
} from "@notas-universitarias/types"
import { Hono } from "hono"
import { getContextVars } from "../helpers/helpers.js"
import type { MiddlewareVars } from "../index.js"
import authMiddleware from "../middlewares/auth.js"
import { ZodMiddleware } from "../middlewares/zod.js"
import { log } from "../services/logging/LogService.js"
import { UserService } from "../services/users/UserService.js"

const usersRoutes = new Hono<MiddlewareVars>().basePath("/users")

// Get user profile
usersRoutes.get("/", authMiddleware, async (ctx) => {
	const user = await new UserService(getContextVars(ctx).mongoService).getUser(
		getContextVars(ctx).userId
	)
	return ctx.json({ user })
})

// Create user
usersRoutes.post("/", ZodMiddleware("json", createUserDto), async (ctx) => {
	const dto: CreateUserDTO = ctx.req.valid("json")
	const username = await new UserService(
		getContextVars(ctx).mongoService
	).createUser(dto)
	log("info", `New user created!`)
	ctx.status(201)
	return ctx.json(`Bienvenid@ ${username}`)
})

// Update users
usersRoutes.put(
	"/",
	authMiddleware,
	ZodMiddleware("json", updateUserDTO),
	async (ctx) => {
		const dto = ctx.req.valid("json")
		await new UserService(getContextVars(ctx).mongoService).updateUser(
			getContextVars(ctx).userId,
			dto
		)
		return ctx.json(`Sus datos fueron actualizados exitosamente`)
	}
)

export default usersRoutes
