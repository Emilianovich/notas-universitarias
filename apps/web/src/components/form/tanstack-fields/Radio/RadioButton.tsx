import { useFieldContext } from "@/hooks/form.ts"

export type RadioButtonProps<T> = {
	value: T
	radioGroupName: string
	labelText: string
}

export function RadioButton<T>({
	value,
	radioGroupName,
	labelText
}: RadioButtonProps<T>) {
	const field = useFieldContext<T>()
	const { handleBlur, handleChange } = field
	const { value: fieldValue } = field.state
	return (
		<label className={"flex gap-4 w-100"}>
			<input
				type={"radio"}
				value={String(value)}
				name={radioGroupName}
				onChange={() => handleChange(value)}
				onBlur={handleBlur}
				checked={value === fieldValue}
			/>
			<span className={"text-primary-600"}>{labelText}</span>
		</label>
	)
}
