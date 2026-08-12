import type { ChangeEvent } from "react"

type RadioInputProps = {
	radioGroupName: string
	value: string
	radioId: string
	labelText: string
	syncValueToState: (e: ChangeEvent<HTMLInputElement>) => void
	handleBlur: () => void
}

export default function RadioInput({
	radioGroupName,
	radioId,
	value,
	labelText,
	syncValueToState,
	handleBlur
}: RadioInputProps) {
	return (
		<div className={"grid grid-cols-[min-content_1fr] gap-4 w-100"}>
			<div className={"w-fit flex items-center justify-center"}>
				<input
					type={"radio"}
					value={value}
					name={radioGroupName}
					id={radioId}
					onChange={syncValueToState}
					onBlur={handleBlur}
				/>
			</div>
			<label htmlFor={radioId} className={"text-primary-600"}>
				{labelText}
			</label>
		</div>
	)
}
