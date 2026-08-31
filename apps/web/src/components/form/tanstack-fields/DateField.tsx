import GeneralInput, {
	type TanstackFieldTextInputProps
} from "@/components/form/tanstack-fields/GeneralInput.tsx"

export default function DateField({
	label,
	inputId,
	placeholder
}: Omit<TanstackFieldTextInputProps, "isPassword" | "type">) {
	return (
		<GeneralInput
			label={label}
			inputId={inputId}
			type="date"
			isPassword={false}
			placeholder={placeholder}
		/>
	)
}
