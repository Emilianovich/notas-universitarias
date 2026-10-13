/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import  {
	useFormDataForCreation
} from "@/lib/course-form.ts"
import useCreateCourseInstanceOpts from "@/components/form/courses/hooks/useCreateCourseInstanceOpts.ts"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import {isArrayEmpty, ServerErrorRes} from "@notas-universitarias/helpers"
import { useRef } from "react"
import {
	getPreviousCoursesInfo,
	registerCourseInstance
} from "@/components/form/courses/Create/CreateCourseInstanceForm.tsx"
import useToast from "@/contexts/toast.ts"
import { useNavigate } from "@tanstack/react-router"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import { BreakdownSharedContent } from "@/components/form/courses/BreakdownSharedContent.tsx"
import { AddItem } from "@/components/general/AddItem.tsx"
import scrollTo from "@/utils/scroll.ts"
import {genericBooleanRadios, getRadioGroup} from "@/components/form/tanstack-fields/Radio/GetRadioGroup.ts";
import {ADDING_LAB_BREAKDOWN, type CreatingLaboratoryType} from "@notas-universitarias/types";
import FieldText from "@/components/form/general/FieldText.tsx";

export default function CreateInstanceForm() {
	const { data } = useSuspenseQuery({
		queryFn: getPreviousCoursesInfo,
		queryKey: ["getPreviousCoursesInfo"]
	})
	const { buildToast } = useToast()
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
	const form = useCreateCourseInstanceOpts({ mutation })
	const { AppForm, AppField } = form
	const {
		isRegistered,
		breakdownList,
		totalBreakdownPercentage,
		laboratoryTotalPercentage,
		laboratory
	} = useFormDataForCreation(form)
	const classes = "flex flex-col"
	const prevInstanceName = useRef<string | undefined>(undefined)
	const prevInstanceId = useRef<string | undefined>(undefined)
	const prevLaboratoryVal = useRef<CreatingLaboratoryType | undefined>(undefined)
	return (
		<AppForm>
			<form
				onSubmit={async (e) => {
					e.preventDefault()
					e.stopPropagation()
					await form.handleSubmit()
				}}
				className={`flex flex-col p-4 w-[90%] gap-12 ${isRegistered ? "h-fit" : "h-[80%]"} transition-all duration-300 ease-in-out`}
			>
				{data.content.length !== 0 && (
					<AppField
						name={"isRegistered"}
						listeners={{
							onChange: ({ value }) => {
								if (value) {
									prevInstanceName.current = form.getFieldValue("name")
									form.setFieldValue("name", undefined)
									form.setFieldValue("previousCourseId", prevInstanceId.current ?? data.content[0]._id.toString())
								} else {
									prevInstanceId.current = form.getFieldValue("previousCourseId")
									form.setFieldValue("previousCourseId", undefined)
									form.setFieldValue("name", prevInstanceName.current ?? "")
								}
							}
						}}
						children={(field) => {
							const radioGroupName = field.name
							return (
								<div className={classes}>
									<FieldText text={"¿Diste la materia anteriormente?"} />
									<field.RadioGroup
										radioGroupName={radioGroupName}
										radios={getRadioGroup(radioGroupName, genericBooleanRadios)}
									/>
								</div>
							)
						}}
					/>
				)}
				{!isRegistered ? (
					<AppField
						name={"name"}
						children={(field) => (
							<field.TextField
								label={"¿Cómo se llama la materia?"}
								placeholder={"Física I"}
							/>
						)}
					/>
				) : (
					<AppField
						name={"previousCourseId"}
						children={(field) => (
							<field.SelectField
								items={data.content}
								labelText={"¿Cómo se llama la materia?"}
								setOptionsText={item => item.name}
								setOptionKeys={item => item._id.toString()}
								setOptionsValues={item => item._id.toString()}
							/>
						)}
					/>
				)}
				<AppField
					name={"profesorName"}
					children={(field) => (
						<field.TextField
							label={"¿Cómo se llama tu profesor?"}
							placeholder={"Tom Riddle"}
						/>
					)}
				/>
				<AppField
					name={"hasLaboratory"}
					children={(field) => {
						const radioGroupName = field.name
						return (
							<div className={`${classes} mt-2`}>
								<FieldText text={"¿La materia tiene parte de laboratorio?"} />
								<field.RadioGroup
									radioGroupName={radioGroupName}
									radios={getRadioGroup(radioGroupName, genericBooleanRadios)}
								/>
							</div>
						)
					}}
					listeners={{
						onChange: ({ value }) => {
							if (value) {
								form.setFieldValue("laboratory", prevLaboratoryVal.current ?? {
									profesorName: "",
									percentage: 0,
									breakdowns: [{
										name: "",
										percentage: 0,
										allowsMultipleEntries: false
									}]
								})
							} else {
								prevLaboratoryVal.current = form.getFieldValue("laboratory")
								form.setFieldValue("laboratory", undefined)
							}
						},
					}}
				/>
				{laboratory && (
					<>
						<AppField
							name={"laboratory.profesorName"}
							children={(field) => (
								<field.TextField
									label={"¿Cómo se llama tu profesor de laboratorio?"}
									placeholder={"Gellert Grindelwald"}
								/>
							)}
						/>
						<AppField
							name={"laboratory.percentage"}
							children={(field) => (
								<field.NumberField
									label={"¿Cuánto es el porcentaje de laboratorio?"}
									placeholder={"30"}
								/>
							)}
						/>
						{!isArrayEmpty(laboratory.breakdowns) && (<h2 className={"text-xl mt-4 text-primary-500 font-bold"}>Evaluación del curso de laboratorio</h2>)}
						<AppField name={"laboratory.breakdowns"} mode={"array"}>
							{(laboratoryBreakdownField) => (
								<div className={"flex flex-col gap-8"}>
									{laboratoryBreakdownField.state.value?.map((_, i) => {
										return (
											<div key={`breakdowns[${i}]-ctn`}>
												<BreakdownSharedContent
													form={form}
													fields={`laboratory.breakdowns[${i}]`}
													confirmBtnAction={() => {
														laboratoryBreakdownField.removeValue(i)
													}}
													modalTitle={"Eliminar evaluación de laboratorio"}
												/>
											</div>
										)
									})}
									{laboratoryTotalPercentage < 100 ?(
											<AddItem
												title={ADDING_LAB_BREAKDOWN}
												action={() => {
													laboratoryBreakdownField.pushValue({
														name: "",
														percentage: 0,
														allowsMultipleEntries: false
													})
												}}
											/>

									) : null}

								</div>
							)}
						</AppField>
					</>
				)}
				{breakdownList.length > 0 && (
					<h2 className={"text-xl mt-4 text-primary-500 font-bold"}>Evaluación del curso</h2>
				)}
				<AppField name={"breakdowns"} mode={"array"}>
					{(field) => (
						<div className={"flex flex-col gap-8"}>
							{field.state.value.map((_, i) => {
								return (
									<div key={`breakdowns[${i}]-ctn`}>
										<BreakdownSharedContent
											form={form}
											fields={`breakdowns[${i}]`}
											confirmBtnAction={() => {
												field.removeValue(i)
											}}
											modalTitle={"Eliminar evaluación"}
										/>
									</div>
								)
							})}
							{totalBreakdownPercentage < 100 && (
								<AddItem
									title={"Agregar Evaluación"}
									action={() => {
										field.pushValue({
											name: "",
											percentage: 0,
											allowsMultipleEntries: false
										})
										scrollTo(scrollToRef)
									}}
								/>
							)}
						</div>
					)}
				</AppField>
				{totalBreakdownPercentage === 100 && (
					<div className={"sm:mt-4 w-full flex items-center justify-center"}>
						<SubmitBtn text={"Guardar materia"} />
					</div>
				)}
				<div ref={scrollToRef}></div>
			</form>
		</AppForm>
	)
}
