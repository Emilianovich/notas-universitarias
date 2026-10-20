import type { LucideIcon } from "lucide-react"
import type { ComponentProps } from "react"

type SVGButtonProps = {
	btnClasses?: string
	Icon: LucideIcon
	svgProps: ComponentProps<"svg">
	action: () => Promise<void> | void
}
export default function SVGButton({
	btnClasses,
	Icon,
	svgProps,
	action
}: SVGButtonProps) {
	return (
		<button type={"button"} onClick={action} className={btnClasses}>
			<Icon {...svgProps} />
		</button>
	)
}
