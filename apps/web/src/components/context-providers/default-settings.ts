import { type SettingsProviderProps, Spike } from "@/contexts/settings.ts"

const defaultSettings: SettingsProviderProps = {
	theme: "dark",
	pet: Spike,
	fontFamily: "Arima",
	disablePet: true
}

export default defaultSettings
