import { createContext, useContext } from "react"

export type BuildToastProps = {
	id: number
	type: "success" | "info" | "error"
	content: string
}

export type ToastProps = BuildToastProps & { removeToast: (id: number) => void }

export type ToastContext = {
	buildToast: (props: BuildToastProps) => void
}

export type ToastProviderProps = {
	toasts: BuildToastProps[]
}

export const ToastContext = createContext<ToastContext | null>(null)

export default function useToast() {
	const context = useContext(ToastContext)
	if (!context) throw new Error("useToast must be used within a Toast Provider")
	return context
}
