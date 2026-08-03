export type ButtonProps = {
	text: string
	type: "button" | "submit" | "reset"
	styleType: "primary" | "secondary" | "modal-primary"
	clickAction: () => void
}

function Button({ text, type, styleType, clickAction }: ButtonProps) {
	const styles =
		styleType === "primary"
			? "bg-primary-300 text-tertiary"
			: styleType === "secondary"
				? "text-primary-500 border-primary-300"
				: "text-tertiary bg-red-400"
	return (
		<button
			type={type}
			onClick={clickAction}
			className={`flex justify-center items-center rounded-[10px] border-2 ${styles} w-40 h-button-height p-1 hover:scale-105 cursor-pointer transition-all duration-300 ease-in-out`}
		>
			{text}
		</button>
	)
}

export default Button
