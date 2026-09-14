import { useEffect } from "react"

export default function useThemeOnInitialLoad() {
	useEffect(() => {
		// Get theme from localStorage. If null fallback to user system preferences, set localStorage with theme
		const userSystemTheme = window.matchMedia("(prefers-color-scheme: dark)")
			.matches
			? "dark"
			: "light"
		const theme = localStorage.getItem("theme") ?? userSystemTheme
		localStorage.setItem("theme", theme)
		const documentClasses = document.documentElement.classList
		documentClasses.add(theme)
	}, [])
}
