import { breakdownSharedContentDefaultValues } from "@/components/form/courses/types/types.ts"
import DeleteFormValue from "@/components/form/general/DeleteFormValue.tsx"
import { createFormHook } from "@tanstack/react-form"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx"
import SelectField from "@/components/form/tanstack-fields/SelectField.tsx"
import { RadioButton } from "@/components/form/tanstack-fields/Radio/RadioButton.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import { fieldContext, formContext } from "@/hooks/form.ts"
import RadioGroup from "@/components/form/tanstack-fields/Radio/RadioGroup.tsx"
import { getBreakdownRadioGroup } from "@/components/form/tanstack-fields/Radio/GetBreakdownRadioGroup.ts"

export const { withForm, withFieldGroup } = createFormHook({
	fieldComponents: {
		TextField,
		NumberField,
		SelectField,
		RadioField: RadioButton,
		RadioGroup
	},
	formComponents: { SubmitBtn },
	fieldContext,
	formContext
})

export const BreakdownSharedContent = withFieldGroup({
	defaultValues: breakdownSharedContentDefaultValues,
	props: {
		modalTitle: "",
		confirmBtnAction: () => console.log("This is the modal confirm action"),
		isLabDetail: false
	},
	render: function Render({
		group,
		modalTitle,
		confirmBtnAction,
		isLabDetail
	}) {
		const { AppField } = group
		return (
			<>
				<div className={"relative"}>
					<AppField
						name={`name`}
						children={(nameField) => (
							<nameField.TextField
								label={"¿Cómo se llama la evaluación?"}
								placeholder={"Asistencia"}
							/>
						)}
					/>
					<DeleteFormValue
						className={""}
						modalTitle={modalTitle}
						modalContent={
							"Eliminarás completamente la evaluación. No podrás recuperar el progreso que tenías"
						}
						confirmButton={{
							type: "modal-primary",
							text: "Sí, eliminar",
							action: confirmBtnAction
						}}
						closeButtonTitle={"No, me arrepentí"}
					/>
				</div>
				<AppField
					name={`percentage`}
					children={(percentageField) => (
						<percentageField.NumberField
							label={"¿Cuál es el porcentaje de la evaluación?"}
							placeholder={"21"}
						/>
					)}
				/>
				<AppField
					name={`allowsMultipleEntries`}
					key={`allowsMultipleEntries`}
					children={(typeField) => {
						const radioGroupName = typeField.name
						return (
							<typeField.RadioGroup
								radioGroupName={radioGroupName}
								radios={getBreakdownRadioGroup(radioGroupName, isLabDetail)}
							/>
						)
					}}
				/>
			</>
		)
	}
})
