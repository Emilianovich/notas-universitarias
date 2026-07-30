import { z } from "zod"
import type { CreateUserDTO } from "./createUsers"

export const updateUserDTO = z.object({
	name: z
		.string()
		.min(1, "Tu apodo debería tener por lo menos un caracter")
		.max(100, "Tu apodo debería tener entre 1 a 100 caracteres")
		.optional(),
	email: z
		.email({
			pattern:
				/^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/,
			error: "Ingrese un correo electrónico válido"
		})
		.optional(),
	password: z
		.string()
		.min(1, "Su contraseña debe tener al menos un caracter")
		.optional()
})
export type UpdateUserDTO = Partial<CreateUserDTO>
