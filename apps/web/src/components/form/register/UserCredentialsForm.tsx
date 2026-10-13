import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import {
	type AfterRegisterRes,
	createUserDto,
	ON_SUBMIT_INVALID_MSG
} from "@notas-universitarias/types"
import { createFormHook } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import type { z } from "zod"
import EmailField from "@/components/form/tanstack-fields/EmailField.tsx"
import PasswordField from "@/components/form/tanstack-fields/PasswordField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import useToast from "@/contexts/toast.ts"
import { fieldContext, formContext } from "@/hooks/form.ts"
import { baseUrl } from "@/routes/__root.tsx"
import type { RegisterFormProps } from "@/types/input.ts"

const registerUser = async (payload: z.infer<typeof createUserDto>) => {
	return buildRequest<AfterRegisterRes, string>({
		baseUrl,
		method: "POST",
		reqBody: payload,
		path: "/auth/register",
		includeCredentials: true
	})
}

const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		EmailField,
		PasswordField,
		TextField
	},
	formComponents: {}
})

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
	const { mutate } = mutation
	const form = useAppForm({
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
					"grid grid-rows-[auto_auto_auto_50px_1fr] gap-8 justify-center items-center relative"
				}
			>
				<AppField
					name={"username"}
					children={(field) => (
						<field.TextField
							placeholder={"Ej. Eminola"}
							label={"¿Cómo te llaman?"}
						/>
					)}
				/>
				<AppField
					name={"email"}
					children={(field) => (
						<field.EmailField
							label={"¿Cuál es tu correo?"}
							placeholder={"Ej. eminola@correo.com"}
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
						"flex flex-col gap-4 justify-center items-center w-full h-fit"
					}
				>
					<p className={"text-primary-700"}>
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
				<div
					className={
						"flex flex-col justify-center items-center gap-4 w-full h-fit"
					}
				>
					<SubmitBtn text={"Crear usuario"} />
				</div>
			</form>
		</AppForm>
	)
}
