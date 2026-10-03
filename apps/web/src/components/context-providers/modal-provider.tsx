import { type ReactNode, useState } from "react"
import {
	type ModalProps,
	ModalContext,
	type ModalContextComponentProps,
} from "@/contexts/modal.ts"
import Modal from "@/components/ui/modal/Modal.tsx";

const defaultModalContextComponentProps: ModalContextComponentProps = {
	isOpen: false,
	modalTitle: "Action Title",
	Content: <span>Hi</span>,
}

export default function ModalProvider({ children }: { children: ReactNode }) {
	const [modalProps, setModalProps] = useState<ModalContextComponentProps>(
		defaultModalContextComponentProps
	)
	const {modalTitle, Content, isOpen} = modalProps
	const buildModal = ({
		modalTitle,
		Content
	}: ModalProps) => {
		setModalProps({
			isOpen: true,
			modalTitle,
			Content
		})
	}
	const closeModal = () => setModalProps({ ...modalProps, isOpen: false })
	return (
		<ModalContext value={{ buildModal, closeModal }}>
			{children}
			<div
				className={`${isOpen ? "fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-200 transition-opacity duration-700 opacity-100" : "opacity-0 -z-1"}`}
			>
				{isOpen && (
					<Modal
						modalTitle={modalTitle}
						Content={Content}
					/>
				)}
			</div>
		</ModalContext>
	)
}

