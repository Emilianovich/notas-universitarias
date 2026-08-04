import type { ChangeEvent } from "react"

export type InputProps<T> = {
	label: string
	type: "text" | "email" | "password" | "date"
	placeholder?: string
	name: string
	value: T
	error: string | undefined
	syncValueToState: (e: ChangeEvent<HTMLInputElement>) => void
	handleBlur: () => void
	isDirty: boolean
	color: "#F9FCFC"
	id: string
	originallyPassword: boolean
}

export type PasswordImageProps = {
	isOpen: boolean
	changeType: () => void
}
