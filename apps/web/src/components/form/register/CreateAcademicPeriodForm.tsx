import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import {
	createAcademicPeriodsDTO,
	type DataAfterRegister,
	ON_SUBMIT_INVALID_MSG
} from "@notas-universitarias/types"
import { createFormHook } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { SharedAcademicPeriodForm } from "@/components/form/academic-periods/SharedAcademicPeriodForm.tsx"
import DateField from "@/components/form/tanstack-fields/DateField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import Button from "@/components/general/Button.tsx"
import useToast from "@/contexts/toast.ts"
import { fieldContext, formContext } from "@/hooks/form.ts"
import { baseUrl } from "@/routes/__root.tsx"
import type { RegisterFormProps } from "@/types/input.ts"

const handleRegisterAftermath = async (payload: DataAfterRegister) => {
	return buildRequest<string, string>({
		baseUrl,
		method: "POST",
		reqBody: payload,
		path: "/auth/register-after-creation",
		includeCredentials: true
	})
}

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		DateField
	},
	formComponents: { SubmitBtn }
})

export default function CreateAcademicPeriodForm({
	registerState,
	setGlobalFormState
}: RegisterFormProps) {
	const { buildToast } = useToast()
	const navigate = useNavigate({ from: "/register" })
	const mutation = useMutation({
		mutationFn: handleRegisterAftermath,
		onSuccess: async () => {
			setGlobalFormState({ ...registerState, isFirstDone: true, progress: 99 })
			buildToast({
				id: Date.now(),
				type: "info",
				content: "Redirigiéndote al login..."
			})
			setTimeout(async () => {
				await navigate({ to: "/login" })
			}, 1500)
		},
		onError: (error) => {
			if (error instanceof ServerErrorRes) {
				buildToast({
					id: Date.now(),
					type: "error",
					content: `${error.errors}`
				})
			}
		}
	})
	const { mutate } = mutation
	const form = useAppForm({
		defaultValues: {
			name: "",
			startDate: "",
			endDate: ""
		},
		validators: {
			onDynamic: createAcademicPeriodsDTO,
			onBlur: createAcademicPeriodsDTO
		},
		onSubmit: ({ value }) => {
			const data: DataAfterRegister = {
				settings: registerState.afterRegisterData.settings,
				academicPeriod: value
			}
			mutate(data)
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
					"bg-form-bg grid grid-rows-[auto_auto_auto_1fr] gap-10 justify-center items-center relative"
				}
			>
				<SharedAcademicPeriodForm
					form={form}
					fields={{
						name: "name",
						startDate: "startDate",
						endDate: "endDate"
					}}
					textFieldLabel={"Nombre de tu periodo académico actual"}
					startDateLabel={"Fecha de inicio de tu periodo académico actual"}
					endDateLabel={"Fecha de inicio de tu periodo académico actual"}
				/>
				<div className={"w-full flex justify-between justify-self-center"}>
					<Button
						text={"Hacer más tarde"}
						type={"button"}
						styleType={"secondary"}
						isDisabled={false}
						clickAction={async () => {
							if (registerState.afterRegisterData.settings) {
								const data: DataAfterRegister = {
									settings: registerState.afterRegisterData.settings
								}
								mutate(data)
							} else {
								setGlobalFormState({ ...registerState, progress: 99 })
								buildToast({
									id: Date.now(),
									type: "info",
									content: "Redirigiéndote al login..."
								})
								setTimeout(async () => {
									await navigate({ to: "/login" })
								}, 1500)
							}
						}}
					/>
					<SubmitBtn text={"Guardar información"} />
				</div>
			</form>
		</AppForm>
	)
}
