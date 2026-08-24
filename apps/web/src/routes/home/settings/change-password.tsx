import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import { ON_SUBMIT_INVALID_MSG } from "@notas-universitarias/types"
import {
	type ChangePasswordDto,
	changePasswordSchema
} from "@notas-universitarias/types/dtos"
import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import Input from "@/components/form/general/Input.tsx"
import Button from "@/components/general/Button.tsx"
import useToast from "@/contexts/toast.ts"
import { baseUrl } from "@/routes/__root.tsx"

export const Route = createFileRoute("/home/settings/change-password")({
	component: RouteComponent
})

const handlePasswordChange = async (dto: ChangePasswordDto) => {
	return buildRequest<string, string>({
		baseUrl,
		method: "PUT",
		path: "/auth/change-password",
		reqBody: dto,
		includeCredentials: true
	})
}

function RouteComponent() {
	const { buildToast } = useToast()
	const navigate = useNavigate({ from: "/home/settings/change-password" })
	const mutation = useMutation({
		mutationFn: handlePasswordChange,
		onError: (error) => {
			if (error instanceof ServerErrorRes) {
				buildToast({
					id: Date.now(),
					type: "info",
					content: error.errors
				})
			}
		},
		onSuccess: (data) => {
			buildToast({
				id: Date.now(),
				type: "success",
				content: data.content
			})
		}
	})
	const { mutate, isPending } = mutation
	const form = useForm({
		validators: {
			onBlur: changePasswordSchema
		},
		defaultValues: {
			password: "",
			confirmPassword: ""
		},
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: ON_SUBMIT_INVALID_MSG
			})
		},
		onSubmit: ({ value }) => {
			mutate(value)
		}
	})
	const { Field } = form
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	return (
		<main className={"w-full flex justify-center items-center"}>
			<form
				onSubmit={async (e) => {
					e.preventDefault()
					e.stopPropagation()
					await form.handleSubmit()
				}}
				className={
					"relative grid grid-rows-4 box-border p-4 w-125 items-center justify-center bg-tertiary rounded-[10px] shadow-[0px_4px_10px_2px_rgba(0,0,0,0.25)]"
				}
			>
				<h1 className={"text-2xl text-center"}>Cambio de contraseña</h1>
				<Field
					name={"password"}
					children={(fieldApi) => {
						const { errors, isBlurred } = fieldApi.state.meta
						const { name, handleBlur, state, handleChange } = fieldApi
						return (
							<Input
								key={name}
								id={name}
								label={"Tu nueva contraseña"}
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
				<Field
					name={"confirmPassword"}
					children={(fieldApi) => {
						const { errors, isBlurred } = fieldApi.state.meta
						const { name, handleBlur, state, handleChange } = fieldApi
						return (
							<Input
								key={name}
								id={name}
								label={"Confirma tu nueva contraseña"}
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
				<div className={"flex justify-center items-center gap-4 w-full h-fit"}>
					<Button
						text={"Cancelar"}
						type={"button"}
						styleType={"secondary"}
						isDisabled={false}
						clickAction={async () => await navigate({ to: "/home/settings" })}
					/>
					<Button
						text={"Cambiar contraseña"}
						type={"submit"}
						styleType={"primary"}
						isDisabled={isPending}
					/>
				</div>
			</form>
		</main>
	)
}
