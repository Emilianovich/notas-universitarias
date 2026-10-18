import {
	gradeToLetter,
	mapBreakdownsForDemo,
	roundNumber,
	updateCourseInstanceFinalGrade
} from "@notas-universitarias/helpers"
import {
	type CourseInstance,
	ON_SUBMIT_INVALID_MSG,
	type UpdateCourseInstanceDto,
	updateCourseInstanceSchema
} from "@notas-universitarias/types"
import { createFormHook, formOptions } from "@tanstack/react-form"
import {
	defaultValues,
	type EditCourseInstanceOpts
} from "@/components/form/courses/types/types.ts"
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx"
import RadioGroup from "@/components/form/tanstack-fields/Radio/RadioGroup.tsx"
import SelectField from "@/components/form/tanstack-fields/Select/SelectField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import useToast from "@/contexts/toast.ts"
import { fieldContext, formContext } from "@/hooks/form.ts"

export const { useAppForm, withForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		NumberField,
		RadioGroup,
		SelectField
	},
	formComponents: { SubmitBtn }
})

export function useEditCourseInstanceOpts({
	defaultValues,
	mutation,
	isForDemo
}: EditCourseInstanceOpts) {
	const { buildToast } = useToast()
	// prepareCourseInstanceForDisplay(defaultValues)
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
				const { data } = updateCourseInstanceSchema.safeParse(value)
				if (!data) return
				const { breakdowns, laboratory } = data
				const courseInstance: CourseInstance = {
					finalGrade: 0,
					...(laboratory && {
						laboratory: {
							...laboratory,
							finalGrade: 0,
							breakdowns: mapBreakdownsForDemo(laboratory.breakdowns)
						}
					}),
					breakdowns: mapBreakdownsForDemo(breakdowns),
					profesorName: value.profesorName ?? ""
				}
				updateCourseInstanceFinalGrade(courseInstance)
				const finalGrade = roundNumber({
					number: courseInstance.finalGrade * 100,
					amountOfDecimals: 2
				})
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

export const editCourseInstanceOpts = (
	defaultValuesAsProps: UpdateCourseInstanceDto | undefined
) =>
	formOptions({
		defaultValues: defaultValuesAsProps ?? defaultValues
	})
