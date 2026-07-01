import { z } from "zod"

export type LoginDTO = {
	email: string
	password: string
}
export const loginDTO = z.object({
	email: z.email({
		pattern:
			/^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/,
		error: "Ingrese un correo electrónico válido"
	}),
	password: z.string("Contraseña requerida")
})
