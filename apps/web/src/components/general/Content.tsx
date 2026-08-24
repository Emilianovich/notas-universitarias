import defaultSettings from "@/components/context-providers/default-settings.ts"
import type { ContentProps } from "@/components/general/HomeContent.tsx"
import useLocalStorage from "@/hooks/localStorage.ts"

export default function Content({ bodyClasses, children }: ContentProps) {
	const persistentData = useLocalStorage()
	const fontFamily =
		typeof window !== "undefined"
			? (persistentData?.fontFamily ?? defaultSettings.fontFamily)
			: defaultSettings.fontFamily
	return (
		<body style={{ fontFamily }} className={bodyClasses}>
			{children}
		</body>
	)
}
