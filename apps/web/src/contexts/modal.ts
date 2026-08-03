import { createContext, useContext } from "react"

export type ModalButton = {
	action: () => Promise<void> | void
	text: string
	type: "modal-primary" | "secondary"
}

export type ModalContextProps = {
	buildModal: (data: ModalBuilderProps) => void
	closeModal: () => void
}

export type ModalBuilderProps = {
	modalTitle: string
	modalContent: string
	confirmButton: ModalButton
	closeButtonTitle: string
}

export type ModalProps = ModalBuilderProps & {
	closeModal: () => void
}

export type ModalContextComponentProps = {
	isOpen: boolean
	modalTitle: string
	modalContent: string
	confirmButton: ModalButton
	closeButtonTitle: string
}

export const ModalContext = createContext<ModalContextProps | null>(null)

export default function useModal() {
	const context = useContext(ModalContext)
	if (!context) throw new Error("You must provide an ModalContext")
	return context
}
