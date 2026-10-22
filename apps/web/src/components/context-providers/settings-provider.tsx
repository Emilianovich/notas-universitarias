import { buildRequest } from "@notas-universitarias/helpers"
import type { AppTheme, UserPreferences } from "@notas-universitarias/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { type ReactNode, useEffect, useMemo, useState } from "react"
import { findPetByName } from "@/contexts/pet.ts"
import {
	SettingsContext,
	type SettingsProviderProps,
	Spike,
	type UserSettings
} from "@/contexts/settings.ts"
import { writePreferencesToStorage } from "@/hooks/changeUserTheme.ts"
import { baseUrl } from "@/routes/__root.tsx"
import { allowedThemes } from "@/constants/app-themes"

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

// TODO consider throwing an exception if not a valid theme
const setNewAppTheme = (theme: AppTheme) => {
	if (!allowedThemes.has(theme)) return
	const { documentElement } = document
	documentElement.classList.remove(...allowedThemes)
	documentElement.classList.add(theme)
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
	const { fontFamily, theme, petName, disablePet } = data.content.user.preferences
	const [userSettings, setUserSettings] = useState<SettingsProviderProps>({
		fontFamily,
		theme,
		pet: findPetByName(petName) ?? Spike,
		disablePet
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
	 */
	useEffect(() => {
		const { fontFamily, theme, pet, disablePet } = userSettings
		if (!theme) return
		setNewAppTheme(theme)
		writePreferencesToStorage({
			theme,
			fontFamily,
			petName: pet.name,
			disablePet
		})
	}, [userSettings])
	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	)
}
