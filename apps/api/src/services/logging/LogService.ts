import {
	removeCharsFromString,
	whiteSpaceReducer
} from "@notas-universitarias/helpers"
import pino from "pino"

export type LogLevel = "debug" | "info" | "warn" | "error" | "trace"
export type LogParams = {
	message: string
	level: LogLevel
	path?: string
	requestId?: string
}
type LogMessageParams = LogParams & {
	date: string
}
const getPino = () =>
	pino({
		transport: {
			target: "pino-pretty"
		}
	})
const getMessage = (params: LogMessageParams): string => {
	const { message, path, requestId, date } = params
	return whiteSpaceReducer(`${path} [${date}] ${requestId}: ${message}`)
}

export const log = (
	level: LogLevel,
	message: string,
	path: string | undefined = "",
	requestId: string | undefined = ""
) => {
	const now = new Date()
	const rawFormattedDate = new Intl.DateTimeFormat("es", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: false,
		timeZone: "America/Panama"
	}).format(now)
	const formattedDate = removeCharsFromString({
		value: rawFormattedDate,
		stringsToRemove: [","]
	})
	switch (level) {
		case "debug":
			getPino().debug(
				getMessage({
					date: formattedDate,
					requestId,
					path,
					level,
					message
				})
			)
			break
		case "info":
			getPino().info(
				getMessage({
					date: formattedDate,
					requestId,
					path,
					level,
					message
				})
			)
			break
		case "warn":
			getPino().warn(
				getMessage({
					date: formattedDate,
					requestId,
					path,
					level,
					message
				})
			)
			break
		case "error":
			getPino().error(
				getMessage({
					date: formattedDate,
					requestId,
					path,
					level,
					message
				})
			)
			break
	}
}
