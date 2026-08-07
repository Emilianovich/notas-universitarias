export type GradeLetter = "A" | "B" | "C" | "D" | "F"
export type RequestBuilder = {
	method: "GET" | "POST" | "PUT" | "DELETE"
	includeCredentials: boolean
	reqBody?: object
	path: string
}
type BaseRes = {
	statusCode: number
	issuedAt: string
}
export type SuccessRes<T> = BaseRes & { content: T }
export type ErrorRes<T> = BaseRes & { errors: T }
export * from "./db"
export * from "./dtos/index.js"
export * from "./helpers"
