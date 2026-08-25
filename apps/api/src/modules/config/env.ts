import "dotenv/config"
import { z } from "zod"

const env = z
	.object({
		IS_PROD: z
			.enum(
				["true", "false"],
				"El indicador de producción tiene que ser un booleano"
			)
			.transform((val) => val === "true"),
		DB_URI_DEV: z.url().optional(),
		DB_URI_PROD: z.url().optional(),
		SESSION_COOKIE_NAME: z.string().default("user_session"),
		CORS_ALLOWED_ORIGINS: z.string().default("http://localhost:3987"),
		SESSION_COOKIE_SECURE: z
			.enum(
				["true", "false"],
				"El indicador de seguridad de la cookie tiene que ser un booleano"
			)
			.transform((val) => val === "true"),
		COOKIE_SAME_SITE: z.enum(
			["none", "strict", "lax"],
			"SameSite debe ser 'strict', 'lax' o 'none'"
		),
		TEMP_USER_COOKIE_NAME: z.string().default("temp-user")
	})
	.refine(
		(data) =>
			data.IS_PROD
				? data.DB_URI_PROD !== undefined
				: data.DB_URI_DEV !== undefined,
		{
			message: "Database URI for current environment is required"
		}
	)
	.parse(process.env)

export default env
