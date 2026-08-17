import {
	buildRequest,
	gradeToLetter,
	isArrayEmpty
} from "@notas-universitarias/helpers"
import type {
	AcademicPeriodPresentation,
	CourseInstancePresentation
} from "@notas-universitarias/types"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Triangle } from "lucide-react"
import { useMemo, useState } from "react"
import ErrorComponent from "@/components/error-components/current-period/ErrorComponent.tsx"
import Button from "@/components/general/Button.tsx"
import LoadingComponent from "@/components/loading-components/current-period/LoadingComponent.tsx"
import authMiddleware from "@/middlewares/auth.ts"
import { queryClient } from "@/routes/__root.tsx"

const getUserHistory = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000))
	return await buildRequest<AcademicPeriodPresentation[], string>({
		method: "GET",
		path: "/academic-periods/history",
		includeCredentials: true
	})
}
const getHistoryQueryOpts = queryOptions({
	queryKey: ["userHistory"],
	queryFn: getUserHistory
})
export const Route = createFileRoute("/home/history")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Historial académico"
			}
		]
	}),
	server: {
		middleware: [authMiddleware]
	},
	loader: () => queryClient.ensureQueryData(getHistoryQueryOpts),
	pendingComponent: () => (
		<LoadingComponent text={"Cargando tu historial académico..."} />
	),
	errorComponent: () => (
		<ErrorComponent
			text={"Ocurrió un error al tratar de cargar tu historial académico"}
		/>
	)
})

function RouteComponent() {
	const { isSuccess, data } = useSuspenseQuery(getHistoryQueryOpts)
	return (
		<main
			className={
				"flex flex-col items-center justify-start gap-10 transition-all duration-300 ease-in-out"
			}
		>
			{isSuccess && isArrayEmpty(data.content) && (
				<section className={"w-full h-full flex justify-center items-center"}>
					<h1 className={"text-2xl text-primary-500"}>
						No tienes historial académico todavía
					</h1>
				</section>
			)}
			{isSuccess && data.content.length > 0 && (
				<>
					<h1 className={"text-4xl font-bold text-primary-500 mt-10"}>
						Historial académico
					</h1>
					<section
						className={"flex flex-col items-center justify-center gap-10 w-2/3"}
					>
						{data.content.map((academicPeriod) => (
							<AcademicPeriodContainer
								{...academicPeriod}
								key={academicPeriod._id.toString()}
							/>
						))}
					</section>
				</>
			)}
		</main>
	)
}

function AcademicPeriodContainer({
	name,
	courseInstances
}: AcademicPeriodPresentation) {
	const [isFlipped, setIsFlipped] = useState(false)
	const renderedCourseInstances = useMemo(
		() =>
			courseInstances.map((instance) => (
				<CourseInstanceInHistory
					_id={instance._id}
					name={instance.name}
					finalGrade={instance.finalGrade}
					key={instance._id.toString()}
				/>
			)),
		[courseInstances]
	)
	return (
		<article
			className={`flex flex-col items-center justify-center gap-10 w-[75%] transition-all duration-300 ease-in-out`}
		>
			<div className={"flex justify-between items-center w-full"}>
				<h2 className={"text-xl font-semibold"}>{name}</h2>
				<button type={"button"} onClick={() => setIsFlipped(!isFlipped)}>
					<Triangle
						size={24}
						fill="currentColor"
						stroke="none"
						className={`${isFlipped ? "rotate-180" : "rotate-90"} hover:scale-95 cursor-pointer text-primary-400`}
					/>
				</button>
			</div>
			{isFlipped && renderedCourseInstances}
		</article>
	)
}

// REVIEW: pensar en su quiero agregar un botón para ver la nota
function CourseInstanceInHistory({
	name,
	finalGrade,
	_id
}: CourseInstancePresentation) {
	const [isLetterGrade, setIsLetterGrade] = useState(false)
	const computedFinalGrade = finalGrade * 100
	const presentationGrade =
		computedFinalGrade === 0 ? 0 : Number(computedFinalGrade.toFixed(2))
	const letterGrade = gradeToLetter(computedFinalGrade)
	const navigate = useNavigate({ from: "/home/history" })
	// TODO change the rounding method
	return (
		<div className={"grid grid-cols-4 justify-evenly items-centers"}>
			<div className={"flex items-center justify-center w-50 text-center"}>
				<p>{name}</p>
			</div>
			<div className={"relative flex items-center justify-center"}>
				<p>{isLetterGrade ? presentationGrade : letterGrade}</p>
			</div>
			<Button
				text={isLetterGrade ? "Ver Notas en números" : "Ver nota en letras"}
				type={"button"}
				styleType={"secondary"}
				isDisabled={false}
				clickAction={() => setIsLetterGrade(!isLetterGrade)}
			/>
			<Button
				text={"Editar"}
				type={"button"}
				styleType={"secondary"}
				isDisabled={false}
				clickAction={async () =>
					navigate({
						to: "/home/course-instance/edit/$courseInstanceId",
						params: { courseInstanceId: _id.toString() }
					})
				}
			/>
		</div>
	)
}
