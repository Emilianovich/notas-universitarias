import { z } from "zod"
import { createAcademicPeriodsDTO } from "../academicPeriods"

export const createUserPreferencesSchema = z.strictObject({
	fontFamily: z.enum(
		[
			"Arima",
			"Amiko",
			"Playwrite Brasil Guides",
			"Elsie",
			"Libertinus Math",
			"Nunito",
			"Gorditas",
			"Special Elite",
			"Short Stack",
			"Uncial Antiqua",
			"Saira Stencil",
			"Cherry Cream Soda",
			"Metamorphous",
			"Audiowide",
			"Cabin Sketch"
		],
		{
			error: "Seleccione una familia tipográfica permitida"
		}
	),

	theme: z.enum(["dark", "light"], {
		error: "Se requiere un tema válido ('dark' o 'light')"
	}),

	petName: z.enum(["Spike", "Leon", "Tom", "Nita", "Mila"], {
		error: "'Spike', 'Leon', 'Tom', 'Nita' o 'Mila' son las mascotas permitidas"
	})
})

export const dataAfterUserRegisterSchema = z.object({
	settings: z.optional(createUserPreferencesSchema),
	academicPeriod: z.optional(createAcademicPeriodsDTO)
})

export type CreateSettingsDto = z.infer<typeof createUserPreferencesSchema>
export type DataAfterRegister = z.infer<typeof dataAfterUserRegisterSchema>
