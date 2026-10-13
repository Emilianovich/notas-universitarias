import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import {
	type CreateAcademicPeriodsDto,
	createAcademicPeriodsDTO,
	ON_SUBMIT_INVALID_MSG
} from "@notas-universitarias/types"
import { createFormHook, revalidateLogic } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import DateField from "@/components/form/tanstack-fields/DateField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import useToast from "@/contexts/toast.ts"
import { fieldContext, formContext } from "@/hooks/form.ts"
import { baseUrl } from "@/routes/__root.tsx"

const createNewAcademicPeriod = async (dto: CreateAcademicPeriodsDto) => {
	return buildRequest<string, string>({
		baseUrl,
		method: "POST",
		path: "/academic-periods",
		reqBody: dto,
		includeCredentials: true
	})
}

const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		DateField
	},
	formComponents: {}
})

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
	const { AppField, AppForm } = form
	return (
		<AppForm>
			<form
				onSubmit={async (e) => {
					e.preventDefault()
					e.stopPropagation()
					await form.handleSubmit()
				}}
				className={
					"grid grid-rows-[auto_auto_auto_70px] gap-2 justify-center items-center relative"
				}
			>
				<AppField
					name={"name"}
					children={(field) => (
						<field.TextField
							label={"Nombre del nuevo periodo académico"}
							placeholder={"Semestre I 2026"}
							inputId={field.name}
						/>
					)}
				/>
				<AppField
					name={"startDate"}
					children={(field) => (
						<field.DateField
							label={"Fecha de inicio del periodo académico"}
							inputId={field.name}
							placeholder={"2026/04/24"}
						/>
					)}
				/>
				<AppField
					name={"endDate"}
					children={(field) => (
						<field.DateField
							label={"Fecha final del periodo académico"}
							inputId={field.name}
							placeholder={"2026/07/17"}
						/>
					)}
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
