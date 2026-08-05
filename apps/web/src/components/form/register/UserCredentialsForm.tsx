import { createUserDto } from "@notas-universitarias/types"
import { useForm, useSelector } from "@tanstack/react-form"
import { z } from "zod"
import Input from "@/components/form/Input.tsx"
import Button from "@/components/general/Button.tsx"
import useToast from "@/contexts/toast.ts"
import type { RegisterFormProps } from "@/types/input.ts"

export default function UserCredentialsForm({
	setGlobalFormState,
	registerState
}: RegisterFormProps) {
	const { username, email, password } = registerState.secondFormContent
	const { buildToast } = useToast()
	const form = useForm({
		defaultValues: {
			username,
			email,
			password
		},
		validators: {
			onBlur: z.object({
				username: createUserDto.shape.username,
				email: createUserDto.shape.email,
				password: createUserDto.shape.password
			})
		},
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: "Tus datos no cumplen con el formato solicitado"
			})
		},
		onSubmit: async () => {
			setGlobalFormState({ ...registerState, progress: 100 })
		}
	})
	const { Field, Subscribe } = form
	const currentUsername = useSelector(
		form.store,
		(state) => state.values.username
	)
	const currentEmail = useSelector(form.store, (state) => state.values.email)
	const currentPassword = useSelector(
		form.store,
		(state) => state.values.password
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
					const { errors, isDirty } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							key={name}
							id={name}
							label={"¿Cómo te llaman?"}
							type={"text"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isDirty={isDirty}
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
					const { errors, isDirty } = fieldApi.state.meta
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
							isDirty={isDirty}
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
					const { errors, isDirty } = fieldApi.state.meta
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
							isDirty={isDirty}
							color={"#F9FCFC"}
							originallyPassword={true}
							placeholder={"********"}
						/>
					)
				}}
			/>
			<Subscribe
				selector={(state) => [state.canSubmit, state.isTouched]}
				children={([canSubmit, isTouched]) => (
					<div
						className={
							"flex justify-center items-center gap-4 w-full h-fit absolute top-[75%] border border-black"
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
							isDisabled={false}
						/>
					</div>
				)}
			/>
		</form>
	)
}
