import {useForm} from "@tanstack/react-form";
import useToast from "@/contexts/toast.ts";
import { createUserPreferencesSchema } from "@notas-universitarias/types/dtos"
import type {FontFamily} from "@notas-universitarias/types";
import type {RegisterFormProps} from "@/types/input.ts";

export default function UserSettingsForm({
                                             setGlobalFormState,
                                             registerState
                                         }: RegisterFormProps) {
    const {buildToast} = useToast()
    const form = useForm({
        validators: {
            onBlur: createUserPreferencesSchema
        },
        defaultValues: {
            fontFamily: "Arima" as FontFamily,
            petName: "Spike",
            theme: "dark"
        }
    })
    return (
        <form>

        </form>
    );
}