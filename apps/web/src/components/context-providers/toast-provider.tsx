import { type ReactNode, useState } from "react"
import Toast from "@/components/general/Toast.tsx"
import {
	ToastContext,
	type ToastProps,
	type ToastProviderProps
} from "@/contexts/toast.ts"

const ToastBaseProps: ToastProps = {
	type: "info",
	content: "Hi! If you find this it's an easter egg"
}

export default function ToastProvider({ children }: { children: ReactNode }) {
	const [providerState, setProviderState] = useState<ToastProviderProps>({
		renderToast: false,
		toastProps: ToastBaseProps
	})
	const { content, type } = providerState.toastProps
	const buildToast = (data: ToastProps) => {
		setProviderState({ toastProps: data, renderToast: true })
	}
	return (
		<ToastContext value={{ buildToast }}>
			{children}
			{providerState.renderToast && <Toast type={type} content={content} />}
		</ToastContext>
	)
}
