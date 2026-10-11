/** biome-ignore-all lint/suspicious/noArrayIndexKey: <following tanstack docs> */
import { useRef } from "react"
import {
	type BreakdownFormProps,
	breakdownDefaultProps,
	defaultValues
} from "@/components/form/courses/types/types.ts"
import { LaboratoryDetailsForm } from "@/components/form/courses/Update&Demo/LaboratoryDetailsForm.tsx"
import { AddItem } from "@/components/general/AddItem.tsx"
import { ScrollToBottom } from "@/components/ui/ScrollToBottom.tsx"
import scrollTo from "@/utils/scroll.ts"
import {
	BreakdownSharedContent,
	withForm
} from "@/components/form/courses/BreakdownSharedContent.tsx"
import BreakdownEntries from "@/components/form/courses/BreakdownEntries.tsx"

function BreakdownFormContent({
	form,
	mode,
	totalPercentage,
	labTotalPercentage,
	isForDemo
}: BreakdownFormProps) {
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
									<BreakdownSharedContent
										form={form}
										fields={{
											name: `breakdown[${i}].name`,
											percentage: `breakdown[${i}].percentage`,
											type: `breakdown[${i}].type`
										}}
										confirmBtnAction={() => {
											field.removeValue(i)
										}}
										modalTitle={"Eliminar evaluación"}
										isLabDetail={false}
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
																	<BreakdownEntries
																		form={form}
																		fields={`breakdown[${i}].entries[${entryIndex}]`}
																		hasNameField={hasNameField}
																		hasEntryGradeField={hasEntryGradeField}
																		modalTitle={"Eliminar nota"}
																		confirmBtnAction={() =>
																			entryField.removeValue(entryIndex)
																		}
																	/>
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
