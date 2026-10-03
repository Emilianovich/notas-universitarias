import {
	gradeToLetter,
	updateCourseInstanceFinalGrade
} from "@notas-universitarias/helpers"
import {
	type CourseInstance,
	ON_SUBMIT_INVALID_MSG,
	updateCourseInstanceSchema
} from "@notas-universitarias/types"
import { createFormHook } from "@tanstack/react-form"
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import useToast from "@/contexts/toast.ts"
import { fieldContext, formContext } from "@/hooks/form.ts"
import type {EditCourseInstanceOpts} from "@/components/form/courses/types/types.ts";
import {RadioButton} from "@/components/form/tanstack-fields/Radio/RadioButton.tsx";
import SelectField from "@/components/form/tanstack-fields/SelectField.tsx";

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		NumberField,
		RadioField: RadioButton,
		SelectField,
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

