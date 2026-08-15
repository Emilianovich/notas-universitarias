import useModal, {type ModalBuilderProps} from "@/contexts/modal.ts";
import {Trash2} from "lucide-react";

type DeleteFormValueProps = {
    className: string
} & ModalBuilderProps
export default function DeleteFormValue({ className, modalTitle, modalContent, confirmButton, closeButtonTitle } : DeleteFormValueProps) {
    const {buildModal, closeModal} = useModal()
    const {type, text, action : deleteFn} = confirmButton
    return (
        <Trash2
            className={
                `text-red-700 cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out ${className}`
            }
            onClick={() => {
                buildModal({
                    modalTitle,
                    confirmButton: {
                        type,
                        action: () => {
                            deleteFn()
                            closeModal()
                        },
                        text
                    },
                    closeButtonTitle,
                    modalContent
                })
            }}
        />
    );
}