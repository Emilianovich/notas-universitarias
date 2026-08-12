import { buildRequest } from "@notas-universitarias/helpers"
import type { UserPreferences } from "@notas-universitarias/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { type ReactNode, useMemo, useState } from "react"
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
	const { data } = useSuspenseQuery({
		queryKey: ["userPreferences"],
		queryFn: getUserPreferences
	})
	const { fontFamily, theme, petName } = data.content.user.preferences
	const [userSettings, setUserSettings] = useState<SettingsProviderProps>({
		fontFamily,
		theme,
		pet: findPetByName(petName) ?? Spike
	})
	const changeUserSettings = (newSettings: UserSettings) => {
		setUserSettings({ ...newSettings })
	}
	const value = useMemo(
		() => ({ ...userSettings, changeUserSettings }),
		[userSettings]
	)
	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	)
}
