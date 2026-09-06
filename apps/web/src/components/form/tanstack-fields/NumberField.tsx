import GeneralInput, {
	type TanstackFieldTextInputProps
} from "@/components/form/tanstack-fields/GeneralInput.tsx"

export default function NumberField({
	label,
	placeholder
}: Omit<TanstackFieldTextInputProps, "isPassword" | "type">) {
	return (
		<GeneralInput
			label={label}
			type="number"
			isPassword={false}
			placeholder={placeholder}
		/>
	)
}
