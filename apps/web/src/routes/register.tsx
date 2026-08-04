import { useForm } from "@tanstack/react-form"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import Input from "@/components/form/Input.tsx"

export const Route = createFileRoute("/register")({
	component: RouteComponent
})

const schema = z.object({
	username: z.string().min(10, "Text is too short"),
	age: z.number().gte(1)
})

function RouteComponent() {
	const form = useForm({
		defaultValues: {
			username: "",
			age: 0
		},
		validators: {
			onBlur: schema
		},
		onSubmit: ({ value }) => {
			console.log(value)
		}
	})
	const { Field } = form
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
			}}
			className={"w-screen h-screen flex flex-col items-center justify-center"}
		>
			<Field
				name={"username"}
				children={(fieldApi) => {
					const { errors, isDirty } = fieldApi.state.meta
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
							isDirty={isDirty}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"Ej. Eminola"}
						/>
					)
				}}
			/>
		</form>
	)
}
