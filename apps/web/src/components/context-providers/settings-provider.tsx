import { buildRequest } from "@notas-universitarias/helpers"
import type { UserPreferences } from "@notas-universitarias/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { type ReactNode, useEffect, useMemo, useState } from "react"
import { findPetByName } from "@/contexts/pet.ts"
import {
	SettingsContext,
	type SettingsProviderProps,
	Spike,
	type UserSettings
} from "@/contexts/settings.ts"
import { changeUserTheme } from "@/hooks/changeUserTheme.ts"
import { baseUrl } from "@/routes/__root.tsx"

type User = {
	user: {
		name: string
		email: string
		preferences: UserPreferences
	}
}

export const getUserPreferences = async () => {
	return buildRequest<User, string>({
		baseUrl,
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
	/*
	 * Read user settings
	 * Check if HTML Element has the current theme. If not replace previous and add current theme
	 * Update localStorage with new theme
	 * */
	useEffect(() => {
		const { fontFamily, theme, pet } = userSettings
		if (!theme) return
		const { documentElement } = document
		if (theme === "dark") {
			documentElement.classList.add("dark")
			if (documentElement.classList.contains("light")) {
				documentElement.classList.remove("light")
			}
		} else {
			documentElement.classList.add("light")
			if (documentElement.classList.contains("dark")) {
				documentElement.classList.remove("dark")
			}
		}
		changeUserTheme({
			document: documentElement,
			theme,
			fontFamily,
			petName: pet.name
		})
	}, [userSettings])
	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	)
}
