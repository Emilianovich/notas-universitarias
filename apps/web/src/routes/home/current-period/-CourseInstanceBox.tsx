import { gradeToLetter, roundNumber } from "@notas-universitarias/helpers"

type CourseInstanceBoxProps = {
	courseInstanceId: string
	courseInstanceName: string
	courseInstanceGrade: number
	navigateTo: () => Promise<void>
}

export default function CourseInstanceBox({
	courseInstanceName,
	navigateTo,
	courseInstanceGrade
}: CourseInstanceBoxProps) {
	const letterGrade = gradeToLetter(courseInstanceGrade)
	return (
		<article
			className={
				"text-primary-500 cursor-pointer w-80 border border-primary-300 hover:scale-95 h-30 py-4 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] flex flex-col items-center justify-center gap-2 transition-all duration-300 ease-in-out"
			}
			onClick={navigateTo}
			title={`Curso de ${courseInstanceName}`}
		>
			<p className={"text-xl text-center"}>{courseInstanceName}</p>
			<p
				className={"text-primary-700 opacity-60"}
			>{`Nota actual: ${roundNumber({ number: courseInstanceGrade, amountOfDecimals: 2 })} - ${letterGrade}`}</p>
		</article>
	)
}
