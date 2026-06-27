import * as process from "node:process"

class ConfigService {
	constructor() {
		process.loadEnvFile(`${process.cwd()}/.env`)
	}
	getConfig(key: string): string {
		if (process.env[key] === undefined) {
			throw new Error("No such environment variable")
		}
		return process.env[key]
	}
}

export default ConfigService
