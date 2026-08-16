import { z } from "zod"

export type CreateUserDTO = z.infer<typeof createUserDto>
export const createUserDto = z.object({
	username: z
		.string()
		.min(1, "Tu apodo debería tener por lo menos un caracter")
		.max(100, "Tu apodo debería tener entre 1 a 100 caracteres"),
	email: z
		.email({
			pattern:
				/^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/,
			error: "Ingrese un correo electrónico válido"
		})
		.transform((val) => val.toLowerCase()),
	password: z.string().min(1, "Su contraseña debe tener al menos un caracter")
})
