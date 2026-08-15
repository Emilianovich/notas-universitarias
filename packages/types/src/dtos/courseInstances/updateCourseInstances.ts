import { z } from "zod"
import type { BreakdownCategory } from "../../db"

const courseBreakdownEntrySchema = z
	.object({
		name: z
			.string()
			.min(
				1,
				"El nombre de la subdivisión de la subdivisión debería tener por lo menos un caracter"
			)
			.max(
				30,
				"El nombre de la subdivisión de la subdivisión debería tener entre 1 a 30 caracteres"
			)
			.optional(),
		rawScore: z
			.number()
			.gte(
				0,
				"La nota obtenida en la subdivisión de la subdivisión no puede ser menor que 0"
			),
		maxScore: z
			.number()
			.gt(
				0,
				"La nota total en la subdivisión de la subdivisión no puede ser menor o igual que 0"
			)
	})
	.superRefine((self, ctx) => {
		if (self.rawScore > self.maxScore) {
			ctx.addIssue({
				code: "custom",
				path: ["rawScore"],
				message:
					"La nota obtenida en la subdivisión de la subdivisión no puede ser mayor a la nota total"
			})
		}
	})

const CourseBreakdownBaseSchema = z
	.object({
		name: z
			.string()
			.min(
				1,
				"El nombre de la subdivisión debería tener por lo menos un caracter"
			)
			.max(
				50,
				"El nombre de la subdivisión debería tener entre 1 a 50 caracteres"
			),
		percentage: z
			.number()
			.gte(0, "El porcentaje de la subdivisión no puede ser negativo")
			.lte(
				100,
				"El porcentaje total de la subdivisión no puede ser mayor a 100%"
			)
			.multipleOf(0.01, { message: "Máximo 2 decimales" })
			.transform((val) => val / 100),
		contribution: z
			.number()
			.gte(0, "El porcentaje obtenido no puede ser negativo")
			.lte(
				1,
				"El porcentaje obtenido de la subdivisión no puede ser mayor a 100%"
			)
			.transform((val) => Math.round(val * 100) / 100),
		entries: z.array(courseBreakdownEntrySchema),
		type: z.enum(
			["STANDALONE", "NESTED", "NOT-NESTED"],
			"El tipo de la subdivisión no encaja dentro de los registrados"
		)
	})
	// .superRefine((self, ctx) => {
	// 	if (self.contribution > self.percentage) {
	// 		ctx.addIssue({
	// 			code: "custom",
	// 			message:
	// 				"El porcentaje obtenido para una subdivisión no puede ser mayor a su porcentaje total",
	// 			path: ["contribution"]
	// 		})
	// 	}
	// })

const CourseBreakdownSchema = CourseBreakdownBaseSchema.safeExtend({
	laboratoryDetails: z
		.object({
			profesorName: z
				.string()
				.min(1, "El nombre del profesor debería tener por lo menos un caracter")
				.max(
					100,
					"El nombre del profesor debería tener entre 1 a 100 caracteres"
				),
			finalGrade: z.number(),
			breakdown: z.array(CourseBreakdownBaseSchema)
		})
		.optional(),
	type: z.enum(
		["STANDALONE", "NESTED", "NOT-NESTED"],
		"El tipo de la subdivisión no encaja dentro de los registrados"
	)
}).superRefine((self, ctx) => {
	if (self.type !== "NESTED" && self.laboratoryDetails) {
		ctx.addIssue({
			code: "custom",
			message:
				"La materia no tiene parte de laboratorio. No es necesario detallar esa subdivisión",
			path: ["type"]
		})
	}
	if (self.type === "NESTED" && !self.laboratoryDetails) {
		ctx.addIssue({
			code: "custom",
			message:
				"Como la subdivisión tiene parte de laboratorio. Es necesario detallar esa subdivisión",
			path: ["type"]
		})
	}

	if (self.laboratoryDetails && self.entries.length > 0) {
		ctx.addIssue({
			code: "custom",
			message:
				"Esta subdivisión tiene parte de laboratorio. No es necesario especificar entries",
			path: ["entries"]
		})
	}
})

// TODO remove finalGrade
export const updateCourseInstanceSchema = z
	.object({
		profesorName: z
			.string()
			.min(1, "El nombre del profesor debería tener por lo menos un caracter")
			.max(
				100,
				"El nombre del profesor debería tener entre 1 a 100 caracteres"
			),
		breakdown: z.array(CourseBreakdownSchema)
	})
	.superRefine((self, ctx) => {
		if (!self.profesorName && !self.breakdown) {
			ctx.addIssue({
				code: "custom",
				message: "No se puede enviar un objeto de actualización vacío"
			})
		}
		let totalPercentage = 0
		self.breakdown?.forEach((item) => {
			totalPercentage += item.percentage
			if (totalPercentage > 100) {
				ctx.addIssue({
					code: "custom",
					message:
						"La suma de los porcentajes de la subdivisión no pueden ser mayor a 100%"
				})
			}
		})
	})
	.strict()
export type UpdateCourseInstanceDto = z.infer<typeof updateCourseInstanceSchema>
export const demoCourseInstanceSchema = updateCourseInstanceSchema.required({
	breakdown: true
})
export type DemoCourseInstanceDto = z.infer<typeof demoCourseInstanceSchema>
