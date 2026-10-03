import { Trash2 } from "lucide-react"
import useModal, {type ConfirmModalBtn, type ModalProps} from "@/contexts/modal.ts"
import GenericModalContentCtn from "@/components/ui/modal/GenericModalContentCtn.tsx";
import scrollTo from "@/utils/scroll.ts";

type DeleteFormValueProps = {
	className: string,
	confirmButton: ConfirmModalBtn
	closeButtonTitle: string
	modalTitle: string
	modalText: string
}
export default function DeleteFormValue({
	className,
	modalTitle,
	confirmButton,
	closeButtonTitle,
	modalText,
}: DeleteFormValueProps) {
	const { buildModal } = useModal()
	const { styleType, text, action: deleteFn, type } = confirmButton
	return (
		<Trash2
			className={`text-red-700 cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out ${className}`}
			onClick={() => {
				buildModal({
					modalTitle,
					Content: <GenericModalContentCtn
						text={modalText}
						closeBtnTitle={closeButtonTitle}
						confirmButton={{
							styleType,
							action: () => {
								deleteFn()
							},
							text,
							type,
						}}
					/>,
				})
			}}
		/>
	)
}
