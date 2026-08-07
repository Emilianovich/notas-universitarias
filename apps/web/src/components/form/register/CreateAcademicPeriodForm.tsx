import { createAcademicPeriodsDTO } from "@notas-universitarias/types"
import {revalidateLogic, useForm, useSelector} from "@tanstack/react-form"
import Input from "@/components/form/Input.tsx"
import Button from "@/components/general/Button.tsx"
import useToast from "@/contexts/toast.ts"
import type { RegisterFormProps } from "@/types/input.ts"
import {Link} from "@tanstack/react-router";

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
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "blur"
		}),
		validators: {
			onDynamic: createAcademicPeriodsDTO,
			onBlur: createAcademicPeriodsDTO
		},
		onSubmit: ({ value }) => {
			setGlobalFormState({
				...registerState,
				firstFormContent: value,
				isFirstDone: true,
				progress: 50
			})
		},
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: `No todos los valores ingresados son válidos. Intenta nuevamente`
			})
		},
		canSubmitWhenInvalid: false
	})
	const { Field  } = form
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
				name={"name"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							key={name}
							id={name}
							label={"Nombre de tu periodo académico actual"}
							type={"text"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isBlurred={isBlurred || submissionAttempts > 0}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"Semestre I 2026"}
						/>
					)
				}}
			/>
			<Field
				name={"startDate"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
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
							isBlurred={isBlurred || submissionAttempts > 0}
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
					const { errors, isBlurred } = fieldApi.state.meta
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
							isBlurred={isBlurred || submissionAttempts > 0}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"2026/07/17"}
						/>
					)
				}}
			/>
			<div
				className={
					"flex flex-col gap-4 justify-center items-center w-full h-fit absolute top-[80%]"
				}
			>
				<p>¿Ya tienes cuenta? <Link to={"/login"}><strong className={"cursor-pointer font-medium hover:scale-105 hover:text-primary-400 transition-all duration-300 ease-in-out underline"}>Inicia sesión</strong></Link></p>
				<Button
					text={"Guardar & Seguir"}
					type={"submit"}
					styleType={"primary"}
					isDisabled={false}
				/>
			</div>
		</form>
	)
}
