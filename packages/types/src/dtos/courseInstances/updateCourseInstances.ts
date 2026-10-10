import { z } from "zod"
import {CreateBreakdownSchema, isTotalPercentageValid, PercentageShape} from "./createCourseInstances";


const courseBreakdownEntrySchema = z
	.object({
		name: z
			.string()
			.min(
				1,
				"El nombre de la nota debería tener por lo menos un caracter"
			)
			.max(
				30,
				"El nombre de la nota debería tener entre 1 a 30 caracteres"
			)
			.optional(),
		rawScore: z
			.number()
			.gte(
				0,
				"La nota obtenida no puede ser menor que 0"
			),
		maxScore: z
			.number()
			.gt(
				0,
				"La nota total no puede ser menor o igual que 0"
			)
	})
	.superRefine((self, ctx) => {
		if (self.rawScore > self.maxScore) {
			ctx.addIssue({
				code: "custom",
				path: ["rawScore"],
				message:
					"La nota obtenida no puede ser mayor a la nota total"
			})
		}
	})

const CourseBreakdownSchema = CreateBreakdownSchema.safeExtend({
		entries: z.array(courseBreakdownEntrySchema),
}).superRefine((self, ctx) => {
	const {entries, allowsMultipleEntries} = self
	if (!allowsMultipleEntries && entries.length > 1) {
		ctx.addIssue({
			code: "custom",
			path: ["entries"],
			message: "Esta evaluación solo admite una nota"
		})
	}
})

const CourseInstanceBaseSchema = z.object({
	profesorName: z
		.string()
		.min(1, "El nombre del profesor debería tener por lo menos un caracter")
		.max(
			100,
			"El nombre del profesor debería tener entre 1 a 100 caracteres"
		),
	breakdown: z.array(CourseBreakdownSchema)
}).superRefine((self, ctx) => {
	const { breakdown } = self
	if (!breakdown.length) {
		ctx.addIssue({
			code: "custom",
			path: ["breakdown"],
			message: "Tienes que tener por lo menos una evaluación"
		})
	}
})

const LaboratorySchema = CourseInstanceBaseSchema.safeExtend({
	percentage: PercentageShape("El porcentaje de laboratorio")
})

export const updateCourseInstanceSchema = CourseInstanceBaseSchema.safeExtend({
	laboratory: LaboratorySchema.optional()
})
	.superRefine((self, ctx) => {
		const { profesorName, laboratory, breakdown } = self
		if (!profesorName && !breakdown &&!laboratory) {
			ctx.addIssue({
				code: "custom",
				message: "No se puede enviar un objeto de actualización vacío"
			})
		}
		if (!isTotalPercentageValid(breakdown, laboratory)) {
			ctx.addIssue({
				code: "custom",
				message: "El total de porcentajes tiene que ser igual a 100%"
			})
		}
	})
export type UpdateCourseInstanceDto = z.infer<typeof updateCourseInstanceSchema>
