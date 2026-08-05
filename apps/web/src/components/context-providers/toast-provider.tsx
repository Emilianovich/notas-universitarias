import { type ReactNode, useState } from "react"
import Toast from "@/components/general/Toast.tsx"
import {
	type BuildToastProps,
	ToastContext,
	type ToastProviderProps
} from "@/contexts/toast.ts"

export default function ToastProvider({ children }: { children: ReactNode }) {
	const [providerState, setProviderState] = useState<ToastProviderProps>({
		toasts: []
	})
	const buildToast = (data: BuildToastProps) => {
		setProviderState({ toasts: [...providerState.toasts, data] })
	}
	const removeToast = (id: number) =>
		setProviderState({
			toasts: providerState.toasts.filter((toast) => toast.id !== id)
		})
	return (
		<ToastContext value={{ buildToast }}>
			{children}
			<div
				className={
					"fixed bottom-4 left-8 flex flex-col gap-4 w-fit h-fit transition-all duration-300 ease-in-out"
				}
			>
				{providerState.toasts.map((toast) => {
					const { id, type, content } = toast
					return (
						<Toast
							key={id}
							id={id}
							type={type}
							content={content}
							removeToast={removeToast}
						/>
					)
				})}
			</div>
		</ToastContext>
	)
}
