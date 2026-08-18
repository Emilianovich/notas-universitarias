// import { stringSlicer } from "@notas-universitarias/helpers"

type CourseInstanceBoxProps = {
	courseInstanceId: string
	courseInstanceName: string
	navigateTo: () => Promise<void>
}

export default function CourseInstanceBox({
	courseInstanceName,
	navigateTo
}: CourseInstanceBoxProps) {
	return (
		<article
			className={
				"cursor-pointer w-80 border border-primary-300 hover:scale-95 h-30 py-4 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] flex items-center justify-center transition-all duration-300 ease-in-out"
			}
			onClick={navigateTo}
			title={`Curso de ${courseInstanceName}`}
		>
			<p className={"text-xl text-center"}>{courseInstanceName}</p>
		</article>
	)
}
