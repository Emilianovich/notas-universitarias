import {breakdownSharedContentDefaultValues} from "@/components/form/courses/types/types.ts";
import {NESTED_LABEL, NOT_NESTED_LABEL, STANDALONE_LABEL} from "@notas-universitarias/types";
import DeleteFormValue from "@/components/form/general/DeleteFormValue.tsx";
import {createFormHook} from "@tanstack/react-form";
import TextField from "@/components/form/tanstack-fields/TextField.tsx";
import NumberField from "@/components/form/tanstack-fields/NumberField.tsx";
import SelectField from "@/components/form/tanstack-fields/SelectField.tsx";
import {RadioButton} from "@/components/form/tanstack-fields/Radio/RadioButton.tsx";
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx";
import {fieldContext, formContext} from "@/hooks/form.ts";

export const { withForm, withFieldGroup } = createFormHook({
    fieldComponents: {
        TextField,
        NumberField,
        SelectField,
        RadioField: RadioButton
    },
    formComponents: { SubmitBtn },
    fieldContext,
    formContext
})

export const BreakdownSharedContent = withFieldGroup({
    defaultValues: breakdownSharedContentDefaultValues,
    props: {
        modalTitle: "",
        confirmBtnAction: () => console.log("This is the modal confirm action"),
        isLabDetail: false
    },
    render: function Render({group, modalTitle, confirmBtnAction, isLabDetail})  {
        const {AppField} = group
        return (
            <>
                <div className={"relative"}>
                    <AppField
                        name={`name`}
                        children={(nameField) => (
                            <nameField.TextField
                                label={"¿Cómo se llama la evaluación?"}
                                placeholder={"Asistencia"}
                            />
                        )}
                    />
                    <DeleteFormValue
                        className={""}
                        modalTitle={modalTitle}
                        modalContent={"Eliminarás completamente la evaluación. No podrás recuperar el progreso que tenías"}
                        confirmButton={{
                            type: "modal-primary",
                            text: "Sí, eliminar",
                            action: confirmBtnAction
                        }}
                        closeButtonTitle={"No, me arrepentí"}
                        />
                </div>
                <AppField
                    name={`percentage`}
                    children={(percentageField) => (
                        <percentageField.NumberField
                            label={"¿Cuál es el porcentaje de la evaluación?"}
                            placeholder={"21"}
                        />
                    )}
                />
                <AppField
                    name={`type`}
                    key={`type`}
                    children={(typeField) => (
                        <>
                            <typeField.RadioField
                                type={"breakdownCategory"}
                                value={"STANDALONE"}
                                radioGroupName={typeField.name}
                                labelText={STANDALONE_LABEL}
                            />
                            <typeField.RadioField
                                type={"breakdownCategory"}
                                value={"NOT-NESTED"}
                                radioGroupName={typeField.name}
                                labelText={NOT_NESTED_LABEL}
                            />
                            {isLabDetail && (
                                <typeField.RadioField
                                    type={"breakdownCategory"}
                                    value={"NESTED"}
                                    radioGroupName={typeField.name}
                                    labelText={NESTED_LABEL}
                                />
                            )}
                        </>
                    )}
                />
            </>
        )
    }
})