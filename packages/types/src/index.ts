export type GradeLetter = "A" | "B" | "C" | "D" | "F"
export type RequestBuilder = {
	baseUrl: string
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
export const STANDALONE_LABEL = "Registrar una sola nota"
export const NESTED_LABEL = "Agregar una evaluación de laboratorio"
export const NOT_NESTED_LABEL = "Registrar varias notas"
export const ADD_BREAKDOWN_TEXT = "¿Qué quieres hacer con esta evaluación?"
export const PREVIEW_PET_HEIGHT = 120
export const PREVIEW_TEXT_HEIGHT = 32
export const TABLE_HEADER_DATA_MISMATCH_MSG =
	"La cantidad de encabezados no encaja con la cantidad de datos en la tabla"
export const BREAKDOWN_TABLE_TITLE_COURSE = "Evaluación del curso"
export const COURSE_INSTANCE_CONTRIBUTION_GRAPH_TITLE = "Desglose del curso"
export const COURSE_INSTANCE_CONTRIBUTION_TITLE =
	"Desempeño en las evaluaciones"
export const LAB_BREAKDOWN_TABLE_TITLE_COURSE = "Evaluación de laboratorio"
export const LAB_CONTRIBUTION_GRAPH_TITLE = "Desglose del laboratorio"
export const LAB_CONTRIBUTION_TITLE =
	"Desempeño en las evaluaciones de laboratorio"
export const NO_BREAKDOWN_ENTRIES = "Aún no hay calificaciones registradas"
export const CTX_MENU_SEE_PROGRESS_TEXT = "Ver progreso"
export const CTX_MENU_EDIT_COURSE = "Editar"
export type SuccessRes<T> = BaseRes & { content: T }
export * from "./db.js"
export * from "./document-schemas/index.js"
export * from "./dtos/index.js"
export * from "./helpers.js"
