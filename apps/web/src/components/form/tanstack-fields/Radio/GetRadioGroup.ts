import { NOT_NESTED_LABEL, STANDALONE_LABEL } from "@notas-universitarias/types"
import type { RadioButtonProps } from "@/components/form/tanstack-fields/Radio/RadioButton.tsx"

type RadiosArrayType<T> = {
	labelText: string
	value: T
}[]
export const getRadioGroup = <T>(
	radioGroupName: string,
	radios: RadiosArrayType<T>
): RadioButtonProps<T>[] => {
	return radios.map((radio): RadioButtonProps<T> => {
		const { labelText, value } = radio
		return {
			radioGroupName,
			labelText,
			value
		}
	})
}

export const allowsMultiplesEntriesRadios: RadiosArrayType<boolean> = [
	{
		labelText: STANDALONE_LABEL,
		value: false
	},
	{
		labelText: NOT_NESTED_LABEL,
		value: true
	}
]

export const genericBooleanRadios: RadiosArrayType<boolean> = [
	{
		labelText: "Sí",
		value: true
	},
	{
		labelText: "No",
		value: false
	}
]
