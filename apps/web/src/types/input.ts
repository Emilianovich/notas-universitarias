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
	isFirstBeenCompleted: boolean
	isSecondBeenCompleted: boolean
	firstFormContent: {
		name: string
		startDate: string
		endDate: string
	}
	secondFormContent: {
		username: string
		email: string
		password: string
	}
	progress: number
}

export type RegisterFormProps = {
	registerState: RegisterState
	setGlobalFormState: (state: RegisterState) => void
}
