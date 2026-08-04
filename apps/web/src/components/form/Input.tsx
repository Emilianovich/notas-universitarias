import { useState } from "react"
import useSettings from "@/contexts/settings.ts"
import type { InputProps, PasswordImageProps } from "@/types/input.ts"

export default function Input({
	name,
	type,
	error,
	syncValueToState,
	value,
	handleBlur,
	isDirty,
	color,
	label,
	id,
	originallyPassword,
	placeholder
}: InputProps<string>) {
	const [currentInputType, setCurrentInputType] = useState<
		"text" | "password" | "email" | "date"
	>(type)
	const bgColor = `bg-[${color}]`
	const borderColor = error ? "border-red-400" : "border-primary-300"
	const { fontFamily } = useSettings()
	return (
		<div className={`grid grid-rows-3 gap-2 relative`}>
			<label
				style={{ fontFamily, fontSize: 18, marginTop: "1em" }}
				htmlFor={id}
			>
				{label}
			</label>
			<div className={"relative"}>
				<input
					id={id}
					style={{ fontFamily }}
					name={name}
					type={currentInputType}
					onChange={syncValueToState}
					onBlur={handleBlur}
					value={value}
					className={`${bgColor} p-2 w-87.5 h-11.25 rounded-[10px] border outline-none ${borderColor}`}
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
			{error && isDirty && <ErrorMessage error={error} />}
		</div>
	)
}

function ErrorMessage({ error }: { error: string }) {
	const { fontFamily } = useSettings()
	return (
		<span style={{ fontFamily }} className={"text-red-400"}>
			{error}
		</span>
	)
}

function PasswordImage({ isOpen, changeType }: PasswordImageProps) {
	const imageSrc = isOpen ? "/eye-open.svg" : "/eye-closed.svg"
	const alt = isOpen
		? "Eye opened for visible password"
		: "Eye closed for not visible password"
	return (
		<img
			src={imageSrc}
			alt={alt}
			className={
				"w-7.5 h-6 absolute right-2 top-1/2 -translate-y-1/2 hover:scale-95 cursor-pointer"
			}
			onClick={changeType}
		/>
	)
}
