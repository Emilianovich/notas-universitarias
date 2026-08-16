/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */

import {
	gradeToLetter,
	updateCourseInstanceFinalGrade
} from "@notas-universitarias/helpers"
import {
	type BreakdownCategory,
	type CourseInstance,
	ON_SUBMIT_INVALID_MSG,
	type UpdateCourseInstanceDto,
	updateCourseInstanceSchema
} from "@notas-universitarias/types"
import { useForm, useSelector } from "@tanstack/react-form"
import { Trash2 } from "lucide-react"
import DeleteFormValue from "@/components/form/general/DeleteFormValue.tsx"
import ErrorMessage from "@/components/form/general/ErrorMessage.tsx"
import Input from "@/components/form/general/Input.tsx"
import NumberInput, {
	type NumberInputProps
} from "@/components/form/general/NumberInput.tsx"
import RadioInput, {
	type RadioInputProps
} from "@/components/form/general/RadioInput.tsx"
import { AddItem } from "@/components/general/AddItem.tsx"
import Button from "@/components/general/Button.tsx"
import useModal from "@/contexts/modal.ts"
import useToast from "@/contexts/toast.ts"
import type { InputProps } from "@/types/input.ts"

type UpdateCourseInstanceFormProps = {
	defaultValues: UpdateCourseInstanceDto
	isForDemo: boolean
}

export function UpdateCourseInstanceForm({
	defaultValues,
	isForDemo
}: UpdateCourseInstanceFormProps) {
	const { buildModal, closeModal } = useModal()
	const { buildToast } = useToast()
	const form = useForm({
		validators: {
			onBlur: updateCourseInstanceSchema
		},
		defaultValues,
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "info",
				content: ON_SUBMIT_INVALID_MSG
			})
		},
		onSubmit: async ({ value }) => {
			// if (isForDemo && !value.breakdown) {
			//     buildToast({
			//         id: Date.now(),
			//         type: "info",
			//         content: "Para calcular tu nota es necesario especificar la subdivisión de la materia"
			//     })
			//     return
			// }
			if (isForDemo) {
				const courseInstance: CourseInstance = {
					finalGrade: 0,
					breakdown: value.breakdown,
					profesorName: value.profesorName ?? ""
				}
				updateCourseInstanceFinalGrade(courseInstance)
				buildToast({
					id: Date.now(),
					type: "info",
					content: `Tu nota final sería ${courseInstance.finalGrade} y la letra ${gradeToLetter(courseInstance.finalGrade)}`
				})
				return
			}
		}
	})
	const { Field } = form
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	const breakdownList = useSelector(
		form.store,
		(state) => state.values.breakdown
	)
	const totalPercentage = breakdownList.reduce(
		(previousVal, currentVal) => previousVal + currentVal.percentage,
		0
	)
	const laboratoryDetailBreakdown = breakdownList.find(
		(breakdown) => breakdown.type === "NESTED"
	)?.laboratoryDetails?.breakdown
	const labDetailTotalPercentage =
		laboratoryDetailBreakdown?.reduce(
			(previousVal, currentVal) => previousVal + currentVal.percentage,
			0
		) ?? -1
	breakdownList.forEach((currBreakdown) => {
		if (currBreakdown.type !== "NESTED" && currBreakdown.laboratoryDetails) {
			currBreakdown.laboratoryDetails = undefined
		}
		if (currBreakdown.type === "NESTED" && currBreakdown.laboratoryDetails) {
			currBreakdown.laboratoryDetails.finalGrade = 0
		}
	})

	const formValue = useSelector(form.store, (state) => state.values)
	console.log(JSON.stringify(formValue))
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				e.stopPropagation()
				await form.handleSubmit()
			}}
			className="w-full flex flex-col gap-4 p-4"
		>
			{isForDemo && (
				<h1 className={"mt-4 text-4xl font-bold text-center"}>Demo</h1>
			)}
			{!isForDemo && (
				<Field
					name={"profesorName"}
					children={(field) => {
						const { errors, isBlurred } = field.state.meta
						const { name, handleBlur, handleChange, state } = field
						const inputProps: InputProps<string> = {
							name,
							handleBlur,
							syncValueToState: (e) => handleChange(e.target.value),
							isBlurred: isBlurred || submissionAttempts > 0,
							type: "text",
							originallyPassword: false,
							label: "¿Cómo se llama tu profesor?",
							error: errors[0]?.message,
							id: name,
							color: "#F9FCFC",
							placeholder: "Lord Voldemort",
							value: state.value as string
						}
						return <Input {...inputProps} />
					}}
				/>
			)}
			{breakdownList.length > 0 && (
				<h2 className={"text-xl mt-4"}>Evaluación del curso</h2>
			)}
			<Field name={"breakdown"} mode={"array"}>
				{(fieldApi) => {
					return (
						<div className={"flex flex-col gap-8"}>
							{fieldApi.state.value.map((breakdown, i) => {
								return (
									<div key={`breakdown[${i}]-ctn`}>
										<div className={"relative"}>
											<Field
												name={`breakdown[${i}].name`}
												key={`breakdown[${i}].name`}
											>
												{(nameField) => {
													const { errors, isBlurred } = nameField.state.meta
													const { name, handleBlur, handleChange, state } =
														nameField
													const inputProps: InputProps<string> = {
														name: `${name}-${i}-name`,
														id: `${name}-${i}-name`,
														value: state.value,
														type: "text",
														syncValueToState: (e) =>
															handleChange(e.currentTarget.value),
														isBlurred: isBlurred || submissionAttempts > 0,
														label: "¿Cómo se llama la evaluación?",
														placeholder: "Asistencia",
														error: errors[0]?.message,
														color: "#F9FCFC",
														handleBlur,
														originallyPassword: false
													}
													return (
														<Input {...inputProps} key={`${name}-${i}-name`} />
													)
												}}
											</Field>
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
																fieldApi.removeValue(i)
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
										</div>
										<Field
											name={`breakdown[${i}].percentage`}
											key={`breakdown[${i}].percentage`}
										>
											{(percentageField) => {
												const { errors, isBlurred } = percentageField.state.meta
												const { name, handleBlur, handleChange, state } =
													percentageField
												const numberInputProps: NumberInputProps = {
													name: `${name}-${i}-percentage`,
													id: `${name}-${i}-percentage`,
													value: state.value.toString(),
													syncValueToState: (e) =>
														handleChange(Number(e.currentTarget.value)),
													isBlurred: isBlurred || submissionAttempts > 0,
													label: "¿Cuál es el porcentaje de la evaluación?",
													error: errors[0]?.message,
													color: "#F9FCFC",
													handleBlur
												}
												return (
													<NumberInput
														{...numberInputProps}
														key={`${name}-${i}-percentage`}
													/>
												)
											}}
										</Field>
										<Field
											name={`breakdown[${i}].type`}
											key={`breakdown[${i}].type`}
										>
											{(typeField) => {
												const { handleBlur, handleChange, state } = typeField
												const { errors, isBlurred } = typeField.state.meta
												const generalRadioProps: Omit<
													RadioInputProps,
													"value" | "labelText" | "radioId"
												> = {
													handleBlur,
													syncValueToState: (e) =>
														handleChange(e.target.value as BreakdownCategory),
													radioGroupName: `breakdown[${i}].type`,
													currentVal: state.value
												}
												return (
													<div className={"flex flex-col gap-2"}>
														<h2 className={"text-xl"}>La evaluación tiene</h2>
														<RadioInput
															value={"NESTED"}
															labelText={"Parte de teoría y laboratorio"}
															radioId={`breakdown[${i}].nested`}
															{...generalRadioProps}
															key={`breakdown[${i}].nested`}
														/>
														<RadioInput
															value={"NOT-NESTED"}
															labelText={"Tiene subdivisiones"}
															radioId={`breakdown[${i}].not-nested`}
															{...generalRadioProps}
															key={`breakdown[${i}].not-nested`}
														/>
														<RadioInput
															value={"STANDALONE"}
															labelText={"Es un solo porcentaje"}
															radioId={`breakdown[${i}].standalone`}
															{...generalRadioProps}
															key={`breakdown[${i}].standalone`}
														/>
														{errors && isBlurred && (
															<ErrorMessage
																error={errors[0]?.message as string}
															/>
														)}
														{breakdown.type === "NESTED" && (
															<>
																<h2 className={"text-xl mt-4"}>
																	Evaluación del curso de laboratorio
																</h2>
																<Field
																	name={`breakdown[${i}].laboratoryDetails.profesorName`}
																	children={(fieldApi) => {
																		const { errors, isBlurred } =
																			fieldApi.state.meta
																		const {
																			name,
																			handleBlur,
																			handleChange,
																			state
																		} = fieldApi
																		return (
																			<Input
																				key={`breakdown[${i}].laboratoryDetails.profesorName`}
																				label={"¿Cómo se llama tu profesor?"}
																				type={"text"}
																				name={name}
																				value={state.value as string}
																				error={errors[0]?.message}
																				syncValueToState={(e) =>
																					handleChange(e.target.value)
																				}
																				handleBlur={handleBlur}
																				isBlurred={
																					isBlurred || submissionAttempts > 0
																				}
																				color={"#F9FCFC"}
																				id={`breakdown[${i}].laboratoryDetails.profesorName`}
																				originallyPassword={false}
																			/>
																		)
																	}}
																/>
																<Field
																	name={`breakdown[${i}].laboratoryDetails.breakdown`}
																	mode={"array"}
																>
																	{(labDetailBreakdown) => {
																		return (
																			<div className={"flex flex-col gap-8"}>
																				{labDetailBreakdown.state.value?.map(
																					(labBreakdown, labIndex) => {
																						return (
																							<div
																								className={"relative"}
																								key={`labDetails${labIndex}`}
																							>
																								<Trash2
																									className={
																										"text-red-700 cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out absolute top-4 left-110"
																									}
																									onClick={() => {
																										buildModal({
																											modalTitle:
																												"Eliminar evaluación de laboratorio",
																											confirmButton: {
																												type: "modal-primary",
																												action: () => {
																													fieldApi.removeValue(
																														i
																													)
																													closeModal()
																												},
																												text: "Sí, eliminar"
																											},
																											closeButtonTitle:
																												"No, me arrepentí",
																											modalContent:
																												"Eliminarás completamente la evaluación. No podrás recuperar el progreso que tenías"
																										})
																									}}
																								/>
																								<Field
																									name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].name`}
																									key={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].name`}
																								>
																									{(labDetailEvalName) => {
																										const {
																											errors,
																											isBlurred
																										} =
																											labDetailEvalName.state
																												.meta
																										const {
																											name,
																											handleBlur,
																											handleChange,
																											state
																										} = labDetailEvalName
																										const inputProps: InputProps<string> =
																											{
																												name: `${name}-${i}-name`,
																												id: `${name}-${i}-name`,
																												value:
																													state.value as string,
																												type: "text",
																												syncValueToState: (e) =>
																													handleChange(
																														e.currentTarget
																															.value
																													),
																												isBlurred:
																													isBlurred ||
																													submissionAttempts >
																														0,
																												label:
																													"¿Cómo se llama la evaluación?",
																												placeholder:
																													"Asistencia",
																												error:
																													errors[0]?.message,
																												color: "#F9FCFC",
																												handleBlur,
																												originallyPassword: false
																											}
																										return (
																											<Input
																												{...inputProps}
																												key={`${name}-${i}-name`}
																											/>
																										)
																									}}
																								</Field>
																								<Field
																									name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].percentage`}
																								>
																									{(
																										labDetailBreakdownPercentField
																									) => {
																										const {
																											errors,
																											isBlurred
																										} =
																											labDetailBreakdownPercentField
																												.state.meta
																										const {
																											name,
																											handleBlur,
																											handleChange,
																											state
																										} =
																											labDetailBreakdownPercentField
																										const numberInputProps: NumberInputProps =
																											{
																												name: `${name}-${i}-percentage`,
																												id: `${name}-${i}-percentage`,
																												value:
																													state.value?.toString() as string,
																												syncValueToState: (e) =>
																													handleChange(
																														Number(
																															e.currentTarget
																																.value
																														)
																													),
																												isBlurred:
																													isBlurred ||
																													submissionAttempts >
																														0,
																												label:
																													"¿Cuál es el porcentaje de la evaluación de laboratorio?",
																												error:
																													errors[0]?.message,
																												color: "#F9FCFC",
																												handleBlur
																											}
																										return (
																											<NumberInput
																												{...numberInputProps}
																												key={`${name}-${i}-percentage`}
																											/>
																										)
																									}}
																								</Field>
																								<Field
																									name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].type`}
																									key={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].type`}
																								>
																									{(labDetailTypeField) => {
																										const {
																											handleBlur,
																											handleChange,
																											state
																										} = labDetailTypeField
																										const generalRadioProps: Omit<
																											RadioInputProps,
																											| "value"
																											| "labelText"
																											| "radioId"
																										> = {
																											handleBlur,
																											syncValueToState: (e) =>
																												handleChange(
																													e.target
																														.value as BreakdownCategory
																												),
																											radioGroupName: `breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].type`,
																											currentVal: state.value
																										}
																										return (
																											<div
																												className={
																													"flex flex-col gap-2"
																												}
																											>
																												<h2
																													className={"text-xl"}
																												>
																													La evaluación tiene
																												</h2>
																												<RadioInput
																													value={"NOT-NESTED"}
																													labelText={
																														"Tiene subdivisiones"
																													}
																													radioId={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].not-nested`}
																													{...generalRadioProps}
																													key={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].not-nested`}
																												/>
																												<RadioInput
																													value={"STANDALONE"}
																													labelText={
																														"Es un solo porcentaje"
																													}
																													radioId={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].standalone`}
																													{...generalRadioProps}
																													key={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].standalone`}
																												/>
																											</div>
																										)
																									}}
																								</Field>
																								<Field
																									name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].entries`}
																									mode={"array"}
																								>
																									{(labDetailEntryField) => {
																										const canAddEntry =
																											labBreakdown.type ===
																												"NOT-NESTED" ||
																											(labBreakdown.type ===
																												"STANDALONE" &&
																												labDetailEntryField
																													.state.value.length <
																													1)
																										const hasNameField =
																											labBreakdown.type !==
																											"STANDALONE"
																										return (
																											<div>
																												{labDetailEntryField.state.value.map(
																													(
																														_,
																														labDetailEntryIndex
																													) => {
																														return (
																															<div
																																key={`breakdown-${i}-labDetail-entry-${labDetailEntryIndex}`}
																															>
																																{hasNameField && (
																																	<Field
																																		name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].entries[${labDetailEntryIndex}].name`}
																																		children={(
																																			nameEntryField
																																		) => {
																																			const {
																																				errors,
																																				isBlurred
																																			} =
																																				nameEntryField
																																					.state
																																					.meta
																																			const {
																																				name,
																																				handleBlur,
																																				handleChange,
																																				state
																																			} =
																																				nameEntryField
																																			const inputProps: InputProps<string> =
																																				{
																																					name: `${name}-${i}-name`,
																																					id: `${name}-${i}-name`,
																																					value:
																																						state.value as string,
																																					type: "text",
																																					syncValueToState:
																																						(
																																							e
																																						) =>
																																							handleChange(
																																								e
																																									.currentTarget
																																									.value
																																							),
																																					isBlurred:
																																						isBlurred ||
																																						submissionAttempts >
																																							0,
																																					label:
																																						"Agrega un nombre a la nota",
																																					placeholder:
																																						"Parcial#1",
																																					error:
																																						errors[0]
																																							?.message,
																																					color:
																																						"#F9FCFC",
																																					handleBlur,
																																					originallyPassword: false
																																				}
																																			return (
																																				<Input
																																					{...inputProps}
																																					key={`${name}-${i}-name`}
																																				/>
																																			)
																																		}}
																																	/>
																																)}
																																<div
																																	className={
																																		"flex w-full justify-evenly items-center"
																																	}
																																>
																																	<Field
																																		name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].entries[${labDetailEntryIndex}].rawScore`}
																																		children={(
																																			rawScoreField
																																		) => {
																																			const {
																																				errors,
																																				isBlurred
																																			} =
																																				rawScoreField
																																					.state
																																					.meta
																																			const {
																																				name,
																																				handleBlur,
																																				handleChange,
																																				state
																																			} =
																																				rawScoreField
																																			const numberInputProps: NumberInputProps =
																																				{
																																					name: `${name}-${i}-rawScore`,
																																					id: `${name}-${i}-rawScore`,
																																					value:
																																						state.value.toString(),
																																					syncValueToState:
																																						(
																																							e
																																						) =>
																																							handleChange(
																																								Number(
																																									e
																																										.currentTarget
																																										.value
																																								)
																																							),
																																					isBlurred:
																																						isBlurred ||
																																						submissionAttempts >
																																							0,
																																					label:
																																						"Puntaje Obtenido",
																																					error:
																																						errors[0]
																																							?.message,
																																					color:
																																						"#F9FCFC",
																																					handleBlur
																																				}
																																			return (
																																				<NumberInput
																																					{...numberInputProps}
																																					key={`${name}-${i}-rawScore`}
																																				/>
																																			)
																																		}}
																																	/>
																																	<Field
																																		name={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].entries[${labDetailEntryIndex}].maxScore`}
																																		children={(
																																			maxScoreField
																																		) => {
																																			const {
																																				errors,
																																				isBlurred
																																			} =
																																				maxScoreField
																																					.state
																																					.meta
																																			const {
																																				name,
																																				handleBlur,
																																				handleChange,
																																				state
																																			} =
																																				maxScoreField
																																			const numberInputProps: NumberInputProps =
																																				{
																																					name: `${name}-${i}-maxScore`,
																																					id: `${name}-${i}-maxScore`,
																																					value:
																																						state.value.toString() as string,
																																					syncValueToState:
																																						(
																																							e
																																						) =>
																																							handleChange(
																																								Number(
																																									e
																																										.currentTarget
																																										.value
																																								)
																																							),
																																					isBlurred:
																																						isBlurred ||
																																						submissionAttempts >
																																							0,
																																					label:
																																						"Puntaje Máximo",
																																					error:
																																						errors[0]
																																							?.message,
																																					color:
																																						"#F9FCFC",
																																					handleBlur
																																				}
																																			return (
																																				<NumberInput
																																					{...numberInputProps}
																																					key={`${name}-${i}-maxScore`}
																																				/>
																																			)
																																		}}
																																	/>
																																	<DeleteFormValue
																																		className={
																																			""
																																		}
																																		modalTitle={
																																			"Eliminar nota"
																																		}
																																		modalContent={
																																			"Si aceptas, estarás eliminando permanentemente esta nota"
																																		}
																																		confirmButton={{
																																			type: "modal-primary",
																																			text: "Sí, eliminar nota",
																																			action:
																																				() =>
																																					labDetailEntryField.removeValue(
																																						labDetailEntryIndex
																																					)
																																		}}
																																		closeButtonTitle={
																																			"No, me arrepentí"
																																		}
																																	/>
																																</div>
																															</div>
																														)
																													}
																												)}
																												{canAddEntry && (
																													<AddItem
																														title={
																															"Agregar Nota para la sección de Laboratorio"
																														}
																														action={() =>
																															labDetailEntryField.pushValue(
																																{
																																	name: undefined,
																																	rawScore: 0,
																																	maxScore: 0
																																}
																															)
																														}
																													/>
																												)}
																											</div>
																										)
																									}}
																								</Field>
																							</div>
																						)
																					}
																				)}
																				{labDetailTotalPercentage < 100 && (
																					<AddItem
																						title={
																							"Agregar evaluación para el laboratorio"
																						}
																						action={() =>
																							labDetailBreakdown.pushValue({
																								name: "",
																								percentage: 0,
																								contribution: 0,
																								type: "STANDALONE",
																								entries: []
																							})
																						}
																					/>
																				)}
																			</div>
																		)
																	}}
																</Field>
															</>
														)}
													</div>
												)
											}}
										</Field>
										<Field name={`breakdown[${i}].entries`} mode={"array"}>
											{(entryField) => {
												const canAddEntry =
													breakdown.type === "NOT-NESTED" ||
													(breakdown.type === "STANDALONE" &&
														entryField.state.value.length < 1)
												const hasNameField =
													breakdown.type !== "STANDALONE" &&
													breakdown.type !== "NESTED"
												const hasEntryGradeField = breakdown.type !== "NESTED"
												return (
													<div>
														{entryField.state.value.map((_, entryIndex) => {
															return (
																<div key={`breakdown-${i}-entry-${entryIndex}`}>
																	{hasNameField && (
																		<Field
																			name={`breakdown[${i}].entries[${entryIndex}].name`}
																			children={(nameEntryField) => {
																				const { errors, isBlurred } =
																					nameEntryField.state.meta
																				const {
																					name,
																					handleBlur,
																					handleChange,
																					state
																				} = nameEntryField
																				const inputProps: InputProps<string> = {
																					name: `${name}-${i}-name`,
																					id: `${name}-${i}-name`,
																					value: state.value as string,
																					type: "text",
																					syncValueToState: (e) =>
																						handleChange(e.currentTarget.value),
																					isBlurred:
																						isBlurred || submissionAttempts > 0,
																					label: "Agrega un nombre a la nota",
																					placeholder: "Parcial#1",
																					error: errors[0]?.message,
																					color: "#F9FCFC",
																					handleBlur,
																					originallyPassword: false
																				}
																				return (
																					<Input
																						{...inputProps}
																						key={`${name}-${i}-name`}
																					/>
																				)
																			}}
																		/>
																	)}
																	<div
																		className={
																			"flex w-full justify-evenly items-center"
																		}
																	>
																		{hasEntryGradeField && (
																			<>
																				<Field
																					name={`breakdown[${i}].entries[${entryIndex}].rawScore`}
																					children={(rawScoreField) => {
																						const { errors, isBlurred } =
																							rawScoreField.state.meta
																						const {
																							name,
																							handleBlur,
																							handleChange,
																							state
																						} = rawScoreField
																						const numberInputProps: NumberInputProps =
																							{
																								name: `${name}-${i}-rawScore`,
																								id: `${name}-${i}-rawScore`,
																								value: state.value.toString(),
																								syncValueToState: (e) =>
																									handleChange(
																										Number(
																											e.currentTarget.value
																										)
																									),
																								isBlurred:
																									isBlurred ||
																									submissionAttempts > 0,
																								label: "Puntaje Obtenido",
																								error: errors[0]?.message,
																								color: "#F9FCFC",
																								handleBlur
																							}
																						return (
																							<NumberInput
																								{...numberInputProps}
																								key={`${name}-${i}-rawScore`}
																							/>
																						)
																					}}
																				/>
																				<Field
																					name={`breakdown[${i}].entries[${entryIndex}].maxScore`}
																					children={(maxScoreField) => {
																						const { errors, isBlurred } =
																							maxScoreField.state.meta
																						const {
																							name,
																							handleBlur,
																							handleChange,
																							state
																						} = maxScoreField
																						const numberInputProps: NumberInputProps =
																							{
																								name: `${name}-${i}-maxScore`,
																								id: `${name}-${i}-maxScore`,
																								value: state.value.toString(),
																								syncValueToState: (e) =>
																									handleChange(
																										Number(
																											e.currentTarget.value
																										)
																									),
																								isBlurred:
																									isBlurred ||
																									submissionAttempts > 0,
																								label: "Puntaje Máximo",
																								error: errors[0]?.message,
																								color: "#F9FCFC",
																								handleBlur
																							}
																						return (
																							<NumberInput
																								{...numberInputProps}
																								key={`${name}-${i}-maxScore`}
																							/>
																						)
																					}}
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
																		maxScore: 0
																	})
																}
															/>
														)}
													</div>
												)
											}}
										</Field>
									</div>
								)
							})}
							{totalPercentage < 100 && (
								<AddItem
									title={"Agregar Evaluación"}
									action={() =>
										fieldApi.pushValue({
											name: "",
											percentage: 0,
											type: "STANDALONE",
											contribution: 0,
											entries: []
										})
									}
								/>
							)}
						</div>
					)
				}}
			</Field>
			{totalPercentage === 100 && (
				<div className="w-full flex justify-center items-center">
					<Button
						text={isForDemo ? "Calcular nota final" : "Guardar cambios"}
						type={"submit"}
						styleType={"primary"}
						isDisabled={false}
					/>
				</div>
			)}
		</form>
	)
}
