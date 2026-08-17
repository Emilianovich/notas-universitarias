import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import {
	createAcademicPeriodsDTO,
	type DataAfterRegister
} from "@notas-universitarias/types"
import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import Input from "@/components/form/general/Input.tsx"
import Button from "@/components/general/Button.tsx"
import useToast from "@/contexts/toast.ts"
import type { RegisterFormProps } from "@/types/input.ts"

const handleRegisterAftermath = async (payload: DataAfterRegister) => {
	return buildRequest<string, string>({
		method: "POST",
		reqBody: payload,
		path: "/auth/register-after-creation",
		includeCredentials: true
	})
}

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
	const form = useForm({
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
				content: `Asegúrate llenar todos los campos y cumplir con todas las validaciones`
			})
		}
	})
	const { Field } = form
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				e.stopPropagation()
				await form.handleSubmit()
			}}
			className={
				"grid grid-rows-[auto_auto_auto_1fr] gap-2 justify-center items-center relative"
			}
		>
			<Field
				name={"name"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							key={name}
							id={name}
							label={"Nombre de tu periodo académico actual"}
							type={"text"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isBlurred={isBlurred || submissionAttempts > 0}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"Semestre I 2026"}
						/>
					)
				}}
			/>
			<Field
				name={"startDate"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							key={name}
							id={name}
							label={"Fecha de inicio de tu periodo académico actual"}
							type={"date"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isBlurred={isBlurred || submissionAttempts > 0}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"2026/04/24"}
						/>
					)
				}}
			/>
			<Field
				name={"endDate"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							key={name}
							id={name}
							label={"Fecha final de tu periodo académico actual"}
							type={"date"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isBlurred={isBlurred || submissionAttempts > 0}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"2026/07/17"}
						/>
					)
				}}
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
				<Button
					text={"Guardar periodo académico"}
					type={"submit"}
					styleType={"primary"}
					isDisabled={false}
				/>
			</div>
		</form>
	)
}
