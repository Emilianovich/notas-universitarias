import { useForm, useSelector } from "@tanstack/react-form"
import { z } from "zod"
import Input from "@/components/form/Input.tsx"
import Button from "@/components/general/Button.tsx"
import useToast from "@/contexts/toast.ts"
import type { RegisterFormProps } from "@/types/input.ts"
import { useNavigate } from "@tanstack/react-router";
import type {createUserDto} from "@notas-universitarias/types";
import {buildRequest, ServerErrorRes} from "@notas-universitarias/helpers";
import {useMutation} from "@tanstack/react-query";

const userCredentialsSchema = z.object({
	username: z
		.string()
		.min(1, "Tu apodo debería tener por lo menos un caracter")
		.max(100, "Tu apodo debería tener entre 1 a 100 caracteres"),
	email: z
		.email({
			pattern:
				/^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/,
			error: "Ingrese un correo electrónico válido"
		})
		.transform((val) => val.toLowerCase()),
	password: z.string().min(1, "Su contraseña debe tener al menos un caracter")
})

const registerUser = async (payload : z.infer<typeof createUserDto>)=> {
	return buildRequest<string, string>({ method: "POST", reqBody: payload, path: "/users", includeCredentials: false })
}

export default function UserCredentialsForm({
	setGlobalFormState,
	registerState
}: RegisterFormProps) {
	const { username, email, password } = registerState.secondFormContent
	const { buildToast } = useToast()
	const navigate = useNavigate({ from: "/register" })
	const mutation = useMutation({
		mutationFn: registerUser,
		onSuccess: async (data) => {
			await navigate({ to: "/home/current-period" })
			buildToast({
				id: Date.now(),
				type: "success",
				content: data.content
			})
		},
		onError: error => {
			if (error instanceof ServerErrorRes) {
				buildToast({
					id: Date.now(),
					type: "error",
					content: `${error.errors}`
				})
			}
		}
	})
	const { mutate, isPending } = mutation
	const form = useForm({
		defaultValues: {
			username,
			email,
			password
		},
		validators: {
			onBlur: userCredentialsSchema
		},
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: "Tus datos no cumplen con el formato solicitado"
			})
		},
		onSubmit: async ({ value }) => {
			const { name, endDate, startDate } = registerState.firstFormContent
			const { username, email, password } = value
			const payload : z.infer<typeof createUserDto> =  {
				username,
				email,
				password,
				name,
				endDate,
				startDate,
			}
			setGlobalFormState({ ...registerState, progress: 100 })
			mutate(payload)
		}
	})
	const { Field  } = form
	const currentUsername = useSelector(
		form.store,
		(state) => state.values.username
	)
	const currentEmail = useSelector(form.store, (state) => state.values.email)
	const currentPassword = useSelector(
		form.store,
		(state) => state.values.password
	)
	const submissionAttempts = useSelector(form.store, (state) => state.submissionAttempts)
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				e.stopPropagation()
				await form.handleSubmit()
			}}
			className={"grid grid-rows-4 gap-2 justify-center items-center relative"}
		>
			<Field
				name={"username"}
				children={(fieldApi) => {
					const { errors, isBlurred} = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							id={name}
							label={"¿Cómo te llaman?"}
							type={"text"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isBlurred={isBlurred || submissionAttempts > 0}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"Ej. Eminola"}
						/>
					)
				}}
			/>
			<Field
				name={"email"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							id={name}
							label={"¿Cuál es tu correo?"}
							type={"email"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isBlurred={isBlurred || submissionAttempts > 0}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"Ej. eminola@correo.com"}
						/>
					)
				}}
			/>
			<Field
				name={"password"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							id={name}
							label={"¿Cuál es tu contraseña?"}
							type={"password"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isBlurred={isBlurred || submissionAttempts > 0}
							color={"#F9FCFC"}
							originallyPassword={true}
							placeholder={"********"}
						/>
					)
				}}
			/>
				<div
					className={
						"flex justify-center items-center gap-4 w-full h-fit absolute top-[75%]"
					}
				>
					<Button
						text={"Volver atrás"}
						type={"button"}
						styleType={"primary"}
						isDisabled={false}
						clickAction={() =>
							setGlobalFormState({
								...registerState,
								isFirstDone: false,
								progress: 2,
								secondFormContent: {
									username: currentUsername,
									email: currentEmail,
									password: currentPassword
								}
							})
						}
					/>
					<Button
						text={"Registrarme"}
						type={"submit"}
						styleType={"primary"}
						isDisabled={isPending}
					/>
				</div>
		</form>
	)
}
