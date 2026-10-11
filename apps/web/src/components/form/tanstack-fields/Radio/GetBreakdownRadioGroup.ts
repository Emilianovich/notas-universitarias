import {
	type BreakdownCategory,
	NESTED_LABEL,
	NOT_NESTED_LABEL,
	STANDALONE_LABEL
} from "@notas-universitarias/types"
import type { RadioButtonProps } from "@/components/form/tanstack-fields/Radio/RadioButton.tsx"

export const getBreakdownRadioGroup = (
	radioGroupName: string,
	isLabDetail: boolean
): RadioButtonProps<BreakdownCategory>[] => {
	const radios: RadioButtonProps<BreakdownCategory>[] = [
		{
			radioGroupName,
			value: "STANDALONE",
			labelText: STANDALONE_LABEL
		},
		{
			radioGroupName,
			value: "NOT-NESTED",
			labelText: NOT_NESTED_LABEL
		}
	]
	if (isLabDetail) {
		radios.push({
			radioGroupName,
			value: "NESTED",
			labelText: NESTED_LABEL
		})
	}
	return radios
}
