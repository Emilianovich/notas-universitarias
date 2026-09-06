import type {CreateCourseInstanceOpts} from "@/components/form/courses/types/types.ts";
import useToast from "@/contexts/toast.ts";
import {
    type CourseBreakdownToBeCreated,
    type CourseInstanceToBeCreated,
    CreateCourseInstanceSchema, ON_SUBMIT_INVALID_MSG
} from "@notas-universitarias/types";
import {createFormHook} from "@tanstack/react-form";
import {fieldContext, formContext} from "@/hooks/form.ts";
import TextField from "@/components/form/tanstack-fields/TextField.tsx";
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx";
import SelectField from "@/components/form/tanstack-fields/SelectField.tsx"
import {RadioField} from "@/components/form/tanstack-fields/RadioField.tsx";
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx";

export const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        SelectField,
        RadioField,
        NumberField
    },
    formComponents: { SubmitBtn }
})

export default function useCreateCourseInstanceOpts({mutation}: CreateCourseInstanceOpts)  {
    const { buildToast } = useToast()
    return useAppForm({
        validators: {
            onBlur: CreateCourseInstanceSchema
        },
        defaultValues: {
            isRegistered: false,
            name: undefined,
            previousCourseId: undefined,
            profesorName: "",
            breakdown: [] as CourseBreakdownToBeCreated[]
        } as CourseInstanceToBeCreated,
        onSubmitInvalid: () => {
            buildToast({
                id: Date.now(),
                type: "error",
                content: ON_SUBMIT_INVALID_MSG
            })
        },
        onSubmit: async ({ value }) => {
            mutation.mutate(value)
        }
    })
}