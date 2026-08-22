export type ButtonProps = {
	text: string
	type: "button" | "submit" | "reset"
	styleType: "primary" | "secondary" | "modal-primary"
	clickAction?: () => Promise<void> | void
	isDisabled: boolean
}

function Button({
	text,
	type,
	styleType,
	clickAction,
	isDisabled
}: ButtonProps) {
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
			disabled={isDisabled}
			className={`flex justify-center items-center rounded-[10px] sm:text-sm sm:w-45 xl:text-[16px] xl:w-50  border-2 ${styles} h-button-height p-1 ${isDisabled ? "cursor-not-allowed" : "hover:scale-105 cursor-pointer"}  transition-all duration-300 ease-in-out`}
		>
			{text}
		</button>
	)
}

export default Button
