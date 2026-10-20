import { createFormHook } from "@tanstack/react-form"
import { breakdownSharedContentDefaultValues } from "@/components/form/courses/types/types.ts"
import DeleteFormValue from "@/components/form/general/DeleteFormValue.tsx"
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx"
import {
	allowsMultiplesEntriesRadios,
	getRadioGroup
} from "@/components/form/tanstack-fields/Radio/GetRadioGroup.ts"
import RadioGroup from "@/components/form/tanstack-fields/Radio/RadioGroup.tsx"
import SelectField from "@/components/form/tanstack-fields/Select/SelectField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import { fieldContext, formContext } from "@/hooks/form.ts"

export const { withFieldGroup } = createFormHook({
	fieldComponents: {
		TextField,
		NumberField,
		RadioGroup,
		SelectField
	},
	formComponents: { SubmitBtn },
	fieldContext,
	formContext
})

export const BreakdownSharedContent = withFieldGroup({
	defaultValues: breakdownSharedContentDefaultValues,
	props: {
		modalTitle: "",
		confirmBtnAction: () => console.log("This is the modal confirm action")
	},
	render: function Render({ group, modalTitle, confirmBtnAction }) {
		const { AppField } = group
		return (
			<div className={"flex flex-col gap-8"}>
				<div className={"relative"}>
					<AppField
						name={`name`}
						children={(nameField) => (
							<nameField.TextField
								label={"Nombre de la evaluación"}
								placeholder={"Asistencia"}
							/>
						)}
					/>
					<DeleteFormValue
						className={"absolute top-4 right-10"}
						modalTitle={modalTitle}
						modalText={
							"Eliminarás completamente la evaluación. No podrás recuperar el progreso que tenías"
						}
						confirmButton={{
							styleType: "modal-primary",
							text: "Sí, eliminar",
							action: confirmBtnAction,
							type: "button"
						}}
						closeButtonTitle={"No, me arrepentí"}
					/>
				</div>
				<AppField
					name={`percentage`}
					children={(percentageField) => (
						<percentageField.NumberField
							label={"Porcentaje de la evaluación"}
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
								radios={getRadioGroup(
									radioGroupName,
									allowsMultiplesEntriesRadios
								)}
							/>
						)
					}}
				/>
			</div>
		)
	}
})
