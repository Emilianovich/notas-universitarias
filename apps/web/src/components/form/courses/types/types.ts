import type { UpdateCourseInstanceDto } from "@notas-universitarias/types"
import type React from "react"
import type { BreakdownForm } from "@/components/form/courses/Update&Demo/BreakdownForm.tsx"

export type Modes = "create" | "edit"

export type BreakdownFormProps = React.ComponentProps<typeof BreakdownForm>

export type LabDetailsBreakdownFormProps = BreakdownFormProps & { i: number }

export const defaultValues: UpdateCourseInstanceDto = {
	profesorName: "Tú mismo",
	breakdown: []
}

export const breakdownDefaultProps = {
	mode: "edit" as Modes,
	labTotalPercentage: 0,
	totalPercentage: 0,
	isForDemo: false
}
