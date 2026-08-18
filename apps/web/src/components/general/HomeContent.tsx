import type { ReactNode } from "react"
import defaultSettings from "@/components/context-providers/default-settings.ts"
import useSettings from "@/contexts/settings.ts"

export type ContentProps = {
	bodyClasses: string
	children: ReactNode
}

export default function HomeContent({ bodyClasses, children }: ContentProps) {
	return (
		<body
			style={{
				fontFamily: useSettings()?.fontFamily ?? defaultSettings.fontFamily
			}}
			className={bodyClasses}
		>
			{children}
		</body>
	)
}
