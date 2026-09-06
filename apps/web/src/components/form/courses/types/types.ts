import type {
	CourseBreakdown,
	CourseInstance,
	CourseInstanceToBeCreated,
	SuccessRes,
	UpdateCourseInstanceDto
} from "@notas-universitarias/types"
import type React from "react"
import type { BreakdownForm } from "@/components/form/courses/Update&Demo/BreakdownForm.tsx"
import type {UseMutationResult} from "@tanstack/react-query";
import {useEditCourseInstanceOpts} from "@/components/form/courses/hooks/useEditCourseInstanceOpts.ts";
import type useCreateCourseInstanceOpts from "@/components/form/courses/hooks/useCreateCourseInstanceOpts.ts";

export type Modes = "create" | "edit"

export type BreakdownFormProps = React.ComponentProps<typeof BreakdownForm>

export type LabDetailsBreakdownFormProps = BreakdownFormProps & { i: number }

export const defaultValues: UpdateCourseInstanceDto = {
	profesorName: "Tú mismo",
	breakdown: []
}

export type BreakdownSharedContent = Omit<CourseBreakdown, "entries" | "contribution" | "laboratoryDetails">
export const breakdownSharedContentDefaultValues : BreakdownSharedContent = {
	name: "",
	type: "STANDALONE",
	percentage: 0,
}

export type LaboratoryDetailsContent = {
	profesorName: string
	breakdown: BreakdownSharedContent[]
}

export const laboratoryDetailsFormDefaultValues : LaboratoryDetailsContent = {
	profesorName: "",
	breakdown: [],
}
export const breakdownDefaultProps = {
	mode: "edit" as Modes,
	labTotalPercentage: 0,
	totalPercentage: 0,
	isForDemo: false
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
		laboratoryDetails?: {
			profesorName: string
			breakdown: {
				name: string
				percentage: number
				type: "STANDALONE" | "NESTED" | "NOT-NESTED"
			}[]
		} | undefined
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
	mutation: UseMutationResult<SuccessRes<string>, Error, CourseInstanceToBeCreated>
}

export type CreateCourseInstanceFormType = ReturnType<typeof useCreateCourseInstanceOpts>