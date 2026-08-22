import { ServerErrorRes } from "@notas-universitarias/helpers"
import {
	type LoginDTO,
	loginDTO,
	ON_SUBMIT_INVALID_MSG
} from "@notas-universitarias/types"
import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate, useRouter } from "@tanstack/react-router"
import Input from "@/components/form/general/Input.tsx"
import Button from "@/components/general/Button.tsx"
import useToast from "@/contexts/toast.ts"
import { queryClient } from "@/routes/__root.tsx"
import handleLogin from "@/routes/login.tsx"

export type Redirected = {
	wasRedirected?: "true"
}

export default function LoginForm({ wasRedirected }: Redirected) {
	const router = useRouter()
	const { buildToast } = useToast()
	// if (wasRedirected) {
	// 	buildToast({
	// 		id: Date.now(),
	// 		type: "error",
	// 		content: "No se pudo validar la sesión, vuelva a iniciar sesión"
	// 	})
	// }
	const navigate = useNavigate({ from: "/login" })
	const mutation = useMutation({
		mutationFn: handleLogin,
		onError: (error) => {
			if (error instanceof ServerErrorRes) {
				buildToast({
					id: Date.now(),
					type: "info",
					content: error.errors
				})
			}
		},
		onSuccess: async (data) => {
			queryClient.clear()
			await navigate({ to: "/home/current-period" })
			buildToast({
				id: Date.now(),
				type: "success",
				content: data.content
			})
		}
	})
	const { mutate, isPending } = mutation
	const form = useForm({
		defaultValues: {
			email: "",
			password: ""
		},
		validators: {
			onBlur: loginDTO
		},
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: ON_SUBMIT_INVALID_MSG
			})
		},
		onSubmit: (value) => {
			const { email, password } = value.value
			const dto: LoginDTO = {
				email,
				password
			}
			mutate(dto)
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
				"relative grid grid-rows-3 box-border p-15 w-125 items-center justify-center bg-tertiary rounded-[10px] shadow-[0px_4px_10px_2px_rgba(0,0,0,0.25)]"
			}
		>
			<h1 className={"text-2xl mb-8 text-center"}>Bienvenido de vuelta</h1>
			<Field
				name={"email"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							key={name}
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
							key={name}
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
					"flex flex-col gap-6 justify-center items-center w-full h-fit"
				}
			>
				<p>
					¿No tienes cuenta?{" "}
					<Link to={"/register"}>
						<strong
							className={
								"cursor-pointer font-medium hover:scale-105 hover:text-primary-400 transition-all duration-300 ease-in-out underline"
							}
						>
							Regístrate
						</strong>
					</Link>
				</p>
				<Button
					text={"Iniciar sesión"}
					type={"submit"}
					styleType={"primary"}
					isDisabled={isPending}
				/>
			</div>
		</form>
	)
}
