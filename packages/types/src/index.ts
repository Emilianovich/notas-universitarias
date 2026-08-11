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
export const ON_SUBMIT_INVALID_MSG =
	"Asegúrate llenar todos los campos y cumplir con todas las validaciones"
export type SuccessRes<T> = BaseRes & { content: T }
export type ErrorRes<T> = BaseRes & { errors: T }
export * from "./db.js"
export * from "./document-schemas/index.js"
export * from "./dtos/index.js"
export * from "./helpers.js"
