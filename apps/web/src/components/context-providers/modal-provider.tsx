import { type ReactNode, useState } from "react"
import Button from "@/components/general/Button.tsx"
import {
	type ModalBuilderProps,
	ModalContext,
	type ModalContextComponentProps,
	type ModalProps
} from "@/contexts/modal.ts"

const defaultModalContextComponentProps: ModalContextComponentProps = {
	isOpen: false,
	modalTitle: "Action Title",
	modalContent:
		"This is the action subtext. It represents the action the user can complete",
	confirmButton: {
		action: () => console.error("Pass in information to the modal"),
		text: "Confirmation action",
		type: "modal-primary"
	},
	closeButtonTitle: "Probar"
}

export default function ModalProvider({ children }: { children: ReactNode }) {
	const [modalProps, setModalProps] = useState<ModalContextComponentProps>(
		defaultModalContextComponentProps
	)
	const buildModal = ({
		modalTitle,
		modalContent,
		confirmButton,
		closeButtonTitle
	}: ModalBuilderProps) => {
		setModalProps({
			isOpen: true,
			modalTitle,
			modalContent,
			confirmButton,
			closeButtonTitle
		})
	}
	const closeModal = () => setModalProps({ ...modalProps, isOpen: false })
	return (
		<ModalContext value={{ buildModal, closeModal }}>
			{children}
			<div
				className={`${modalProps.isOpen ? "fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-200 transition-opacity duration-700 opacity-100" : "opacity-0 -z-1"}`}
			>
				{modalProps.isOpen && (
					<Modal
						modalTitle={modalProps.modalTitle}
						modalContent={modalProps.modalContent}
						confirmButton={modalProps.confirmButton}
						closeButtonTitle={modalProps.closeButtonTitle}
						closeModal={closeModal}
					/>
				)}
			</div>
		</ModalContext>
	)
}

export function Modal({
	modalTitle,
	modalContent,
	confirmButton,
	closeButtonTitle,
	closeModal
}: ModalProps) {
	return (
		<div
			className={`flex text-primary-400 items-center justify-center p-4 gap-4 bg-secondary h-[min(300px,calc(100dvh-32px))] rounded-[20px] transition-all ease-in-out duration-300`}
			style={{ aspectRatio: "151 / 89" }}
		>
			<div className={"modal-wrapper w-[90%]"}>
				<h2 className={"sm:text-2xl xl:text-3xl font-bold"}>{modalTitle}</h2>
				<p className={"text-justify text-[18px] xl:text-xl"}>{modalContent}</p>
				<div className={"flex justify-between items-center w-full"}>
					<Button
						type={"button"}
						text={closeButtonTitle}
						styleType={"secondary"}
						clickAction={closeModal}
						isDisabled={false}
					/>
					<Button
						type={"button"}
						text={confirmButton.text}
						styleType={confirmButton.type}
						clickAction={confirmButton.action}
						isDisabled={false}
					/>
				</div>
			</div>
		</div>
	)
}
