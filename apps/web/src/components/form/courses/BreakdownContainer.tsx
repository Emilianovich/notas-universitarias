import type { BreakdownCategory } from "@notas-universitarias/types"
import Input from "@/components/form/general/Input.tsx"
import NumberInput, {
	type NumberInputProps
} from "@/components/form/general/NumberInput.tsx"
import RadioInput, {
	type RadioInputProps
} from "@/components/form/general/RadioInput.tsx"
import type { InputProps } from "@/types/input.ts"

type BreakdownContainerProps = {
	value?: string
	percentage?: number
	category?: BreakdownCategory
	inputProps: Omit<InputProps<string>, "value">
	numberInputProps: Omit<NumberInputProps, "value">
	radioInputProps: Pick<RadioInputProps, "syncValueToState" | "handleBlur">
}

export default function BreakdownContainer({
	value,
	percentage,
	category,
	numberInputProps,
	inputProps,
	radioInputProps
}: BreakdownContainerProps) {
	let convertedPercentage = 0
	if (percentage) convertedPercentage = Number(percentage * 100)
	return (
		<div className={"flex flex-col gap-4 w-full justify-start"}>
			<Input value={value ?? ""} {...inputProps} />
			<NumberInput
				value={convertedPercentage.toString()}
				{...numberInputProps}
			/>
			<RadioInput
				radioGroupName={"category"}
				value={"NESTED"}
				radioId={"nested"}
				labelText={"Parte de teoría y laboratorio"}
				{...radioInputProps}
			/>
			<RadioInput
				radioGroupName={"category"}
				value={"NOT-NESTED"}
				radioId={"not-nested"}
				labelText={"Tiene subdivisiones"}
				{...radioInputProps}
			/>
			<RadioInput
				radioGroupName={"category"}
				value={"STANDALONE"}
				radioId={"standalone"}
				labelText={"Es un solo porcentaje"}
				{...radioInputProps}
			/>
		</div>
	)
}
