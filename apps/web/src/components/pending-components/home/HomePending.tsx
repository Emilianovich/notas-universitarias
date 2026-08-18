import { Loader2 } from "lucide-react"
import defaultSettings from "@/components/context-providers/default-settings.ts"
import useSettings from "@/contexts/settings.ts"

export default function HomePending() {
	return (
		<body className={"w-full h-screen bg-tertiary"}>
			<main
				className={"flex flex-col items-center justify-center h-full"}
				style={{
					fontFamily: useSettings()?.fontFamily ?? defaultSettings.fontFamily
				}}
			>
				<div
					className={
						"flex items-center justify-center text-primary-400 text-2xl"
					}
				>
					<Loader2 className={"mr-3 size-20 animate-spin text-primary-400"} />
				</div>
			</main>
		</body>
	)
}
