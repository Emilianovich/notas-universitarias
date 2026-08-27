import GeneralInput, {
	type TanstackFieldTextInputProps
} from "@/components/form/tanstack-fields/GeneralInput.tsx"

export default function PasswordField({
	label,
	inputId
}: Omit<TanstackFieldTextInputProps, "isPassword" | "type" | "placeholder">) {
	return (
		<GeneralInput
			type="password"
			isPassword={true}
			label={label}
			inputId={inputId}
			placeholder={"***********"}
		/>
	)
}
