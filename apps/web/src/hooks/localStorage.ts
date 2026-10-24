import { createUserPreferencesSchema } from "@notas-universitarias/types"
import { useState } from "react"
import type { z } from "zod"
import defaultSettings from "@/components/context-providers/default-settings.ts"

type LocalStorageReturn = z.infer<typeof createUserPreferencesSchema> & {
	disablePet: boolean
}

export default function useLocalStorage() {
	const [getData, _setGetData] = useState(() =>
		typeof window !== "undefined" ? getLocalStorageSettings() : null
	)
	return getData
}

function getLocalStorageSettings(): LocalStorageReturn {
	const {
		fontFamily: defaultFont,
		pet: defaultPet,
		theme: defaultTheme,
		disablePet: defaultDisablePet
	} = defaultSettings
	const fontFamily = localStorage.getItem("fontFamily")
	const petName = localStorage.getItem("petName")
	const theme = localStorage.getItem("theme")
	const disablePet = localStorage.getItem("disablePet")
	const rawSettings = { fontFamily, petName, theme, disablePet }
	const settings = createUserPreferencesSchema.safeParse(rawSettings)
	if (!settings.success) {
		return {
			fontFamily: defaultFont,
			petName: defaultPet.name,
			theme: defaultTheme,
			disablePet: defaultDisablePet
		}
	} else {
		if (!disablePet) {
			return {
				...settings.data,
				disablePet: defaultDisablePet
			}
		} else {
			return {
				...settings.data,
				disablePet: disablePet === "true"
			}
		}
	}
}
