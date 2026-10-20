import { ChevronUp } from "lucide-react"
import { type ReactNode, useState } from "react"
import SVGButton from "@/components/ui/SVGButton.tsx"

type BreakdownDropdownProps = {
	currentPercentage: number
	children: ReactNode
	addedClasses?: string
	percentageInCourse: number
	isLaboratory: boolean
}
export default function BreakdownDropdown({
	currentPercentage,
	children,
	addedClasses,
	percentageInCourse,
	isLaboratory
}: BreakdownDropdownProps) {
	const [isDroppedDown, setIsDroppedDown] = useState(true)
	const text =
		currentPercentage === 100
			? "✔ 100% asignado"
			: `Total ${currentPercentage} %`
	const title = isLaboratory
		? "Evaluación del curso de laboratorio"
		: "Evaluación del curso"
	return (
		<article
			className={`border border-primary-300 flex flex-col w-full rounded-3xl ${addedClasses}`}
		>
			<div className={"relative border rounded-3xl"}>
				<div
					className={`transition-all duration-300 ease-in-out ${isDroppedDown ? "rounded-t-3xl" : "rounded-3xl"} p-4 box-border bg-primary-300`}
				>
					<h2 className={"text-tertiary font-bold text-2xl"}>{title}</h2>
					<span
						className={"text-tertiary text-sm"}
					>{`Vale ${percentageInCourse} % de la nota final`}</span>
				</div>
				<div
					className={
						"flex justify-center gap-4 items-center absolute top-1/2 -translate-y-1/2 right-4"
					}
				>
					<div
						className={
							"text-center text-sm w-50 py-2 rounded-3xl bg-tertiary text-success"
						}
					>
						<span className={`text-success`}>{text}</span>
					</div>
					<SVGButton
						Icon={ChevronUp}
						svgProps={{
							className: `size-5 text-tertiary ${isDroppedDown ? "rotate-0" : "-rotate-180"} transition-all duration-300 ease-in-out`
						}}
						action={() => setIsDroppedDown(!isDroppedDown)}
					/>
				</div>
			</div>
			{isDroppedDown && <div className={"p-4"}>{children}</div>}
		</article>
	)
}
