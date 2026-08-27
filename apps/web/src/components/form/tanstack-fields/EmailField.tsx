import GeneralInput, {
	type TanstackFieldTextInputProps
} from "@/components/form/tanstack-fields/GeneralInput.tsx"

export default function EmailField({
	label,
	inputId,
	placeholder
}: Omit<TanstackFieldTextInputProps, "isPassword" | "type">) {
	return (
		<GeneralInput
			label={label}
			inputId={inputId}
			type="email"
			isPassword={false}
			placeholder={placeholder}
		/>
	)
}
