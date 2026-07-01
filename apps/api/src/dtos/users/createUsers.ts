import { z } from "zod"

export type CreateUserDTO = {
	name: string
	email: string
	password: string
}
export const createUserDto = z.object({
	name: z
		.string()
		.min(1, "Your username should have at least 1 character")
		.max(100, "Your username should have between 1 and 100 characters"),
	email: z.email({
		pattern:
			/^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/,
		error: "Please enter valid email address"
	}),
	password: z.string().min(1, "Password is required")
})
