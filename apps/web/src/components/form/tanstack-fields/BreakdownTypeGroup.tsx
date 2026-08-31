import {
	ADD_BREAKDOWN_TEXT,
	type BreakdownCategory,
	NESTED_LABEL,
	NOT_NESTED_LABEL,
	STANDALONE_LABEL
} from "@notas-universitarias/types"
import type { FieldApi } from "@tanstack/react-form"
import ErrorMessage from "@/components/form/general/ErrorMessage.tsx"
import RadioInput, {
	type RadioInputProps
} from "@/components/form/general/RadioInput.tsx"
import { useFieldContext } from "@/hooks/form.ts"

export type BreakdownTypeGroupProps =
	| {
			index: number
			isLabDetail: false
	  }
	| {
			index: number
			isLabDetail: true
			labIndex: number
	  }

export type RadioGroupProps = {
	// biome-ignore lint/suspicious/noExplicitAny: <need for FieldApi type>
	field: FieldApi<
		any,
		string,
		BreakdownCategory,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any
	>
	radioGroupName: string
}

export function getGeneralRadioProps({
	radioGroupName,
	field
}: RadioGroupProps): Omit<RadioInputProps, "value" | "labelText" | "radioId"> {
	const { handleBlur, handleChange, state } = field
	return {
		handleBlur,
		syncValueToState: (e) => handleChange(e.target.value as BreakdownCategory),
		radioGroupName,
		currentVal: state.value
	}
}

export default function BreakdownTypeGroup(props: BreakdownTypeGroupProps) {
	const { index, isLabDetail } = props
	let radioGroupName: string
	let radioId: string
	if (isLabDetail) {
		radioGroupName = `breakdown[${index}].laboratoryDetails.breakdown[${props.labIndex}].type`
		radioId = `breakdown[${index}].laboratoryDetails.breakdown[${props.labIndex}].`
	} else {
		radioGroupName = `breakdown[${index}].type`
		radioId = `breakdown[${index}].`
	}
	const field = useFieldContext<BreakdownCategory>()
	const { errors, isBlurred } = field.state.meta
	const generalRadioProps = getGeneralRadioProps({
		field,
		radioGroupName
	})
	return (
		<div className={"flex flex-col gap-2"}>
			<h2 className={"text-xl"}>{ADD_BREAKDOWN_TEXT}</h2>
			<RadioInput
				value={"STANDALONE"}
				labelText={STANDALONE_LABEL}
				radioId={`${radioId}standalone`}
				{...generalRadioProps}
				key={radioId}
			/>
			{!isLabDetail && (
				<RadioInput
					value={"NESTED"}
					labelText={NESTED_LABEL}
					radioId={`${radioId}nested`}
					{...generalRadioProps}
					key={`${radioId}nested`}
				/>
			)}
			<RadioInput
				value={"NOT-NESTED"}
				labelText={NOT_NESTED_LABEL}
				radioId={`${radioId}not-nested`}
				{...generalRadioProps}
				key={`${radioId}not-nested`}
			/>
			{errors && isBlurred && (
				<ErrorMessage error={errors[0]?.message as string} />
			)}
		</div>
	)
}
