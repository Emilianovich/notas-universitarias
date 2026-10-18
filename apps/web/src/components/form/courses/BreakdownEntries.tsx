import type { CourseBreakdownEntry } from "@notas-universitarias/types"
import { withFieldGroup } from "@/components/form/courses/BreakdownSharedContent.tsx"
import DeleteFormValue from "@/components/form/general/DeleteFormValue.tsx"

const defaultValues: CourseBreakdownEntry = {
	name: "",
	rawScore: 0,
	maxScore: 0
}

const BreakdownEntries = withFieldGroup({
	defaultValues,
	props: {
		hasNameField: true,
		modalTitle: "",
		confirmBtnAction: () =>
			console.log("This is the function to run for positive modal action")
	},
	render: function Render({
		group,
		hasNameField,
		modalTitle,
		confirmBtnAction
	}) {
		const { AppField } = group
		return (
			<div className={"border border-primary-300"}>
				{hasNameField && (
					<AppField
						name={"name"}
						children={(nameEntryField) => (
							<nameEntryField.TextField
								label={"Agrega un nombre a la nota"}
								placeholder={"Parcial#1"}
							/>
						)}
					/>
				)}
				<div className={"flex w-full justify-evenly items-center"}>
					<AppField
						name={`rawScore`}
						children={(rawScoreField) => (
							<rawScoreField.NumberField
								label={"Puntaje Obtenido"}
								placeholder={""}
							/>
						)}
					/>
					<AppField
						name={`maxScore`}
						children={(maxScoreField) => (
							<maxScoreField.NumberField
								label={"Puntaje Máximo"}
								placeholder={""}
							/>
						)}
					/>
					<DeleteFormValue
						className={""}
						modalTitle={modalTitle}
						modalText={
							"Si aceptas, estarás eliminando permanentemente esta nota"
						}
						confirmButton={{
							styleType: "modal-primary",
							type: "button",
							text: "Sí, eliminar nota",
							action: confirmBtnAction
						}}
						closeButtonTitle={"No, me arrepentí"}
					/>
				</div>
			</div>
		)
	}
})

export default BreakdownEntries
