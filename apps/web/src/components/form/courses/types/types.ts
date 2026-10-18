import type {
	CourseBreakdown,
	CourseInstance,
	CreateCourseInstanceType,
	SuccessRes,
	UpdateCourseInstanceDto
} from "@notas-universitarias/types"
import type { UseMutationResult } from "@tanstack/react-query"
import type React from "react"
import type useCreateCourseInstanceOpts from "@/components/form/courses/hooks/useCreateCourseInstanceOpts.ts"
import type { useEditCourseInstanceOpts } from "@/components/form/courses/hooks/useEditCourseInstanceOpts.ts"
import type { BreakdownForm } from "@/components/form/courses/Update&Demo/BreakdownForm.tsx"

export type BreakdownFormProps = React.ComponentProps<typeof BreakdownForm>

export const defaultValues: UpdateCourseInstanceDto = {
	profesorName: "Tú mismo",
	laboratory: undefined,
	breakdowns: []
}

export type BreakdownSharedContent = Omit<
	CourseBreakdown,
	"entries" | "contribution" | "laboratoryDetails"
>
export const breakdownSharedContentDefaultValues: BreakdownSharedContent = {
	name: "",
	allowsMultipleEntries: false,
	percentage: 0
}

export type LaboratoryDetailsContent = {
	profesorName: string
	breakdown: BreakdownSharedContent[]
}

export const laboratoryDetailsFormDefaultValues: LaboratoryDetailsContent = {
	profesorName: "",
	breakdown: []
}
export const breakdownDefaultProps = {
	totalPercentage: 0,
	isForDemo: false,
	isLaboratory: false
}

export type CourseInstancesPercentages = {
	totalBreakdownPercentage: number
	totalLabDetailBreakdownPercentage: number
}

export type CreatingCourseInstanceReturns = CourseInstancesPercentages & {
	breakdownList: {
		name: string
		percentage: number
		type: "STANDALONE" | "NESTED" | "NOT-NESTED"
		laboratoryDetails?:
			| {
					profesorName: string
					breakdown: {
						name: string
						percentage: number
						type: "STANDALONE" | "NESTED" | "NOT-NESTED"
					}[]
			  }
			| undefined
	}[]
	isRegistered: boolean
	submissionAttempts: number
}

export type EditingCourseInstanceReturns = CourseInstancesPercentages & {
	breakdownList: {
		name: string
		percentage: number
		contribution: number
		entries: {
			rawScore: number
			maxScore: number
			name?: string | undefined
		}[]
		type: "STANDALONE" | "NESTED" | "NOT-NESTED"
		laboratoryDetails?: CourseInstance | undefined
	}[]
}

export type EditCourseInstanceOpts = {
	defaultValues: UpdateCourseInstanceDto
	isForDemo: boolean
	mutation: UseMutationResult<
		SuccessRes<string>,
		Error,
		UpdateCourseInstanceDto
	>
}

export type EditCourseInstanceFormType = ReturnType<
	typeof useEditCourseInstanceOpts
>

export type CreateCourseInstanceOpts = {
	mutation: UseMutationResult<
		SuccessRes<string>,
		Error,
		CreateCourseInstanceType
	>
	error?: string
}

export type CreateCourseInstanceFormType = ReturnType<
	typeof useCreateCourseInstanceOpts
>
