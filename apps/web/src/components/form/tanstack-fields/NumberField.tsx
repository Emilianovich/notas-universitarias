import GeneralInput, {
	type TanstackFieldTextInputProps
} from "@/components/form/tanstack-fields/GeneralInput.tsx"

export default function NumberField({
	label,
	inputId,
	placeholder
}: Omit<TanstackFieldTextInputProps, "isPassword" | "type">) {
	return (
		<GeneralInput
			label={label}
			inputId={inputId}
			type="number"
			isPassword={false}
			placeholder={placeholder}
		/>
	)
}
