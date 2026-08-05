import { useEffect, useRef } from "react"

type ProgressBarProps = {
	progress: number
	barWidth: number
}

const computeProgressLevel = (percentage: number, barWidth: number): number => {
	return (barWidth * percentage) / 100
}

export default function ProgressBar({ progress, barWidth }: ProgressBarProps) {
	const ref = useRef<HTMLDivElement>(null)
	const newWidth = computeProgressLevel(progress, barWidth)
	useEffect(() => {
		if (newWidth > barWidth) return
		if (ref.current) {
			ref.current.style.width = `${newWidth}px`
		}
	}, [newWidth, barWidth])
	return (
		<div style={{ width: barWidth }} className={"h-5 absolute top-0"}>
			<div
				className={
					"rounded-[2.5px] h-4 bg-primary-300 w-0 transition-all duration-300 ease-in-out"
				}
				ref={ref}
			></div>
		</div>
	)
}
