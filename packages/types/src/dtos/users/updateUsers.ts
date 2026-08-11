import { z } from "zod"
import updateUserPreferences from "../settings/updateSettings"

// TODO remove password from here
export const updateUserDTO = updateUserPreferences
	.safeExtend({
		name: z
			.string()
			.min(1, "Tu apodo debería tener por lo menos un caracter")
			.max(100, "Tu apodo debería tener entre 1 a 100 caracteres"),
		email: z
			.email({
				pattern:
					/^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/,
				error: "Ingrese un correo electrónico válido"
			})
			.transform((val) => {
				if (val) return val.toLowerCase()
			})
	})
	.superRefine((self, ctx) => {
		if (
			!self.name &&
			!self.email &&
			!self.petName &&
			!self.theme &&
			!self.fontFamily
		) {
			ctx.addIssue({
				code: "custom",
				message:
					"¿Quieres actualizar tu info, pero no envías nada? Déjate de eso",
				path: ["name", "email", "password", "theme", "fontFamily", "petName"]
			})
		}
	})
export type UpdateUserDTO = z.Infer<typeof updateUserDTO>
