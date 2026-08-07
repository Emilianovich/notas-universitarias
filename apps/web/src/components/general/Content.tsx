import type { FontFamily } from "@notas-universitarias/types"
import type { ContentProps } from "@/components/general/HomeContent.tsx"

export default function Content({ bodyClasses, children }: ContentProps) {
	const fontFamily: FontFamily = "Arima"
	return (
		<body style={{ fontFamily }} className={bodyClasses}>
			{children}
		</body>
	)
}
