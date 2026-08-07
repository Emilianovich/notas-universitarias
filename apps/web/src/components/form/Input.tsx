import { useState } from "react"
import type { InputProps, PasswordImageProps } from "@/types/input.ts"

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
	id,
	originallyPassword,
	placeholder
}: InputProps<string>) {
	const [currentInputType, setCurrentInputType] = useState<
		"text" | "password" | "email" | "date"
	>(type)
	const bgColor = `bg-[${color}]`
	const borderColor =
		error && isBlurred ? "border border-red-400" : "transparent"
	const maxWidth = 400
	return (
		<div className={`grid grid-rows-3 gap-2 relative`} style={{ maxWidth }}>
			<label style={{ fontSize: 18, marginTop: "1em" }} htmlFor={id}>
				{label}
			</label>
			<div className={"relative"}>
				<input
					id={id}
					name={name}
					type={currentInputType}
					onChange={syncValueToState}
					onBlur={handleBlur}
					value={value}
					className={`${bgColor} p-2 w-[400px] h-11.25 rounded-[10px] outline-none ${borderColor} shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
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
			{error && isBlurred && <ErrorMessage error={error} />}
		</div>
	)
}

function ErrorMessage({ error }: { error: string }) {
	return <span className={"text-red-400"}>{error}</span>
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
				"w-7.5 h-6 absolute right-8 top-1/2 -translate-y-1/2 hover:scale-95 cursor-pointer"
			}
			onClick={changeType}
		/>
	)
}
