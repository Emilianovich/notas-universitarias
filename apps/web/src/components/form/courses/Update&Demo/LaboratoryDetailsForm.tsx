/** biome-ignore-all lint/suspicious/noArrayIndexKey: <following tanstack docs> */

import type { UpdateCourseInstanceDto } from "@notas-universitarias/types"
import { createFormHook } from "@tanstack/react-form"
import { useRef } from "react"
import {
	breakdownDefaultProps,
	type LabDetailsBreakdownFormProps, laboratoryDetailsFormDefaultValues
} from "@/components/form/courses/types/types.ts"
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import { AddItem } from "@/components/general/AddItem.tsx"
import useModal from "@/contexts/modal.ts"
import {fieldContext, formContext} from "@/hooks/form.ts"
import scrollTo from "@/utils/scroll.ts"
import {BreakdownSharedContent, withFieldGroup} from "@/components/form/courses/BreakdownSharedContent.tsx";
import {RadioField} from "@/components/form/tanstack-fields/RadioField.tsx";
import BreakdownEntries from "@/components/form/courses/BreakdownEntries.tsx";
import SelectField from "@/components/form/tanstack-fields/SelectField.tsx";

const defaultValues: UpdateCourseInstanceDto = {
	profesorName: "Tú mismo",
	breakdown: []
}

const { withForm } = createFormHook({
	fieldComponents: {
		TextField,
		NumberField,
		RadioField,
		SelectField,
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
	const { closeModal } = useModal()
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
									<BreakdownSharedContent
										form={form}
										fields={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}]`}
										isLabDetail={true}
										modalTitle={"Eliminar evaluación de laboratorio"}
										confirmBtnAction={() => {
											breakdown.removeValue(labIndex)
											closeModal()
											scrollTo(scrollToLabEnd)
										}}
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
																	<BreakdownEntries
																		form={form}
																		fields={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].entries[${labDetailEntryIndex}]`}
																		hasNameField={hasNameField}
																		hasEntryGradeField={true}
																		modalTitle={"Eliminar nota"}
																		confirmBtnAction={() => field.removeValue(labDetailEntryIndex)}
																	/>


																	{hasNameField && (
																		<AppField
																			name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].entries[${labDetailEntryIndex}].name`}
																			children={(field) => (
																				<field.TextField
																					label={"Agrega un nombre a la nota"}
																					placeholder={"Parcial#1"}
																				/>
																			)}
																		/>
																	)}
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

// const LaboratoryDetailsForm = withFieldGroup({
// 	defaultValues,
// 	props: {
// 		isForDemo: false
// 	},
// 	render: function Render({group, isForDemo}) {
// 		const { closeModal } = useModal()
// 		const scrollToLabEnd = useRef<HTMLDivElement>(null)
// 		const form = useFormContext<UpdateCourseInstanceDto>()
// 		const {AppField, AppForm} = group
// 		return (
// 			<AppForm>
// 				<h2 className={"text-xl mt-4"}>Evaluación del curso de laboratorio</h2>
// 				{!isForDemo && (
// 					<AppField
// 						name={`profesorName`}
// 						children={(field) => (
// 							<field.TextField
// 								label={"¿Cómo se llama tu profesor?"}
// 								placeholder={""}
// 							/>
// 						)}
// 					/>
// 				)}
// 				<AppField
// 					name={"breakdown"}
// 					mode={"array"}
// 					children={(field) => (
// 						<div className={"flex flex-col gap-8"}>
// 							{field.state.value.map((_, i) => {
// 								return (
// 									<div className={"relative"} key={`labDetails${i}`}>
// 										<BreakdownSharedContent
// 											form={form}
// 										/>
// 									</div>
// 								)
// 							})}
// 						</div>
// 					)}
// 					/>
// 			</AppForm>
// 		)
// 	}
// })