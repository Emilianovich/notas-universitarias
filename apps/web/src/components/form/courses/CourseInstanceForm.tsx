import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import type { UpdateCourseInstanceDto } from "@notas-universitarias/types"
import { useSelector } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useRef } from "react"
import { useEditCourseInstanceOpts } from "@/components/form/courses/hooks/useEditCourseInstanceOpts.ts"
import { BreakdownForm } from "@/components/form/courses/Update&Demo/BreakdownForm.tsx"
import Button from "@/components/general/Button.tsx"
import { ScrollToBottom } from "@/components/ui/ScrollToBottom.tsx"
import useToast from "@/contexts/toast.ts"
import usePercentagesForEdit from "@/lib/course-form.ts"
import { baseUrl } from "@/routes/__root.tsx"

const updateCourseInstance = async (
	dto: UpdateCourseInstanceDto,
	id: string
) => {
	return buildRequest<string, string>({
		baseUrl,
		method: "PUT",
		reqBody: dto,
		path: `/course-instances/${id}`,
		includeCredentials: true
	})
}

export type CourseInstanceFormProps =
	| {
			defaultValues: UpdateCourseInstanceDto
			isForDemo: false
			courseInstanceId: string
	  }
	| {
			defaultValues: UpdateCourseInstanceDto
			isForDemo: true
	  }

export default function CourseInstanceForm(props: CourseInstanceFormProps) {
	const { defaultValues, isForDemo } = props
	const { buildToast } = useToast()
	const navigate = useNavigate()
	const scrollToEnd = useRef<HTMLDivElement | null>(null)
	const mutation = useMutation({
		mutationFn: (dto: UpdateCourseInstanceDto) => {
			// NOTE has to be a cleaner way to do this
			if (isForDemo) return updateCourseInstance(dto, "")
			return updateCourseInstance(dto, props.courseInstanceId)
		},
		onSuccess: async (data) => {
			await navigate({ to: "/home/current-period" })
			buildToast({
				id: Date.now(),
				type: "success",
				content: data.content
			})
		},
		onError: (error) => {
			if (error instanceof ServerErrorRes) {
				buildToast({
					id: Date.now(),
					type: "error",
					content: error.errors
				})
			}
		}
	})
	const form = useEditCourseInstanceOpts({ defaultValues, isForDemo, mutation })
	const { AppForm, AppField } = form
	const { breakdownList, totalPercentage } = usePercentagesForEdit(form)
	const isDefaultValue = useSelector(
		form.store,
		(state) => state.isDefaultValue
	)
	return (
		<AppForm>
			<form
				onSubmit={async (e) => {
					e.preventDefault()
					e.stopPropagation()
					await form.handleSubmit()
				}}
				className="w-full flex flex-col gap-4 p-4"
			>
				{isForDemo ? (
					<h1 className={"mt-4 text-4xl font-bold text-center"}>Demo</h1>
				) : (
					<AppField
						name={"profesorName"}
						children={(field) => (
							<field.TextField
								label={"¿Cómo se llama tu profesor?"}
								placeholder={"Lord Voldemort"}
							/>
						)}
					/>
				)}
				{defaultValues.laboratory && (
					<>
						<span className={"text-primary-500 text-xl"}>Evaluación de Laboratorio</span>
						<AppField
							name={"laboratory.profesorName"}
							children={(field) => (
								<field.TextField
									label={"¿Cuál es el nombre de tu profesor de laboratorio?"}
									placeholder={"Albus Dumbledore"}
								/>
							)}
						/>
						<AppField
							name={"laboratory.percentage"}
							children={(field) => (
								<field.NumberField
									label={"¿Cuánto es el porcentaje de laboratorio?"}
									placeholder={""}
								/>
							)}
						/>
						<BreakdownForm
							form={form}
							isForDemo={isForDemo}
							totalPercentage={totalPercentage}
							isLaboratory={true}
						/>
					</>
				)}
				{breakdownList.length > 0 && (
					<h2 className={"text-xl mt-4 text-primary-500"}>Evaluación del curso</h2>
				)}
				<BreakdownForm
					form={form}
					isForDemo={isForDemo}
					totalPercentage={totalPercentage}
					isLaboratory={false}
				/>
				{totalPercentage === 100 && (
					<div className="w-full flex justify-center items-center">
						<Button
							text={isForDemo ? "Calcular nota final" : "Guardar cambios"}
							type={"submit"}
							styleType={"primary"}
							isDisabled={isDefaultValue}
						/>
					</div>
				)}
				<ScrollToBottom ref={scrollToEnd} />
				<div ref={scrollToEnd}></div>
			</form>
		</AppForm>
	)
}
