import type { CreateAcademicPeriodsDto } from "@notas-universitarias/types"
import { createFormHook } from "@tanstack/react-form"
import DateField from "@/components/form/tanstack-fields/DateField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import { fieldContext, formContext } from "@/hooks/form.ts"

export const { withFieldGroup } = createFormHook({
	fieldComponents: {
		TextField,
		DateField
	},
	formComponents: { SubmitBtn },
	fieldContext,
	formContext
})

const defaultValues: CreateAcademicPeriodsDto = {
	name: "",
	startDate: "2005-02-20",
	endDate: "2026-10-12"
}
export const SharedAcademicPeriodForm = withFieldGroup({
	defaultValues,
	props: {
		textFieldLabel: "Nombre del periodo académico actual",
		startDateLabel: "Fecha de inicio de tu periodo académico actual",
		endDateLabel: "Fecha final de tu periodo académico actual"
	},
	render: function Render({
		group,
		textFieldLabel,
		startDateLabel,
		endDateLabel
	}) {
		const { AppField } = group
		return (
			<>
				<AppField
					name={"name"}
					children={(field) => (
						<field.TextField
							placeholder={"Semestre I 2026"}
							label={textFieldLabel}
						/>
					)}
				/>
				<AppField
					name={"startDate"}
					children={(field) => (
						<field.DateField label={startDateLabel} placeholder={""} />
					)}
				/>
				<AppField
					name={"endDate"}
					children={(field) => (
						<field.DateField label={endDateLabel} placeholder={""} />
					)}
				/>
			</>
		)
	}
})
