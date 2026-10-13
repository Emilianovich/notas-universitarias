import { createUserPreferencesSchema } from "@notas-universitarias/types"

export function isValidFontFamily(val: string): boolean {
	return createUserPreferencesSchema.pick({ fontFamily: true }).safeParse(val)
		.success
}

export function isValidTheme(val: string): boolean {
	return createUserPreferencesSchema.pick({ theme: true }).safeParse(val)
		.success
}

export function isValidPetName(val: string): boolean {
	return createUserPreferencesSchema.pick({ petName: true }).safeParse(val)
		.success
}
