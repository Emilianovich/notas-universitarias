import { INPUT_MAX_WIDTH } from "@notas-universitarias/types"
import { useState } from "react"
import GeneralInputContainer from "@/components/form/general/GeneralInputContainer.tsx"
import type { InputProps, PasswordImageProps } from "@/types/input.ts"
import { Eye, EyeClosed } from "lucide-react"

export default function Input({
	name,
	type,
	error,
	syncValueToState,
	value,
	handleBlur,
	isBlurred,
	color,
	label,
	originallyPassword,
	placeholder
}: InputProps<string>) {
	const [currentInputType, setCurrentInputType] = useState<
		"text" | "password" | "email" | "date"
	>(type)
	const bgColor = `bg-[${color}]`
	const borderColor =
		error && isBlurred ? "border border-red-400" : "transparent"
	return (
		<GeneralInputContainer
			labelText={label}
			maxWidth={INPUT_MAX_WIDTH}
			isBlurred={isBlurred}
			input={
				<div className={"relative"}>
					<input
						name={name}
						type={currentInputType}
						onChange={syncValueToState}
						onBlur={handleBlur}
						value={value}
						className={`${bgColor} p-2 w-100 h-11.25 rounded-[10px] outline-none ${borderColor} shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
						placeholder={placeholder}
					/>
					{originallyPassword && (
						<PasswordImage
							isOpen={currentInputType === "text"}
							changeType={() =>
								setCurrentInputType(
									currentInputType === "text" ? "password" : "text"
								)
							}
						/>
					)}
				</div>
			}
			error={error}
		/>
	)
}

function PasswordImage({ isOpen, changeType }: PasswordImageProps) {
	const styles =
		"w-7.5 h-6 absolute right-8 top-1/2 -translate-y-1/2 hover:scale-95 cursor-pointer text-primary-300"
	return (
		<>
			{isOpen ? (
				<Eye className={styles} onClick={changeType} />
			) : (
				<EyeClosed className={styles} onClick={changeType} />
			)}
		</>
	)
}
