import { ServerErrorRes } from "@notas-universitarias/helpers"
import {
	type LoginDTO,
	loginDTO,
	ON_SUBMIT_INVALID_MSG
} from "@notas-universitarias/types"
import { createFormHook } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate, useRouter } from "@tanstack/react-router"
import EmailField from "@/components/form/tanstack-fields/EmailField.tsx"
import PasswordField from "@/components/form/tanstack-fields/PasswordField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import useToast from "@/contexts/toast.ts"
import { fieldContext, formContext } from "@/hooks/form.ts"
import { queryClient } from "@/routes/__root.tsx"
import handleLogin from "@/routes/login.tsx"

export type Redirected = {
	wasRedirected?: "true"
}

const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		EmailField,
		PasswordField
	},
	formComponents: {}
})

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
		onSuccess: async (result) => {
			queryClient.clear()
			await navigate({ to: "/home/current-period" })
			const { content } = result
			buildToast({
				id: Date.now(),
				type: "success",
				content
			})
		}
	})
	const { mutate } = mutation
	const form = useAppForm({
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
					"relative grid grid-rows-3 box-border p-15 w-125 items-center justify-center bg-tertiary rounded-[10px] shadow-[0px_4px_10px_2px_rgba(0,0,0,0.25)]"
				}
			>
				<h1 className={"text-2xl mb-8 text-center"}>Bienvenido de vuelta</h1>

				<AppField
					name={"email"}
					children={(field) => (
						<field.EmailField
							label={"¿Cuál es tu correo?"}
							placeholder={"eminola@correo.com"}
						/>
					)}
				/>
				<AppField
					name={"password"}
					children={(field) => (
						<field.PasswordField
							label={"¿Cuál es tu contraseña?"}

						/>
					)}
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
					<SubmitBtn text={"Iniciar sesión"} />
				</div>
			</form>
		</AppForm>
	)
}
