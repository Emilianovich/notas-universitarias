import { z } from "zod"
import type { BreakdownCategory } from "../../db"

// TODO think about rounding total percentage?
export type CourseInstanceToBeCreated = z.infer<
	typeof CreateCourseInstanceSchema
>
export type CourseBreakdownToBeCreated = z.infer<typeof CreateBreakdownSchema>
// {
// 	isRegistered: boolean
// 	name?: string
// 	profesorName: string
// 	breakdown: {
// 		name: string
// 		percentage: number
// 		type: BreakdownCategory
// 		laboratoryDetails?: {
// 			profesorName: string
// 			breakdown: CreatingCourseInstanceBreakdown[]
// 		}
// 	}[]
// }

export type CreatingCourseInstanceBreakdown = {
	name: string
	percentage: number
	type: BreakdownCategory
}

const LaboratoryDetailsSchema = z
	.object({
		profesorName: z
			.string()
			.min(
				1,
				"El nombre del profesor de laboratorio debería tener por lo menos un caracter"
			)
			.max(
				50,
				"El nombre del profesor de laboratorio debería tener entre 1 a 50 caracteres"
			),
		breakdown: z.array(
			z.object({
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
					.gte(0, "El porcentaje no puede ser negativo")
					.lte(
						100,
						"El porcentaje total de la subdivisión no puede ser mayor a 100%"
					)
					.multipleOf(0.01, { message: "Máximo 2 decimales" })
					.transform((val) => val / 100),
				type: z.enum(
					["STANDALONE", "NESTED", "NOT-NESTED"],
					"El tipo de la subdivisión no encaja dentro de los registrados"
				)
			})
		)
	})
	.superRefine((self, ctx) => {
		self.breakdown.forEach((breakdown) => {
			if (breakdown.type === "NESTED") {
				ctx.addIssue({
					code: "custom",
					message:
						"La categoría de una parte de laboratorio no puede ser 'NESTED'"
				})
			}
		})
		const totalPercentage = self.breakdown
			.map((breakdown) => breakdown.percentage)
			.reduce((total, currentPercent) => total + currentPercent, 0)
		if (totalPercentage !== 1) {
			ctx.addIssue({
				code: "custom",
				message:
					"El total de porcentajes de laboratorio tiene que ser igual a 100%"
			})
		}
	})

// OPTIMIZE reduce code duplication
const CreateBreakdownSchema = z
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
			.gte(0, "El porcentaje no puede ser negativo")
			.lte(
				100,
				"El porcentaje total de la subdivisión no puede ser mayor a 100%"
			)
			.multipleOf(0.01, { message: "Máximo 2 decimales" })
			.transform((val) => val / 100),
		type: z.enum(
			["STANDALONE", "NESTED", "NOT-NESTED"],
			"El tipo de la subdivisión no encaja dentro de los registrados"
		),
		laboratoryDetails: LaboratoryDetailsSchema.optional()
	})
	.superRefine((self, ctx) => {
		if (self.type !== "NESTED" && self.laboratoryDetails) {
			ctx.addIssue({
				code: "custom",
				path: ["type"],
				message:
					"Solo una categoría de tipo 'NESTED' necesita que se especifique la parte de laboratorio"
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
	})
// REVIEW
// OPTIMIZE reduce possible unnecessary validation
export const CreateCourseInstanceSchema = z
	.object({
		isRegistered: z.boolean(
			"Es necesario especificar si ya tiene la materia registrada"
		),
		name: z
			.string()
			.min(1, "El nombre de la materia debería tener por lo menos un caracter")
			.max(
				100,
				"El nombre de la materia debería tener entre 1 a 100 caracteres"
			)
			.optional(),
		profesorName: z
			.string()
			.min(1, "El nombre del profesor debería tener por lo menos un caracter")
			.max(
				100,
				"El nombre del profesor debería tener entre 1 a 100 caracteres"
			),
		previousCourseId: z.string().optional(),
		breakdown: z.array(CreateBreakdownSchema)
	})
	.superRefine((self, ctx) => {
		if (self.isRegistered && !self.previousCourseId) {
			ctx.addIssue({
				code: "custom",
				path: ["previousCourseId"],
				message: "Ya diste la materia, es necesario que facilites su id"
			})
		}
		if (!self.isRegistered && !self.name) {
			ctx.addIssue({
				code: "custom",
				path: ["name"],
				message:
					"Como no ha dado esta materia, no es necesario el ID, pero es importante que facilite el nombre"
			})
		}
		if (!self.isRegistered && self.previousCourseId) {
			ctx.addIssue({
				code: "custom",
				path: ["previousCourseId"],
				message:
					"No tienes registrado esa materia, no es necesario que mandes un id"
			})
		}

		const totalPercentage = self.breakdown
			.map((breakdown) => breakdown.percentage)
			.reduce((total, currentPercent) => total + currentPercent, 0)
		if (Math.abs(totalPercentage - 1) > 0.001) {
			ctx.addIssue({
				code: "custom",
				message: "El total de porcentajes tiene que ser igual a 100%"
			})
		}
	})
