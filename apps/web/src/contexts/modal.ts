import type {JSX} from "react"
import { createContext, useContext } from "react"

export type ModalButton = {
	action: () => Promise<void> | void
	text: string
	styleType: "modal-primary" | "secondary" | "primary"
}

export type ModalAPI = {
	buildModal: (data: ModalProps) => void
	closeModal: () => void
}

export type ModalProps = {
	modalTitle: string
	Content: JSX.Element
}


export type ModalContextComponentProps = ModalProps & {
	isOpen: boolean
}

export type ModalBtnCtnProps = {
	closeBtnTitle: string
	confirmButton: ConfirmModalBtn
}
export type ConfirmModalBtn = ModalButton & {
	type: "button" | "reset" | "submit"
}

export type GenericModalContentCtnProps = {
	text: string
} & ModalBtnCtnProps
export const ModalContext = createContext<ModalAPI | null>(null)

export default function useModal() {
	const context = useContext(ModalContext)
	if (!context) throw new Error("You must provide an ModalContext")
	return context
}
