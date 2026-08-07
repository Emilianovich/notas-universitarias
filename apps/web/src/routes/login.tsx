import { loginDTO } from "@notas-universitarias/types"
import { useForm } from "@tanstack/react-form"
import { createFileRoute } from "@tanstack/react-router"
import Input from "@/components/form/Input.tsx"

export const Route = createFileRoute("/login")({
	component: RouteComponent
})

function RouteComponent() {
	const loginForm = useForm({
		defaultValues: {
			email: "",
			password: ""
		},
		validators: {
			onBlur: loginDTO
		},
		onSubmit: (value) => {

		}
	})
	const { Field } = loginForm
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
			}}
			className={"w-screen h-fit grid grid-rows-3 items-center justify-center"}
		>
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
							isBlurred={isDirty}
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
							isBlurred={isDirty}
							color={"#F9FCFC"}
							originallyPassword={true}
							placeholder={"********"}
						/>
					)
				}}
			/>
		</form>
	)
}
