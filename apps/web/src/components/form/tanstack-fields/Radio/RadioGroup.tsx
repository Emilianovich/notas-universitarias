import { useSelector } from "@tanstack/react-form"
import ErrorMessage from "@/components/form/general/ErrorMessage.tsx"
import {
	RadioButton,
	type RadioButtonProps
} from "@/components/form/tanstack-fields/Radio/RadioButton.tsx"
import { useFieldContext, useFormContext } from "@/hooks/form.ts"

type RadioGroupProps<T> = {
	radios: RadioButtonProps<T>[]
	radioGroupName: string
}
export default function RadioGroup<T>({
	radios,
	radioGroupName
}: RadioGroupProps<T>) {
	const field = useFieldContext<T>()
	const form = useFormContext()
	const { errors, isBlurred } = field.state.meta
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	const errorMessage = errors[0]?.message as string
	const canDisplayError = errorMessage && (isBlurred || submissionAttempts > 0)
	return (
		<div
			className={`grid gap-4 w-full p-2 ${canDisplayError ? "border border-red-400" : ""}`}
			role="radiogroup"
			aria-labelledby={radioGroupName}
			style={{
				gridTemplateRows: `${canDisplayError && isBlurred ? "1fr 20px" : "1fr"}`
			}}
		>
			{radios.map((radio) => {
				return <RadioButton key={crypto.randomUUID()} {...radio} />
			})}
			{canDisplayError && <ErrorMessage error={errorMessage} />}
		</div>
	)
}
