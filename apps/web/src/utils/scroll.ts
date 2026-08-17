import type { RefObject } from "react"

export default function scrollTo(ref: RefObject<HTMLDivElement | null>) {
	requestAnimationFrame(() => {
		ref.current?.scrollIntoView({ behavior: "smooth" })
	})
}
