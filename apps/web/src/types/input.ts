import type { DataAfterRegister } from "@notas-universitarias/types"
import type { ChangeEvent } from "react"

export type InputProps<T> = {
	label: string
	type: "text" | "email" | "password" | "date"
	placeholder?: string
	name: string
	value: T
	error: string | undefined
	syncValueToState: (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void
	handleBlur: () => void
	isBlurred: boolean
	color: "#F9FCFC"
	id: string
	originallyPassword: boolean
}

export type PasswordImageProps = {
	isOpen: boolean
	changeType: () => void
}

export type RegisterState = {
	isFirstDone: boolean
	isSecondDone: boolean
	progress: number
	afterRegisterData: DataAfterRegister
	username?: string
}

export type RegisterFormProps = {
	registerState: RegisterState
	setGlobalFormState: (state: RegisterState) => void
}
