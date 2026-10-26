import { allowedThemes } from "@/constants/app-themes"
import type { AppTheme, FontFamily, PetName } from "@notas-universitarias/types"

type ChangeUserTheme = {
	theme: AppTheme
	petName: PetName
	fontFamily: FontFamily
	disablePet: boolean
}
export function writePreferencesToStorage({
	theme,
	petName,
	fontFamily,
	disablePet
}: ChangeUserTheme) {
	const { documentElement } = document
	const documentClasses = documentElement.classList
	localStorage.setItem("theme", theme)
	localStorage.setItem("petName", petName)
	localStorage.setItem("fontFamily", fontFamily)
	localStorage.setItem("disablePet", disablePet.toString())
	const themes = [...allowedThemes]
	const themeToUpdate = themes.find((theme) =>
		documentClasses.contains(theme)
	)
	if (!themeToUpdate) {
		documentClasses.add(theme)
		return
	}
	documentClasses.replace(themeToUpdate, theme)
}
