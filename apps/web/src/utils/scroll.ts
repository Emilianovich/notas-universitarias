import type { RefObject } from "react"

export default function scrollTo(ref: RefObject<HTMLDivElement | null>) {
	requestAnimationFrame(() => {
		ref.current?.scrollIntoView({ behavior: "smooth" })
	})
}

export function scrollToElement(id: string) {
	const element = document.getElementById(id)
	if (!element) return
	requestAnimationFrame(() => {
		element.scrollIntoView({ behavior: "smooth" })
	})
}
