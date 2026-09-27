import { gradeToLetter, roundNumber } from "@notas-universitarias/helpers"
import {
	CTX_MENU_EDIT_COURSE,
	CTX_MENU_SEE_PROGRESS_TEXT
} from "@notas-universitarias/types"
import { useNavigate } from "@tanstack/react-router"
import { ChartNoAxesColumnDecreasing, Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import ContextMenu from "@/components/ui/tooltip/ContextMenu.tsx"

type CourseInstanceBoxProps = {
	courseInstanceId: string
	courseInstanceName: string
	courseInstanceGrade: number
}

export default function CourseInstanceBox({
	courseInstanceName,
	courseInstanceGrade,
	courseInstanceId
}: CourseInstanceBoxProps) {
	const [ctxMenuState, setCtxMenuState] = useState({
		show: false,
		positionX: 0,
		positionY: 0
	})
	const ctxMenuId = "ctx-menu"
	const letterGrade = gradeToLetter(courseInstanceGrade)
	const navigate = useNavigate({ from: "/home/current-period/" })
	useEffect(() => {
		const ctxMenu = document.getElementById(ctxMenuId)
		if (!ctxMenu) return
		const handleCtxMenu = (e: MouseEvent) => {
			if (ctxMenu.contains(e.target as Node)) return
			setCtxMenuState({ ...ctxMenuState, show: false })
		}
		document.addEventListener("click", handleCtxMenu)
		return () => {
			document.removeEventListener("click", handleCtxMenu)
		}
	}, [ctxMenuState])
	return (
		<>
			<article
				className={
					"text-primary-500 cursor-context-menu w-80 border border-primary-300 h-30 py-4 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] flex flex-col items-center justify-center gap-2 transition-all duration-300 ease-in-out"
				}
				title={`Curso de ${courseInstanceName}`}
				onContextMenu={(event) => {
					event.preventDefault()
					setCtxMenuState({
						show: true,
						positionX: event.pageX,
						positionY: event.pageY
					})
				}}
			>
				<p className={"text-xl text-center"}>{courseInstanceName}</p>
				<p
					className={"text-primary-700 opacity-60"}
				>{`Nota actual: ${roundNumber({ number: courseInstanceGrade, amountOfDecimals: 2 })} - ${letterGrade}`}</p>
			</article>
			{ctxMenuState.show && (
				<ContextMenu
					opts={[
						{
							text: CTX_MENU_SEE_PROGRESS_TEXT,
							navigateTo: () =>
								navigate({
									to: "/home/course-instance/$courseInstanceId",
									params: { courseInstanceId }
								}),
							icon: ChartNoAxesColumnDecreasing
						},
						{
							text: CTX_MENU_EDIT_COURSE,
							navigateTo: () =>
								navigate({
									to: "/home/course-instance/edit/$courseInstanceId",
									params: { courseInstanceId }
								}),
							icon: Pencil
						}
					]}
					id={ctxMenuId}
					cursorLocation={{
						x: ctxMenuState.positionX,
						y: ctxMenuState.positionY
					}}
				/>
			)}
		</>
	)
}
