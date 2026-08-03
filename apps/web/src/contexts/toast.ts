import { createContext, useContext } from "react"

export type ToastProps = {
	type: "success" | "info" | "error"
	content: string
}

export type ToastContext = {
	buildToast: (props: ToastProps) => void
}

export type ToastProviderProps = {
	toastProps: ToastProps
	renderToast: boolean
}

export const ToastContext = createContext<ToastContext | null>(null)

export default function useToast() {
	const context = useContext(ToastContext)
	if (!context) throw new Error("useToast must be used within a Toast Provider")
	return context
}
