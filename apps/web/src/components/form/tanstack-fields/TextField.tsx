import GeneralInput, {
	type TanstackFieldTextInputProps
} from "@/components/form/tanstack-fields/GeneralInput.tsx"

export default function TextField({
	label,
	inputId,
	placeholder
}: Omit<TanstackFieldTextInputProps, "isPassword" | "type">) {
	return (
		<GeneralInput
			label={label}
			inputId={inputId}
			isPassword={false}
			type={"text"}
			placeholder={placeholder}
		/>
	)
}
