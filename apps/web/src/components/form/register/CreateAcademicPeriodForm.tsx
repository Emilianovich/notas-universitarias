import { createAcademicPeriodsDTO } from "@notas-universitarias/types"
import { useForm, useSelector } from "@tanstack/react-form"
import Input from "@/components/form/Input.tsx"
import Button from "@/components/general/Button.tsx"
import useToast from "@/contexts/toast.ts"
import type { RegisterFormProps } from "@/types/input.ts"

export default function CreateAcademicPeriodForm({
	registerState,
	setGlobalFormState
}: RegisterFormProps) {
	const { name, startDate, endDate } = registerState.firstFormContent
	const { buildToast } = useToast()
	const form = useForm({
		defaultValues: {
			name,
			startDate,
			endDate
		},
		validators: {
			onBlur: createAcademicPeriodsDTO
		},
		onSubmit: ({ value }) => {
			setGlobalFormState({
				...registerState,
				firstFormContent: value,
				isFirstDone: true,
				progress: 50
			})
			buildToast({
				id: Date.now(),
				type: "info",
				content: `Completaste la primera parte del formulario`
			})
		},
		onSubmitInvalid: () => {
			console.log(Date.now())
			buildToast({
				id: Date.now(),
				type: "error",
				content: `No todos los valores ingresados son válidos. Intenta nuevamente`
			})
		},
		canSubmitWhenInvalid: false
	})
	const { Field, Subscribe } = form
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
				name={"startDate"}
				children={(fieldApi) => {
					const { errors, isDirty } = fieldApi.state.meta
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
							isDirty={isDirty}
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
					const { errors, isDirty } = fieldApi.state.meta
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
							isDirty={isDirty}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"2026/07/17"}
						/>
					)
				}}
			/>
			<Field
				name={"name"}
				children={(fieldApi) => {
					const { errors, isDirty } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							key={name}
							id={name}
							label={"Nombre del periodo académico"}
							type={"text"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isDirty={isDirty}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"Semestre I 2026"}
						/>
					)
				}}
			/>
			<Subscribe
				selector={(state) => [state.canSubmit, state.isTouched]}
				children={([canSubmit, isTouched]) => (
					<div
						className={
							"flex gap-4 justify-center items-center w-full h-fit absolute top-[75%] border border-black"
						}
					>
						<Button
							text={"Guardar & Seguir"}
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
