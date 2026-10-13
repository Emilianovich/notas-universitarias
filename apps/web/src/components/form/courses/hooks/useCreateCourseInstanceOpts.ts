import type { CreateCourseInstanceOpts } from "@/components/form/courses/types/types.ts"
import useToast from "@/contexts/toast.ts"
import {
	type CourseBreakdownToBeCreated,
	CreateCourseInstanceSchema, type CreateCourseInstanceType,
	ON_SUBMIT_INVALID_MSG
} from "@notas-universitarias/types"
import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "@/hooks/form.ts"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx"
import RadioGroup from "@/components/form/tanstack-fields/Radio/RadioGroup.tsx";
import SelectField from "@/components/form/tanstack-fields/Select/SelectField.tsx";

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		SelectField,
		RadioGroup,
		NumberField
	},
	formComponents: { SubmitBtn }
})

export default function useCreateCourseInstanceOpts({
	mutation,
	error
}: CreateCourseInstanceOpts) {
	const { buildToast } = useToast()
	return useAppForm({
		validators: {
			onBlur: CreateCourseInstanceSchema
		},
		defaultValues: {
			isRegistered: false,
			name: undefined,
			previousCourseId: undefined,
			hasLaboratory: false,
			laboratory: undefined,
			profesorName: "",
			breakdowns: [] as CourseBreakdownToBeCreated[]
		} as CreateCourseInstanceType,
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: error ?? ON_SUBMIT_INVALID_MSG
			})
		},
		onSubmit: async ({ value }) => {
			mutation.mutate(value)
		}
	})
}
