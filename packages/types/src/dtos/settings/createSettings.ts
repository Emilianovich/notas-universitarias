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

export default createUserPreferencesSchema
