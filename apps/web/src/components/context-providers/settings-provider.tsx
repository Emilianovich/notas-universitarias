import { type ReactNode, useState } from "react"
import {
	SettingsContext,
	type SettingsContextProps,
	Spike
} from "@/contexts/settings.ts"

// TODO: you should be able to read files
export default function SettingsProvider({
	children
}: {
	children: ReactNode
}) {
	const [currentSettings, _setCurrentSettings] = useState<SettingsContextProps>(
		{ fontFamily: "Arima", pet: Spike, theme: "dark" }
	)
	return (
		<SettingsContext.Provider value={currentSettings}>
			{children}
		</SettingsContext.Provider>
	)
}
