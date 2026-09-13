import type { AppTheme, FontFamily, PetName } from "@notas-universitarias/types"

type ChangeUserTheme = {
	document: HTMLElement
	theme: AppTheme
	petName: PetName
	fontFamily: FontFamily
}
export function changeUserTheme({
	document,
	theme,
	petName,
	fontFamily
}: ChangeUserTheme) {
	const documentClasses = document.classList
	localStorage.setItem("theme", theme)
	localStorage.setItem("petName", petName)
	localStorage.setItem("fontFamily", fontFamily)
	if (!documentClasses.contains("light") || !documentClasses.contains("dark")) {
		documentClasses.add(theme)
		return
	}
	if (theme === "dark" && !documentClasses.contains("dark")) {
		documentClasses.replace("light", "dark")
		return
	}
	if (theme === "light" && !documentClasses.contains("light")) {
		documentClasses.replace("dark", "light")
		return
	}
}
