import { useSelector } from "@tanstack/react-form"
import type { ChangeEvent } from "react"
import GeneralInputContainer from "@/components/form/general/GeneralInputContainer.tsx"
import { useFieldContext, useFormContext } from "@/hooks/form.ts"

type SelectFieldProps<T> = {
	items: T[]
	labelText: string
} & OptionFunctions<T>

export type OptionFunctions<T> = {
	setOptionsValues: (item: T) => string
	setOptionKeys: (item: T) => string
	setOptionsText: (item: T) => string
}

export default function SelectField<T>({
	items,
	labelText,
	setOptionsValues,
	setOptionKeys,
	setOptionsText
}: SelectFieldProps<T>) {
	const field = useFieldContext<string | undefined>()
	const form = useFormContext()
	const { value } = field.state
	const { errors, isBlurred } = field.state.meta
	const { name, handleBlur, handleChange } = field
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	const errorMessage = errors[0]?.message as string
	const borderColor =
		errorMessage && isBlurred ? "border border-red-400" : "transparent"
	const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
		handleChange(e.target.value)
	}
	return (
		<GeneralInputContainer
			labelText={labelText}
			maxWidth={400}
			isBlurred={isBlurred || submissionAttempts > 0}
			input={
				<div className={"w-fit h-fit relative"}>
					<select
						className={`bg-input text-primary-700 p-2 w-100 h-11.25 rounded-[10px] outline-none shadow-[0px_2px_4px_rgba(0,0,0,0.25)] ${borderColor}`}
						onBlur={handleBlur}
						onChange={onChange}
						name={name}
						value={value}
					>
						{items.map((item) => (
							<option key={setOptionKeys(item)} value={setOptionsValues(item)}>
								{setOptionsText(item)}
							</option>
						))}
					</select>
				</div>
			}
			error={errorMessage}
		/>
	)
}
