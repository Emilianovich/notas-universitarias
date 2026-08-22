/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import {
	type BreakdownCategory,
	type CourseBreakdownToBeCreated,
	type CourseInstanceToBeCreated,
	type CoursesInfo,
	CreateCourseInstanceSchema,
	NESTED_LABEL,
	NOT_NESTED_LABEL,
	ON_SUBMIT_INVALID_MSG,
	STANDALONE_LABEL
} from "@notas-universitarias/types"
import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Trash2 } from "lucide-react"
import { useRef } from "react"
import DropdownMenu from "@/components/form/general/DropdownMenu.tsx"
import ErrorMessage from "@/components/form/general/ErrorMessage.tsx"
import GeneralInputContainer from "@/components/form/general/GeneralInputContainer.tsx"
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
import scrollTo from "@/utils/scroll.ts"

const registerCourseInstance = async (dto: CourseInstanceToBeCreated) => {
	return buildRequest<string, string>({
		path: "/course-instances",
		includeCredentials: true,
		method: "POST",
		reqBody: dto
	})
}

const getPreviousCoursesInfo = async () => {
	return buildRequest<CoursesInfo[], string>({
		path: "/courses",
		method: "GET",
		includeCredentials: true
	})
}

// TODO handle pending and error cases for getPreviousCoursesInfo
export default function CreateCourseInstanceForm() {
	const { data } = useSuspenseQuery({
		queryFn: getPreviousCoursesInfo,
		queryKey: ["getPreviousCoursesInfo"]
	})
	const { buildToast } = useToast()
	const { buildModal, closeModal } = useModal()
	const navigate = useNavigate({
		from: "/home/current-period/course-instance/"
	})
	const mutation = useMutation({
		mutationFn: registerCourseInstance,
		onError: (error) => {
			if (error instanceof ServerErrorRes) {
				buildToast({
					id: Date.now(),
					type: "error",
					content: error.errors
				})
			}
		},
		onSuccess: async (data) => {
			buildToast({
				id: Date.now(),
				type: "success",
				content: data.content
			})
			await navigate({ to: "/home/current-period" })
		}
	})
	const scrollToRef = useRef<HTMLDivElement | null>(null)

	const { mutate } = mutation
	const form = useForm({
		validators: {
			onBlur: CreateCourseInstanceSchema
		},
		defaultValues: {
			isRegistered: false,
			name: undefined,
			previousCourseId: undefined,
			profesorName: "",
			breakdown: [] as CourseBreakdownToBeCreated[]
		} as CourseInstanceToBeCreated,
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: ON_SUBMIT_INVALID_MSG
			})
		},
		onSubmit: async ({ value }) => {
			mutate(value)
		}
	})
	const { Field } = form
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	const isRegistered = useSelector(
		form.store,
		(state) => state.values.isRegistered
	)
	const breakdownArray = useSelector(
		form.store,
		(state) => state.values.breakdown
	)

	const totalPercentage = breakdownArray.reduce(
		(previousVal, currentVal) => previousVal + currentVal.percentage,
		0
	)
	const laboratoryDetailBreakdownArray = breakdownArray.find(
		(breakdown) => breakdown.type === "NESTED"
	)?.laboratoryDetails?.breakdown
	const labDetailTotalPercentage =
		laboratoryDetailBreakdownArray?.reduce(
			(previousVal, currentVal) => previousVal + currentVal.percentage,
			0
		) ?? -1
	breakdownArray.forEach((breakdown) => {
		if (breakdown.type !== "NESTED" && breakdown.laboratoryDetails) {
			breakdown.laboratoryDetails = undefined
		}
	})
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				e.stopPropagation()
				await form.handleSubmit()
			}}
			className={`flex flex-col p-4 w-[90%] gap-2 ${isRegistered ? "h-fit" : "h-[80%]"} transition-all duration-300 ease-in-out`}
		>
			{data.content.length !== 0 && (
				<Field
					name={"isRegistered"}
					children={(fieldApi) => {
						const { name, handleBlur, handleChange, state } = fieldApi
						const { isBlurred } = fieldApi.state.meta
						return (
							<GeneralInputContainer
								labelText={"¿Ya diste la materia anteriormente?"}
								inputId={name}
								maxWidth={400}
								isBlurred={isBlurred || submissionAttempts > 0}
								input={
									<div className={"flex flex-col gap-2"}>
										<RadioInput
											currentVal={state.value ? "1" : "0"}
											radioGroupName={name}
											value={"1"}
											radioId={"hasNotBeenRegistered"}
											labelText={"Sí"}
											syncValueToState={(e) =>
												handleChange(Boolean(Number(e.target.value)))
											}
											handleBlur={handleBlur}
										/>
										<RadioInput
											radioGroupName={name}
											value={"0"}
											currentVal={state.value ? "1" : "0"}
											radioId={"hasBeenRegistered"}
											labelText={"No"}
											syncValueToState={(e) =>
												handleChange(Boolean(Number(e.target.value)))
											}
											handleBlur={handleBlur}
										/>
									</div>
								}
							/>
						)
					}}
				/>
			)}
			{!isRegistered && (
				<Field
					name={"name"}
					children={(fieldApi) => {
						const { errors, isBlurred } = fieldApi.state.meta
						const { name, handleBlur, handleChange, state } = fieldApi
						const inputProps: InputProps<string> = {
							name,
							handleBlur,
							syncValueToState: (e) => handleChange(e.target.value),
							isBlurred: isBlurred || submissionAttempts > 0,
							type: "text",
							originallyPassword: false,
							label: "¿Cómo se llama la materia?",
							error: errors[0]?.message,
							id: name,
							color: "#F9FCFC",
							placeholder: "Física I",
							value: state.value as string
						}
						return <Input {...inputProps} />
					}}
				/>
			)}
			{isRegistered && (
				<Field
					name={"previousCourseId"}
					children={(fieldApi) => {
						const { errors, isBlurred } = fieldApi.state.meta
						const { name, handleBlur, handleChange } = fieldApi
						console.log(JSON.stringify(errors))
						return (
							<DropdownMenu
								selectedItem={data.content[0].name}
								iterableItems={data.content}
								label={"¿Cómo se llama la materia?"}
								name={name}
								error={errors[0]?.message}
								syncValueToState={(e) => handleChange(e.target.value)}
								handleBlur={handleBlur}
								isBlurred={isBlurred || submissionAttempts > 0}
								color={"#F9FCFC"}
								id={name}
							/>
						)
					}}
				/>
			)}
			<Field
				name={"profesorName"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
					const { name, handleBlur, handleChange, state } = fieldApi
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
						value: state.value
					}
					return <Input {...inputProps} />
				}}
			/>
			{breakdownArray.length > 0 && (
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
															value={"STANDALONE"}
															labelText={STANDALONE_LABEL}
															radioId={`breakdown[${i}].standalone`}
															{...generalRadioProps}
															key={`breakdown[${i}].standalone`}
														/>
														<RadioInput
															value={"NESTED"}
															labelText={NESTED_LABEL}
															radioId={`breakdown[${i}].nested`}
															{...generalRadioProps}
															key={`breakdown[${i}].nested`}
														/>
														<RadioInput
															value={"NOT-NESTED"}
															labelText={NOT_NESTED_LABEL}
															radioId={`breakdown[${i}].not-nested`}
															{...generalRadioProps}
															key={`breakdown[${i}].not-nested`}
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
																					(_, labIndex) => {
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
																											currentVal: state.value,
																											radioGroupName: `breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].type`
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
																													value={"STANDALONE"}
																													labelText={
																														STANDALONE_LABEL
																													}
																													radioId={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].standalone`}
																													{...generalRadioProps}
																													key={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].standalone`}
																												/>
																												<RadioInput
																													value={"NOT-NESTED"}
																													labelText={
																														NOT_NESTED_LABEL
																													}
																													radioId={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].not-nested`}
																													{...generalRadioProps}
																													key={`breakdown[${i}].laboratoryDetails.breakdown[${labIndex}].not-nested`}
																												/>
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
																						action={() => {
																							labDetailBreakdown.pushValue({
																								name: "",
																								percentage: 0,
																								type: "STANDALONE"
																							})
																							scrollTo(scrollToRef)
																						}}
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
									</div>
								)
							})}
							{totalPercentage < 100 && (
								<AddItem
									title={"Agregar Evaluación"}
									action={() => {
										fieldApi.pushValue({
											name: "",
											percentage: 0,
											type: "STANDALONE"
										})
										scrollTo(scrollToRef)
									}}
								/>
							)}
						</div>
					)
				}}
			</Field>
			{totalPercentage === 100 && (
				<div className={"sm:mt-4 w-full flex items-center justify-center"}>
					<Button
						text={"Guardar materia"}
						type={"submit"}
						styleType={"primary"}
						isDisabled={false}
					/>
				</div>
			)}
			<div ref={scrollToRef}></div>
		</form>
	)
}
