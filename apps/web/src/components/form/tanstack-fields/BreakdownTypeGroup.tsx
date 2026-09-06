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
import {RadioField} from "@/components/form/tanstack-fields/RadioField.tsx";

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
	radioGroupName: string
	hasLabDetail: boolean
	radioId?: string
}

export default function BreakdownTypeGroup({radioGroupName, hasLabDetail}:RadioGroupProps) {
	const field = useFieldContext<BreakdownCategory>()
	const { errors, isBlurred } = field.state.meta
	return (
		<div className={"flex flex-col gap-2"}>
			<h2 className={"text-xl"}>{ADD_BREAKDOWN_TEXT}</h2>
			<RadioField
				value={"STANDALONE"}
				labelText={STANDALONE_LABEL}
				type={"breakdownCategory"}
				radioGroupName={radioGroupName}
			/>
			<RadioField
				value={"NOT-NESTED"}
				labelText={NOT_NESTED_LABEL}
				type={"breakdownCategory"}
				radioGroupName={radioGroupName}
			/>
			{!hasLabDetail && (
				<RadioField
					type={"breakdownCategory"}
					radioGroupName={radioGroupName}
					value={"NESTED"}
					labelText={NESTED_LABEL}
				/>
			)}
			{errors && isBlurred && (
				<ErrorMessage error={errors[0]?.message as string} />
			)}
		</div>
	)
}
