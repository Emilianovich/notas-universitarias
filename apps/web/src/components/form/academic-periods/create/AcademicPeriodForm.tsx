import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import {
	type CreateAcademicPeriodsDto,
	createAcademicPeriodsDTO,
	ON_SUBMIT_INVALID_MSG
} from "@notas-universitarias/types"
import { revalidateLogic } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import useToast from "@/contexts/toast.ts"
import { baseUrl } from "@/routes/__root.tsx"
import {useAppForm} from "@/components/form/register/CreateAcademicPeriodForm.tsx";
import {SharedAcademicPeriodForm} from "@/components/form/academic-periods/SharedAcademicPeriodForm.tsx";

const createNewAcademicPeriod = async (dto: CreateAcademicPeriodsDto) => {
	return buildRequest<string, string>({
		baseUrl,
		method: "POST",
		path: "/academic-periods",
		reqBody: dto,
		includeCredentials: true
	})
}


export default function AcademicPeriodForm() {
	const { buildToast } = useToast()
	const navigate = useNavigate()
	const mutation = useMutation({
		mutationFn: createNewAcademicPeriod,
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
			await navigate({ to: "/home/current-period" })
			buildToast({
				id: Date.now(),
				type: "success",
				content: data.content
			})
		}
	})
	const { mutate } = mutation
	const form = useAppForm({
		defaultValues: {
			name: "",
			startDate: "",
			endDate: ""
		},
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "blur"
		}),
		validators: {
			onDynamic: createAcademicPeriodsDTO,
			onBlur: createAcademicPeriodsDTO
		},
		onSubmit: ({ value }) => {
			const { name, endDate, startDate } = value
			mutate({
				name,
				startDate,
				endDate
			})
		},
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: ON_SUBMIT_INVALID_MSG
			})
		}
	})
	const { AppForm } = form
	return (
		<AppForm>
			<form
				onSubmit={async (e) => {
					e.preventDefault()
					e.stopPropagation()
					await form.handleSubmit()
				}}
				className={
					"grid grid-rows-[auto_auto_auto_70px] gap-10 justify-center items-center relative"
				}
			>
				<SharedAcademicPeriodForm
					form={form}
					fields={{
						name: "name",
						startDate: "startDate",
						endDate: "endDate"
					}}
					textFieldLabel={"Nombre del nuevo periodo académico"}
					startDateLabel={"Fecha de inicio del periodo académico"}
					endDateLabel={"Fecha final del periodo académico"}
				/>
				<div
					className={
						"flex flex-col gap-4 justify-center items-center w-full h-fit"
					}
				>
					<SubmitBtn text={"Registrar"} />
				</div>
			</form>
		</AppForm>
	)
}
