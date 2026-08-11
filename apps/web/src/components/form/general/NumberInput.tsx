import GeneralInputContainer from "@/components/form/general/GeneralInputContainer.tsx"
import type { InputProps } from "@/types/input.ts"

export default function NumberInput({
	name,
	error,
	syncValueToState,
	value,
	handleBlur,
	isBlurred,
	color,
	label,
	id,
	placeholder
}: Omit<InputProps<string>, "originallyPassword" | "type">) {
	const bgColor = `bg-[${color}]`
	const borderColor =
		error && isBlurred ? "border border-red-400" : "transparent"
	return (
		<GeneralInputContainer
			error={error}
			labelText={label}
			inputId={id}
			maxWidth={100}
			isBlurred={isBlurred}
			input={
				<input
					type={"number"}
					name={name}
					value={value}
					onChange={syncValueToState}
					onBlur={handleBlur}
					placeholder={placeholder}
					className={`${bgColor} p-2 w-[inherit] h-11.25 rounded-[10px] outline-none ${borderColor} shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
				/>
			}
		/>
	)
}
