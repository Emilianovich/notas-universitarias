import type { ReactNode } from "react"
import useSettings from "@/contexts/settings.ts"

export type ContentProps = {
	bodyClasses: string
	children: ReactNode
}

export default function HomeContent({ bodyClasses, children }: ContentProps) {
	const { fontFamily } = useSettings()
	return (
		<body style={{ fontFamily }} className={bodyClasses}>
			{children}
		</body>
	)
}
