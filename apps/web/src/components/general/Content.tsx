import type { ReactNode } from "react"
import useSettings from "@/contexts/settings.ts"

export default function Content({ children }: { children: ReactNode }) {
	const { fontFamily } = useSettings()
	return <main style={{ fontFamily }}>{children}</main>
}
