import { z } from "zod"

const createUserPreferencesSchema = z.strictObject({
	fontFamily: z.enum(
		[
			"Google Sans Code",
			"Arima",
			"Amiko",
			"DynaPuff",
			"Libertinus Math",
			"Nunito",
			"Dancing Script"
		],
		{
			error:
				"Se requiere una familia tipográfica válida ('Google Sans Code', 'Arima', 'Amiko', 'DynaPuff', 'Libertinus Math', 'Nunito' o 'Dancing Script')"
		}
	),

	theme: z.enum(["dark", "light"], {
		error: "Se requiere un tema válido ('dark' o 'light')"
	}),

	petName: z.enum(["Spike", "Leon", "Tom", "Nita", "Mila"], {
		error:
			"Se requiere un nombre de mascota válido ('Spike', 'Leon', 'Tom', 'Nita' o 'Mila')"
	})
})

export default createUserPreferencesSchema
