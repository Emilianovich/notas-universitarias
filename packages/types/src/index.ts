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
export const STANDALONE_LABEL = "Es un solo porcentaje"
export const NESTED_LABEL = "Parte de teoría y laboratorio"
export const NOT_NESTED_LABEL = "Tiene subdivisiones"
export const PREVIEW_PET_HEIGHT = 120
export const PREVIEW_TEXT_HEIGHT = 32
export type SuccessRes<T> = BaseRes & { content: T }
export * from "./db.js"
export * from "./document-schemas/index.js"
export * from "./dtos/index.js"
export * from "./helpers.js"
