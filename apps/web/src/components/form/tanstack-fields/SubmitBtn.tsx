import { useSelector } from "@tanstack/react-form"
import Button from "@/components/general/Button.tsx"
import { useFormContext } from "@/hooks/form.ts"

type SubmitBtnProps = {
	text: string
}

export default function SubmitBtn({ text }: SubmitBtnProps) {
	const form = useFormContext()
	const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)
	return (
		<Button
			text={text}
			type={"submit"}
			styleType={"primary"}
			isDisabled={isSubmitting}
		/>
	)
}
