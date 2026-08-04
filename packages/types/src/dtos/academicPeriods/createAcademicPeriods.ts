import { z } from "zod"

export const createAcademicPeriodsDTO = z
	.object({
		name: z
			.string()
			.min(
				3,
				"El nombre del periodo académico debe tener por lo menos 3 caracteres"
			),
		startDate: z
			.preprocess((val: string) => {
				return new Date(val).toISOString().split("T")[0]
			}, z.iso.date("La fecha de inicio debe tener el formato YYYY-MM-DD"))
			.transform((val) => val.toString()),
		endDate: z
			.preprocess((val: string) => {
				return new Date(val).toISOString().split("T")[0]
			}, z.iso.date(
				"La fecha de finalización debe tener el formato YYYY-MM-DD"
			))
			.transform((val) => val.toString())
	})
	.refine((schema) => new Date(schema.startDate), {
		abort: true,
		path: ["startDate"],
		error: "La fecha de inicio no es válida"
	})
	.refine((schema) => new Date(schema.endDate), {
		abort: true,
		path: ["endDate"],
		error: "La fecha de finalización no es válida"
	})
	.refine((schema) => schema.endDate > schema.startDate, {
		abort: true,
		path: ["endDate"],
		error:
			"La fecha en la que termina el periodo académico no puede ser menor que la de inicio"
	})

export type CreateAcademicPeriodsDto = {
	name: string
	startDate: Date
	endDate: Date
}
