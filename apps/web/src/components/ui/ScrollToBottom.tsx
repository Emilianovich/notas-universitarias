import { ArrowDown } from "lucide-react"
import type { RefObject } from "react"
import scrollTo from "@/utils/scroll.ts"

export function ScrollToBottom({
	ref
}: {
	ref: RefObject<HTMLDivElement | null>
}) {
	return (
		<ArrowDown
			className={
				"text-primary-600 fixed bottom-4 right-4  cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out"
			}
			onClick={() => {
				scrollTo(ref)
			}}
		/>
	)
}
