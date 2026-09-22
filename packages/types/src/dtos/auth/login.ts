import {z, ZodType} from "zod"

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
	password: z.string().min(1, "La contraseña es requerida")
})

export const BaseApiRes = z.object({
	statusCode: z.number("Status Code must be a number"),
	issuedAt: z.string()
				.regex(/^\d{1,2}\/\d{1,2}\/\d{4}$/, "Expected format: M/D/YYYY"),
})

export function createSuccessApiRes<T extends ZodType> (schema: T) {
	return BaseApiRes.extend({
		content: schema
	})
}