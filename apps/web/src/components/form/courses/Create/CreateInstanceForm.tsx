/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import usePercentagesForEdit, {
	useFormDataForCreation
} from "@/lib/course-form.ts"
import useCreateCourseInstanceOpts from "@/components/form/courses/hooks/useCreateCourseInstanceOpts.ts"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { ServerErrorRes } from "@notas-universitarias/helpers"
import { useRef } from "react"
import {
	getPreviousCoursesInfo,
	registerCourseInstance
} from "@/components/form/courses/Create/CreateCourseInstanceForm.tsx"
import useToast from "@/contexts/toast.ts"
import { useNavigate } from "@tanstack/react-router"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import { BreakdownSharedContent } from "@/components/form/courses/BreakdownSharedContent.tsx"
import { LaboratoryDetailsForm } from "@/components/form/courses/Update&Demo/LaboratoryDetailsForm.tsx"
import { AddItem } from "@/components/general/AddItem.tsx"
import scrollTo from "@/utils/scroll.ts"
import GeneralInputContainer from "@/components/form/general/GeneralInputContainer.tsx"
import { INPUT_MAX_WIDTH } from "@notas-universitarias/types"
import { RadioButton } from "@/components/form/tanstack-fields/Radio/RadioButton.tsx"

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
		totalLabDetailBreakdownPercentage,
		submissionAttempts
	} = useFormDataForCreation(form)
	return (
		<AppForm>
			<form
				onSubmit={async (e) => {
					e.preventDefault()
					e.stopPropagation()
					await form.handleSubmit()
				}}
				className={`flex flex-col p-4 w-[90%] gap-2 ${isRegistered ? "h-fit" : "h-[80%]"} transition-all duration-300 ease-in-out`}
			>
				{data.content.length !== 0 && (
					<AppField
						name={"isRegistered"}
						children={(field) => {
							return (
								<GeneralInputContainer
									labelText={"¿Ya diste la materia anteriormente?"}
									maxWidth={INPUT_MAX_WIDTH}
									isBlurred={
										field.state.meta.isBlurred || submissionAttempts > 0
									}
									input={
										<div className={"flex flex-col gap-2"}>
											<RadioButton
												type={"boolean"}
												value={"1"}
												radioGroupName={field.name}
												labelText={"Sí"}
											/>
											<RadioButton
												type={"boolean"}
												value={"0"}
												radioGroupName={field.name}
												labelText={"No"}
											/>
										</div>
									}
								/>
							)
						}}
					/>
				)}
				{isRegistered ? (
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
								selectedItem={data.content[0].name}
								iterableItems={data.content}
								label={"¿Cómo se llama la materia?"}
							/>
						)}
					/>
				)}
				<AppField
					name={"profesorName"}
					children={(field) => (
						<field.TextField
							label={"¿Cómo se llama tu profesor?"}
							placeholder={"Lord Voldemort"}
						/>
					)}
				/>
				{breakdownList.length > 0 && (
					<h2 className={"text-xl mt-4"}>Evaluación del curso</h2>
				)}
				<AppField name={"breakdown"} mode={"array"}>
					{(field) => (
						<div className={"flex flex-col gap-8"}>
							{field.state.value.map((breakdown, i) => {
								return (
									<div key={`breakdown[${i}]-ctn`}>
										<BreakdownSharedContent
											form={form}
											fields={`breakdown[${i}]`}
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
												labTotalPercentage={totalLabDetailBreakdownPercentage}
												mode={"create"}
												isForDemo={false}
												totalPercentage={totalBreakdownPercentage}
											/>
										)}
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
											type: "STANDALONE"
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
