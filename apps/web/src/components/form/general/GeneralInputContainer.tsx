import type { ReactNode } from "react"
import ErrorMessage from "@/components/form/general/ErrorMessage.tsx"

export type GeneralInputContainerProps = {
	labelText: string
	inputId: string
	maxWidth: number
	error?: string
	isBlurred: boolean
	input: ReactNode
}

export default function GeneralInputContainer({
	labelText,
	inputId,
	isBlurred,
	error,
	maxWidth,
	input
}: GeneralInputContainerProps) {
	return (
		<div className={`grid grid-rows-3 gap-4 relative`} style={{ maxWidth }}>
			<label style={{ fontSize: 18, marginTop: "1em" }} htmlFor={inputId}>
				{labelText}
			</label>
			{input}
			{error && isBlurred && <ErrorMessage error={error} />}
		</div>
	)
}
