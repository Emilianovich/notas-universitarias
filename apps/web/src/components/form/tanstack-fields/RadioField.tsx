// import type {RadioInputProps} from "@/components/form/general/RadioInput.tsx";
// import {useFieldContext, useFormContext} from "@/hooks/form.ts";
// import {useSelector} from "@tanstack/react-form";
//
// type TanstackRadioFieldProps = Omit<RadioInputProps, "handleBlur">
// export function RadioField({value, radioId, radioGroupName, currentVal, syncValueToState, labelText} : RadioInputProps) {
//     const field = useFieldContext<string | boolean>()
//     const form = useFormContext()
//     const { errors, isBlurred } = field.state.meta
//     const { name, handleBlur, handleChange } = field
//     const submissionAttempts = useSelector(
//         form.store,
//         (state) => state.submissionAttempts
//     )
//     return (
//         <div className={"grid grid-cols-[min-content_1fr] gap-4 w-100"}>
//             <div className={"w-fit flex items-center justify-center"}>
//                 <input
//                     type={"radio"}
//                     value={value}
//                     name={radioGroupName}
//                     id={radioId}
//                     onChange={syncValueToState}
//                     onBlur={handleBlur}
//                     checked={currentVal === value}
//                 />
//             </div>
//             <label htmlFor={radioId} className={"text-primary-600"}>
//                 {labelText}
//             </label>
//         </div>
//     );
// }
