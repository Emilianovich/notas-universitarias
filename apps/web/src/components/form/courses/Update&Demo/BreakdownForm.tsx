/** biome-ignore-all lint/suspicious/noArrayIndexKey: <following tanstack docs> */

import { createFormHook } from "@tanstack/react-form"
import { Trash2 } from "lucide-react"
import { useRef } from "react"
import {
	type BreakdownFormProps,
	breakdownDefaultProps,
	defaultValues
} from "@/components/form/courses/types/types.ts"
import { LaboratoryDetailsForm } from "@/components/form/courses/Update&Demo/LaboratoryDetailsForm.tsx"
import DeleteFormValue from "@/components/form/general/DeleteFormValue.tsx"
import BreakdownTypeGroup from "@/components/form/tanstack-fields/BreakdownTypeGroup.tsx"
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import { AddItem } from "@/components/general/AddItem.tsx"
import { ScrollToBottom } from "@/components/ui/ScrollToBottom.tsx"
import useModal from "@/contexts/modal.ts"
import { fieldContext, formContext } from "@/hooks/form.ts"
import scrollTo from "@/utils/scroll.ts"

const { withForm } = createFormHook({
	fieldComponents: {
		TextField,
		NumberField,
		BreakdownTypeGroup
	},
	formComponents: { SubmitBtn },
	fieldContext,
	formContext
})

function BreakdownFormContent({
	form,
	mode,
	totalPercentage,
	labTotalPercentage,
	isForDemo
}: BreakdownFormProps) {
	const { buildModal, closeModal } = useModal()
	const scrollToEnd = useRef<HTMLDivElement>(null)
	const { AppField, AppForm } = form
	return (
		<AppForm>
			<AppField name={"breakdown"} mode={"array"}>
				{(field) => (
					<div className={"flex flex-col gap-8"}>
						{field.state.value.map((breakdown, i) => {
							return (
								<div key={`breakdown[${i}]-ctn`}>
									<div className={"relative"}>
										<Trash2
											className={
												"text-red-700 cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out absolute top-4 left-110"
											}
											onClick={() => {
												buildModal({
													modalTitle: "Eliminar evaluación",
													confirmButton: {
														type: "modal-primary",
														action: () => {
															field.removeValue(i)
															closeModal()
														},
														text: "Sí, eliminar"
													},
													closeButtonTitle: "No, me arrepentí",
													modalContent:
														"Eliminarás completamente la evaluación. No podrás recuperar el progreso que tenías"
												})
											}}
										/>
										<AppField
											name={`breakdown[${i}].name`}
											key={`breakdown[${i}].name`}
											children={(nameField) => (
												<nameField.TextField
													label={"¿Cómo se llama la evaluación?"}
													placeholder={"Asistencia"}
													inputId={`${nameField.name}-${i}-name`}
													key={`${nameField.name}-${i}-name`}
												/>
											)}
										/>
									</div>
									<AppField
										name={`breakdown[${i}].percentage`}
										key={`breakdown[${i}].percentage`}
										children={(percentageField) => (
											<percentageField.NumberField
												label={"¿Cuál es el porcentaje de la evaluación?"}
												inputId={`${field.name}-${i}-percentage`}
												placeholder={"21"}
											/>
										)}
									/>
									<AppField
										name={`breakdown[${i}].type`}
										key={`breakdown[${i}].type`}
										children={(typeField) => (
											<typeField.BreakdownTypeGroup
												index={i}
												isLabDetail={false}
											/>
										)}
									/>
									{breakdown.type === "NESTED" && (
										<LaboratoryDetailsForm
											form={form}
											i={i}
											labTotalPercentage={labTotalPercentage}
											mode={mode}
											isForDemo={isForDemo}
											totalPercentage={totalPercentage}
										/>
									)}
									{mode === "edit" && (
										<AppField
											name={`breakdown[${i}].entries`}
											mode={"array"}
											children={(entryField) => {
												const canAddEntry =
													breakdown.type === "NOT-NESTED" ||
													(breakdown.type === "STANDALONE" &&
														entryField.state.value.length < 1)
												const hasNameField =
													breakdown.type !== "STANDALONE" &&
													breakdown.type !== "NESTED"
												const hasEntryGradeField = breakdown.type !== "NESTED"
												return (
													<div className={"flex flex-col gap-4 mt-4"}>
														{entryField.state.value.map((_, entryIndex) => {
															return (
																<div
																	key={`breakdown-${i}-entry-${entryIndex}`}
																	className={"border border-primary-300"}
																>
																	{hasNameField && (
																		<AppField
																			name={`breakdown[${i}].entries[${entryIndex}].name`}
																			children={(nameEntryField) => (
																				<nameEntryField.TextField
																					label={"Agrega un nombre a la nota"}
																					placeholder={"Parcial#1"}
																					inputId={`${nameEntryField.name}-${i}-name`}
																				/>
																			)}
																		/>
																	)}
																	<div
																		className={
																			"flex w-full justify-evenly items-center"
																		}
																	>
																		{hasEntryGradeField && (
																			<>
																				<AppField
																					name={`breakdown[${i}].entries[${entryIndex}].rawScore`}
																					children={(rawScoreField) => (
																						<rawScoreField.NumberField
																							inputId={`${rawScoreField.name}-${i}-rawScore`}
																							label={"Puntaje Obtenido"}
																							placeholder={""}
																						/>
																					)}
																				/>
																				<AppField
																					name={`breakdown[${i}].entries[${entryIndex}].maxScore`}
																					children={(maxScoreField) => (
																						<maxScoreField.NumberField
																							inputId={`${maxScoreField.name}-${i}-maxScore`}
																							label={"Puntaje Máximo"}
																							placeholder={""}
																						/>
																					)}
																				/>
																				<DeleteFormValue
																					className={""}
																					modalTitle={"Eliminar nota"}
																					modalContent={
																						"Si aceptas, estarás eliminando permanentemente esta nota"
																					}
																					confirmButton={{
																						type: "modal-primary",
																						text: "Sí, eliminar nota",
																						action: () =>
																							entryField.removeValue(entryIndex)
																					}}
																					closeButtonTitle={"No, me arrepentí"}
																				/>
																			</>
																		)}
																	</div>
																</div>
															)
														})}
														{canAddEntry && (
															<AddItem
																title={"Agregar Nota"}
																action={() =>
																	entryField.pushValue({
																		name: undefined,
																		rawScore: 0,
																		maxScore: 100
																	})
																}
															/>
														)}
													</div>
												)
											}}
										/>
									)}
								</div>
							)
						})}
						{totalPercentage < 100 && (
							<AddItem
								title={"Agregar Evaluación"}
								action={() => {
									field.pushValue({
										name: "",
										percentage: 0,
										type: "STANDALONE",
										contribution: 0,
										entries: []
									})
									scrollTo(scrollToEnd)
								}}
							/>
						)}
					</div>
				)}
			</AppField>
			<ScrollToBottom ref={scrollToEnd} />
			<div ref={scrollToEnd}></div>
		</AppForm>
	)
}

export const BreakdownForm = withForm({
	props: breakdownDefaultProps,
	defaultValues,
	render: (props) => <BreakdownFormContent {...props} />
})
