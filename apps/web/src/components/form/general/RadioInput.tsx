import type { BreakdownCategory } from "@notas-universitarias/types"
import type { ChangeEvent } from "react"

export type RadioInputProps = {
	radioGroupName: string
	value: string
	radioId: string
	labelText: string
	syncValueToState: (e: ChangeEvent<HTMLInputElement>) => void
	handleBlur: () => void
	propsForDb?: RadioPropsForDb
	currentVal?: BreakdownCategory | string
}

type RadioPropsForDb =
	| {
			isPreviouslyChecked: true
			defaultValue: BreakdownCategory
	  }
	| {
			isPreviouslyChecked: false
			defaultValue: never
	  }

export default function RadioInput({
	radioGroupName,
	radioId,
	value,
	labelText,
	syncValueToState,
	handleBlur,
	currentVal
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
					checked={currentVal === value}
				/>
			</div>
			<label htmlFor={radioId} className={"text-primary-600"}>
				{labelText}
			</label>
		</div>
	)
}
