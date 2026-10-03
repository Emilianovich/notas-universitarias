import ModalBtnCtn from "@/components/ui/modal/ModalBtnCtn.tsx";
import type {GenericModalContentCtnProps} from "@/contexts/modal.ts";

export default function GenericModalContentCtn({closeBtnTitle, confirmButton, text} : GenericModalContentCtnProps) {
    const {text: btnText, action, styleType, type} = confirmButton
    return (
        <div className={"flex flex-col h-fit gap-15 justify-between items-start"}>
            <span className={"text-primary-500 opacity-80 text-lg"}>{text}</span>
            <ModalBtnCtn
                closeBtnTitle={closeBtnTitle}
                confirmButton={{
                    text: btnText,
                    type,
                    styleType,
                    action,
                }}
            />
        </div>
    );
}