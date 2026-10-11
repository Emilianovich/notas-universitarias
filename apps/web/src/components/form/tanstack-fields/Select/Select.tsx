import type { ChangeEvent } from "react"
import { useFieldContext, useFormContext } from "@/hooks/form.ts"
import { useSelector } from "@tanstack/react-form"
import GeneralInputContainer from "@/components/form/general/GeneralInputContainer.tsx"

type SelectProps<T> = {
	items: T[]
	labelText: string
} & OptionFunctions<T>

export type OptionFunctions<T> = {
	setOptionsValues: (item: T) => string
	setOptionKeys: (item: T) => string
	setOptionsText: (item: T) => string
}

export default function Select<T>({
	items,
	labelText,
	setOptionsValues,
	setOptionKeys,
	setOptionsText
}: SelectProps<T>) {
	const field = useFieldContext<T>()
	const form = useFormContext()
	const { value } = field.state
	const { errors, isBlurred } = field.state.meta
	const { name, handleBlur, handleChange } = field
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	const borderColor =
		errors[0]?.message && isBlurred ? "border border-red-400" : "transparent"
	const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = items.find(
			(item) => setOptionsValues(item) === e.target.value
		)
		if (value) {
			handleChange(value)
		}
	}
	return (
		<GeneralInputContainer
			labelText={labelText}
			maxWidth={400}
			isBlurred={isBlurred || submissionAttempts > 0}
			input={
				<div className={"w-fit h-fit relative"}>
					<select
						className={`p-2 w-100 h-11.25 rounded-[10px] outline-none shadow-[0px_2px_4px_rgba(0,0,0,0.25)] ${borderColor}`}
						onBlur={handleBlur}
						onChange={onChange}
						name={name}
						value={String(value)}
					>
						{items.map((item) => (
							<option key={setOptionKeys(item)} value={setOptionsValues(item)}>
								{setOptionsText(item)}
							</option>
						))}
					</select>
				</div>
			}
			error={errors[0]?.message}
		/>
	)
}
