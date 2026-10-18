import type { ReactNode } from "react"
import ErrorMessage from "@/components/form/general/ErrorMessage.tsx"

export type GeneralInputContainerProps = {
	labelText: string
	maxWidth: number
	error?: string
	isBlurred: boolean
	input: ReactNode
}

export default function GeneralInputContainer({
	labelText,
	isBlurred,
	error,
	maxWidth,
	input
}: GeneralInputContainerProps) {
	return (
		<div
			className={`grid gap-4 relative`}
			style={{
				maxWidth,
				gridTemplateRows: `${error && isBlurred ? "1fr 20px" : "1fr"}`
			}}
		>
			{/** biome-ignore lint/a11y/noLabelWithoutControl: <The ReactNode expected is an input> */}
			<label
				style={{ fontSize: 18, marginTop: "1em" }}
				className={"flex flex-col gap-2"}
			>
				<span className={"text-primary-500"}>{labelText}</span>
				{input}
			</label>
			{error && isBlurred && <ErrorMessage error={error} />}
		</div>
	)
}
