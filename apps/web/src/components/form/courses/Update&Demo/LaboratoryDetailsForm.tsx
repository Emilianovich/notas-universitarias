/** biome-ignore-all lint/suspicious/noArrayIndexKey: <following tanstack docs> */

import type { UpdateCourseInstanceDto } from "@notas-universitarias/types"
import { createFormHook } from "@tanstack/react-form"
import { Trash2 } from "lucide-react"
import { useRef } from "react"
import {
	breakdownDefaultProps,
	type LabDetailsBreakdownFormProps
} from "@/components/form/courses/types/types.ts"
import DeleteFormValue from "@/components/form/general/DeleteFormValue.tsx"
import BreakdownTypeGroup from "@/components/form/tanstack-fields/BreakdownTypeGroup.tsx"
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import { AddItem } from "@/components/general/AddItem.tsx"
import useModal from "@/contexts/modal.ts"
import { fieldContext, formContext } from "@/hooks/form.ts"
import scrollTo from "@/utils/scroll.ts"

const defaultValues: UpdateCourseInstanceDto = {
	profesorName: "Tú mismo",
	breakdown: []
}

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

function LaboratoryDetailsFormContent({
	form,
	mode,
	labTotalPercentage,
	isForDemo,
	i
}: LabDetailsBreakdownFormProps) {
	const { buildModal, closeModal } = useModal()
	const scrollToLabEnd = useRef<HTMLDivElement>(null)
	const { AppField, AppForm } = form
	return (
		<AppForm>
			<h2 className={"text-xl mt-4"}>Evaluación del curso de laboratorio</h2>
			{!isForDemo && (
				<AppField
					name={`breakdown[${i}].laboratoryDetails.profesorName`}
					children={(field) => (
						<field.TextField
							key={`breakdown[${i}].laboratoryDetails.profesorName`}
							label={"¿Cómo se llama tu profesor?"}
							inputId={`breakdown[${i}].laboratoryDetails.profesorName`}
							placeholder={""}
						/>
					)}
				/>
			)}
			<AppField
				name={`breakdown[${i}].laboratoryDetails.breakdown`}
				mode={"array"}
				children={(breakdown) => (
					<div className={"flex flex-col gap-8"}>
						{breakdown.state.value?.map((labBreakdown, labIndex) => {
							return (
								<div className={"relative"} key={`labDetails${labIndex}`}>
									<Trash2
										className={
											"text-red-700 cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out absolute top-4 left-110"
										}
										onClick={() => {
											buildModal({
												modalTitle: "Eliminar evaluación de laboratorio",
												confirmButton: {
													type: "modal-primary",
													action: () => {
														breakdown.removeValue(labIndex)
														closeModal()
														scrollTo(scrollToLabEnd)
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
										name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].name`}
										key={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].name`}
										children={(field) => (
											<field.TextField
												inputId={`${field.name}-${labIndex}-name`}
												label={"¿Cómo se llama la evaluación?"}
												placeholder={"Asistencia"}
											/>
										)}
									/>
									<AppField
										name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].percentage`}
										children={(field) => (
											<field.NumberField
												label={
													"¿Cuál es el porcentaje de la evaluación de laboratorio?"
												}
												inputId={`${field.name}-${i}-percentage`}
												placeholder={""}
											/>
										)}
									/>
									<AppField
										name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].type`}
										key={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].type`}
										children={(field) => (
											<field.BreakdownTypeGroup
												labIndex={labIndex}
												index={i}
												isLabDetail={true}
											/>
										)}
									/>
									{mode === "edit" && (
										<AppField
											name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].entries`}
											mode={"array"}
											children={(field) => {
												if (!field.state.value) return
												const canAddEntry =
													labBreakdown.type === "NOT-NESTED" ||
													(labBreakdown.type === "STANDALONE" &&
														field.state.value &&
														field.state.value.length < 1)
												const hasNameField = labBreakdown.type !== "STANDALONE"
												return (
													<div>
														{field.state.value.map((_, labDetailEntryIndex) => {
															return (
																<div
																	key={`breakdown-${i}-labDetail-entry-${labDetailEntryIndex}`}
																>
																	{hasNameField && (
																		<AppField
																			name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].entries[${labDetailEntryIndex}].name`}
																			children={(field) => (
																				<field.TextField
																					inputId={`${field.name}-${labIndex}-name`}
																					label={"Agrega un nombre a la nota"}
																					placeholder={"Parcial#1"}
																				/>
																			)}
																		/>
																	)}
																	<div
																		className={
																			"flex w-full justify-evenly items-center"
																		}
																	>
																		<AppField
																			name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].entries[${labDetailEntryIndex}].rawScore`}
																			children={(field) => (
																				<field.NumberField
																					inputId={`${field.name}-${labIndex}-name`}
																					label={"Puntaje Obtenido"}
																					placeholder={""}
																					key={`${field.name}-${labIndex}-rawScore`}
																				/>
																			)}
																		/>
																		<AppField
																			name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].entries[${labDetailEntryIndex}].maxScore`}
																			children={(field) => (
																				<field.NumberField
																					inputId={`${field.name}-${labIndex}-name`}
																					label={"Puntaje Máximo"}
																					placeholder={""}
																					key={`${field.name}-${labIndex}-maxScore`}
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
																					field.removeValue(labDetailEntryIndex)
																			}}
																			closeButtonTitle={"No, me arrepentí"}
																		/>
																	</div>
																</div>
															)
														})}
														{canAddEntry && (
															<AddItem
																title={
																	"Agregar Nota para la sección de Laboratorio"
																}
																action={() =>
																	field.pushValue({
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
						<div ref={scrollToLabEnd}></div>
						{labTotalPercentage < 100 && (
							<AddItem
								title={"Agregar evaluación para el laboratorio"}
								action={() => {
									breakdown.pushValue({
										name: "",
										percentage: 0,
										contribution: 0,
										type: "STANDALONE",
										entries: []
									})
								}}
							/>
						)}
					</div>
				)}
			/>
		</AppForm>
	)
}

export const LaboratoryDetailsForm = withForm({
	defaultValues: defaultValues,
	props: { i: 0, ...breakdownDefaultProps },
	render: (props) => <LaboratoryDetailsFormContent {...props} />
})
