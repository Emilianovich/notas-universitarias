import { gradeToLetter, roundNumber } from "@notas-universitarias/helpers"
import EmojiForGrade from "@/components/course-instance-details/EmojiForGrade.tsx"

export default function GradeCard({ rawGrade }: { rawGrade: number }) {
	const grade = roundNumber({ number: rawGrade * 100, amountOfDecimals: 2 })
	const letterGrade = gradeToLetter(grade)
	return (
		<div
			className={
				"bg-form-bg w-60 p-4 flex flex-col justify-start items-center gap-4 rounded-[10px] shadow-[0_0_4px_rgba(0,0,0,0.25)]"
			}
		>
			<div className={"w-full"}>
				<h4 className={"text-primary-600 text-base"}>Nota actual</h4>
			</div>
			<div className={"w-full flex gap-4 items-center justify-between"}>
				<div>
					<h2
						className={"text-primary-500 font-bold sm:text-2xl lg:text-3xl"}
					>{`${grade} - ${letterGrade}`}</h2>
				</div>
				<EmojiForGrade letterGrade={letterGrade} />
			</div>
		</div>
	)
}
