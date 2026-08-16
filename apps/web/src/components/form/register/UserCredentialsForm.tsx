import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import {
	type AfterRegisterRes,
	createUserDto,
	ON_SUBMIT_INVALID_MSG
} from "@notas-universitarias/types"
import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import type { z } from "zod"
import Input from "@/components/form/general/Input.tsx"
import Button from "@/components/general/Button.tsx"
import useToast from "@/contexts/toast.ts"
import type { RegisterFormProps } from "@/types/input.ts"

const registerUser = async (payload: z.infer<typeof createUserDto>) => {
	return buildRequest<AfterRegisterRes, string>({
		method: "POST",
		reqBody: payload,
		path: "/auth/register",
		includeCredentials: true
	})
}

export default function UserCredentialsForm({
	setGlobalFormState,
	registerState
}: RegisterFormProps) {
	const { buildToast } = useToast()
	const mutation = useMutation({
		mutationFn: registerUser,
		onSuccess: async (data) => {
			setGlobalFormState({
				...registerState,
				isFirstDone: true,
				progress: 33,
				username: data.content.username
			})
			buildToast({
				id: Date.now(),
				type: "success",
				content: data.content.message
			})
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
	const { mutate, isPending } = mutation
	const form = useForm({
		defaultValues: {
			username: "",
			email: "",
			password: ""
		},
		validators: {
			onBlur: createUserDto
		},
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: ON_SUBMIT_INVALID_MSG
			})
		},
		onSubmit: async ({ value }) => {
			const { username, email, password } = value
			const payload: z.infer<typeof createUserDto> = {
				username,
				email,
				password
			}
			mutate(payload)
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
			className={"grid grid-rows-4 gap-2 justify-center items-center relative"}
		>
			<Field
				name={"username"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
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
					"flex flex-col justify-center items-center gap-4 w-full h-fit"
				}
			>
				<Button
					text={"Crear usuario"}
					type={"submit"}
					styleType={"primary"}
					isDisabled={isPending}
				/>
			</div>
			<div
				className={
					"flex flex-col gap-4 justify-center items-center w-full h-fit absolute top-[80%]"
				}
			>
				<p>
					¿Ya tienes cuenta?{" "}
					<Link to={"/login"}>
						<strong
							className={
								"cursor-pointer font-medium hover:scale-105 hover:text-primary-400 transition-all duration-300 ease-in-out underline"
							}
						>
							Inicia sesión
						</strong>
					</Link>
				</p>
			</div>
		</form>
	)
}
