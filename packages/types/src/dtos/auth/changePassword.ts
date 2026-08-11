import { z } from "zod"

export const changePasswordSchema = z
	.object({
		password: z
			.string()
			.min(1, "Su contraseña debe tener al menos un caracter"),
		confirmPassword: z
			.string()
			.min(
				1,
				"La confirmación de tu contraseña debe tener al menos un caracter"
			)
	})
	.superRefine((self, ctx) => {
		if (self.password !== self.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				message: "La contraseña y su confirmación deben ser iguales",
				path: ["confirmPassword"]
			})
		}
	})

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>
