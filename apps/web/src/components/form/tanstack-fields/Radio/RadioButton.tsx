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
	const isChecked = value === fieldValue
	return (
		<label className={"flex justify-start items-center gap-4 w-100"}>
			<input
				type={"radio"}
				value={String(value)}
				name={radioGroupName}
				onChange={() => handleChange(value)}
				onBlur={handleBlur}
				checked={isChecked}
				className={`border ${isChecked ? "border-primary-400" : "border-primary-500"}`}
			/>
			<span className={"text-primary-600"}>{labelText}</span>
		</label>
	)
}
