import type {RadioInputProps} from "@/components/form/general/RadioInput.tsx";
import {useFieldContext} from "@/hooks/form.ts";
import type {BreakdownCategory} from "@notas-universitarias/types";
import type {ChangeEvent} from "react";

type TanstackRadioFieldProps =  {
    type: "boolean"
    value: "0" | "1"
} & Omit<RadioInputProps, "handleBlur" | "syncValueToState" | "radioId"> | {
    type: "breakdownCategory"
    value: BreakdownCategory
} & Omit<RadioInputProps, "handleBlur" | "syncValueToState" | "radioId">


export function RadioField({value, radioGroupName, currentVal,  labelText, type} : TanstackRadioFieldProps) {
    const field = useFieldContext<string | boolean>()
    const { handleBlur, handleChange } = field
    let syncValueToState : (e: ChangeEvent<HTMLInputElement>) => void
    if (type === "breakdownCategory") {
        syncValueToState = (e) => handleChange(e.currentTarget.value as BreakdownCategory)
    } else {
        syncValueToState = (e) => handleChange(e.currentTarget.value)
    }
    return (
        <label className={"flex gap-4 w-100"}>
            <input
                type={"radio"}
                value={value}
                name={radioGroupName}
                onChange={syncValueToState}
                onBlur={handleBlur}
                checked={currentVal === value}
            />
            <span className={"text-primary-600"}>{labelText}</span>
        </label>
    );
}
