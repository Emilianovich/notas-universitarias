import {
	gradeToLetter,
	updateCourseInstanceFinalGrade
} from "@notas-universitarias/helpers"
import {
	type CourseInstance,
	ON_SUBMIT_INVALID_MSG,
	type SuccessRes,
	type UpdateCourseInstanceDto,
	updateCourseInstanceSchema
} from "@notas-universitarias/types"
import { createFormHook } from "@tanstack/react-form"
import type { UseMutationResult } from "@tanstack/react-query"
import BreakdownTypeGroup from "@/components/form/tanstack-fields/BreakdownTypeGroup.tsx"
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import useToast from "@/contexts/toast.ts"
import { fieldContext, formContext } from "@/hooks/form.ts"

export type EditCourseInstanceOpts = {
	defaultValues: UpdateCourseInstanceDto
	isForDemo: boolean
	mutation: UseMutationResult<
		SuccessRes<string>,
		Error,
		UpdateCourseInstanceDto
	>
}

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		NumberField,
		BreakdownTypeGroup
	},
	formComponents: { SubmitBtn }
})

export function useEditCourseInstanceOpts({
	defaultValues,
	mutation,
	isForDemo
}: EditCourseInstanceOpts) {
	const { buildToast } = useToast()
	return useAppForm({
		validators: {
			onBlur: updateCourseInstanceSchema
		},
		defaultValues,
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: ON_SUBMIT_INVALID_MSG
			})
		},
		onSubmit: async ({ value }) => {
			if (isForDemo) {
				const { breakdown } = updateCourseInstanceSchema.parse(value)
				const courseInstance: CourseInstance = {
					finalGrade: 0,
					breakdown,
					profesorName: value.profesorName ?? ""
				}
				updateCourseInstanceFinalGrade(courseInstance)
				const finalGrade = Number((courseInstance.finalGrade * 100).toFixed(2))
				buildToast({
					id: Date.now(),
					type: "info",
					content: `Tu nota final sería ${finalGrade} y la letra ${gradeToLetter(finalGrade)}`
				})
				return
			}
			mutation.mutate(value)
		}
	})
}

export type EditCourseInstanceFormType = ReturnType<
	typeof useEditCourseInstanceOpts
>
