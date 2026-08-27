import { useSelector } from "@tanstack/react-form"
import Input from "@/components/form/general/Input.tsx"
import NumberInput from "@/components/form/general/NumberInput.tsx"
import { useFieldContext, useFormContext } from "@/hooks/form.ts"

export type TanstackFieldTextInputProps = {
	label: string
	inputId: string
	isPassword: boolean
	type: "text" | "password" | "email" | "number"
	placeholder: string
}

export default function GeneralInput({
	label,
	inputId,
	type,
	isPassword,
	placeholder
}: TanstackFieldTextInputProps) {
	const field = useFieldContext<string | number>()
	const form = useFormContext()
	const { errors, isBlurred } = field.state.meta
	const { name, handleBlur, handleChange } = field
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	if (type !== "number") {
		return (
			<Input
				label={label}
				type={type}
				name={name}
				value={field.state.value as string}
				error={errors[0]?.message}
				syncValueToState={(e) => handleChange(e.currentTarget.value)}
				handleBlur={handleBlur}
				isBlurred={isBlurred || submissionAttempts > 0}
				color={"#F9FCFC"}
				id={inputId}
				originallyPassword={isPassword}
				placeholder={placeholder}
			/>
		)
	}
	return (
		<NumberInput
			label={label}
			name={name}
			value={field.state.value as string}
			error={errors[0]?.message}
			syncValueToState={(e) => handleChange(Number(e.currentTarget.value))}
			handleBlur={handleBlur}
			isBlurred={isBlurred || submissionAttempts > 0}
			color={"#F9FCFC"}
			id={inputId}
		/>
	)
}
