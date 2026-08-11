import { buildRequest } from "@notas-universitarias/helpers"
import type { UserPreferences } from "@notas-universitarias/types"
import { useQuery } from "@tanstack/react-query"
import { type ReactNode, useState } from "react"
import { findPetByName } from "@/contexts/pet.ts"
import {
	SettingsContext,
	type SettingsProviderProps,
	Spike,
	type UserSettings
} from "@/contexts/settings.ts"

type User = {
	user: {
		name: string
		email: string
		preferences: UserPreferences
	}
}

export const getUserPreferences = async () => {
	return buildRequest<User, string>({
		includeCredentials: true,
		path: "/users",
		method: "GET"
	})
}

// TODO: you should be able to read files
export default function SettingsProvider({
	children
}: {
	children: ReactNode
}) {
	let currentSettings: SettingsProviderProps = {
		fontFamily: "Arima",
		pet: Spike,
		theme: "dark"
	}
	const { isError, data, isSuccess } = useQuery({
		queryKey: ["userPreferences"],
		queryFn: getUserPreferences
	})
	if (isError) {
		console.error(
			"No se pudo encontrar sus configuraciones. Se usarán unas por defecto"
		)
	}
	if (isSuccess) {
		const { fontFamily, theme, petName } = data.content.user.preferences
		const pet = findPetByName(petName)
		currentSettings = { fontFamily: fontFamily, theme, pet }
	}
	const [userSettings, setUserSettings] =
		useState<SettingsProviderProps>(currentSettings)
	const changeUserSettings = (newSettings: UserSettings) => {
		setUserSettings(newSettings)
	}
	return (
		<SettingsContext.Provider value={{ ...userSettings, changeUserSettings }}>
			{children}
		</SettingsContext.Provider>
	)
}
