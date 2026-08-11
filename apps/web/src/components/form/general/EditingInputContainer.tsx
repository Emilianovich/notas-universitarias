// import GeneralInputContainer, {type GeneralInputContainerProps} from "@/components/form/general/GeneralInputContainer.tsx";
// import {useState} from "react";
//
// type ManageEditingInputProps = {
//     isEditing: boolean
//     canDelete: boolean
//     isDeleted: boolean
//     deleteFn: () => void
// }
//
// type EditingInputContainerProps = GeneralInputContainerProps & {
//     editingSettings: ManageEditingInputProps
// }
//
// export default function EditingInputContainer({ editingSettings, input, inputId, isBlurred, error, maxWidth, labelText } : EditingInputContainerProps) {
//     const [manageSettings, setManageSettings] = useState(editingSettings)
//     const { isDeleted, canDelete, deleteFn, isEditing } = manageSettings
//     return (
//         <div>
//             <img alt={""}/>
//             { !isDeleted && <GeneralInputContainer labelText={labelText} inputId={inputId} maxWidth={maxWidth} isBlurred={isBlurred} input={input} error={error} /> }
//         </div>
//     )
// }
