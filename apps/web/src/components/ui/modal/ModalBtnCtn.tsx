import Button from "@/components/general/Button.tsx";
import useModal, {type ModalBtnCtnProps} from "@/contexts/modal.ts";

export default function ModalBtnCtn({closeBtnTitle, confirmButton} : ModalBtnCtnProps) {
    const {styleType, text, action, type} = confirmButton
    const {closeModal} = useModal()
    return (
        <div className={"flex justify-between items-center w-full"}>
            <Button
                text={closeBtnTitle}
                type={"button"}
                styleType={"secondary"}
                isDisabled={false}
                clickAction={closeModal}
            />
            <Button
                text={text}
                type={type}
                styleType={styleType}
                isDisabled={false}
                clickAction={() => {
                    action()
                    closeModal()
                }}
            />
        </div>
    );
}