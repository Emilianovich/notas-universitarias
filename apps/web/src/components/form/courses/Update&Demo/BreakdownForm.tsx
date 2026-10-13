/** biome-ignore-all lint/suspicious/noArrayIndexKey: <following tanstack docs> */
import { useRef } from "react"
import {
	type BreakdownFormProps,
	breakdownDefaultProps,
	defaultValues
} from "@/components/form/courses/types/types.ts"
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
	totalPercentage,
	isLaboratory
}: BreakdownFormProps) {
	const scrollToEnd = useRef<HTMLDivElement>(null)
	const { AppField } = form
	const fieldName = isLaboratory ? "breakdowns" : "laboratory.breakdowns"
	return (
			<>
				<AppField name={fieldName} mode={"array"}>
					{(field) => (
						<div className={"flex flex-col gap-8"}>
							{field.state.value?.map((breakdown, i) => {
								return (
									<div key={`breakdowns[${i}]-ctn`}>
										<BreakdownSharedContent
											form={form}
											fields={{
												name: `breakdowns[${i}].name`,
												percentage: `breakdowns[${i}].percentage`,
												allowsMultipleEntries: `breakdowns[${i}].allowsMultipleEntries`
											}}
											confirmBtnAction={() => {
												field.removeValue(i)
											}}
											modalTitle={"Eliminar evaluación"}
										/>
										<AppField
											name={`breakdowns[${i}].entries`}
											mode={"array"}
											children={(entryField) => {
												const canAddEntry =
													breakdown.allowsMultipleEntries ||
													(!breakdown.allowsMultipleEntries &&
														entryField.state.value.length < 1)
												const hasNameField =
													breakdown.allowsMultipleEntries
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
																		fields={`breakdowns[${i}].entries[${entryIndex}]`}
																		hasNameField={hasNameField}
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
											allowsMultipleEntries: false,
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
			</>
	)
}

export const BreakdownForm = withForm({
	props: breakdownDefaultProps,
	defaultValues,
	render: (props) => <BreakdownFormContent {...props} />
})
