import GeneralInput, {
	type TanstackFieldTextInputProps
} from "@/components/form/tanstack-fields/GeneralInput.tsx"

export default function PasswordField({
	label,
}: Omit<TanstackFieldTextInputProps, "isPassword" | "type" | "placeholder">) {
	return (
		<GeneralInput
			type="password"
			isPassword={true}
			label={label}
			placeholder={"***********"}
		/>
	)
}
