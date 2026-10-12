import { breakdownSharedContentDefaultValues } from "@/components/form/courses/types/types.ts"
import DeleteFormValue from "@/components/form/general/DeleteFormValue.tsx"
import { createFormHook } from "@tanstack/react-form"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import { fieldContext, formContext } from "@/hooks/form.ts"
import RadioGroup from "@/components/form/tanstack-fields/Radio/RadioGroup.tsx"
import {allowsMultiplesEntriesRadios, getRadioGroup} from "@/components/form/tanstack-fields/Radio/GetRadioGroup.ts"
import SelectField from "@/components/form/tanstack-fields/Select/SelectField.tsx";

export const { withForm, withFieldGroup } = createFormHook({
	fieldComponents: {
		TextField,
		NumberField,
		SelectField,
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
	},
	render: function Render({
		group,
		modalTitle,
		confirmBtnAction,
	}) {
		const { AppField } = group
		return (
			<div className={"border flex flex-col gap-8"}>
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
						className={"absolute top-4 left-110"}
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
								radios={getRadioGroup(radioGroupName, allowsMultiplesEntriesRadios)}
							/>
						)
					}}
				/>
			</div>
		)
	}
})
