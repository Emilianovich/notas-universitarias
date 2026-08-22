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
import LoadingComponent from "@/components/loading-components/current-period/LoadingComponent.tsx"
import IconButton from "@/components/ui/IconButton.tsx"
import authMiddleware from "@/middlewares/auth.ts"
import { queryClient } from "@/routes/__root.tsx"

const getUserHistory = async () => {
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
					<h1
						className={
							"sm:text-2xl lg:text-4xl 2xl:text-5xl font-bold text-primary-500 mt-10"
						}
					>
						Historial académico
					</h1>
					<section
						className={
							"flex flex-col items-center justify-center gap-10 md:w-full"
						}
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
			className={`flex flex-col items-center justify-center gap-10 sm:w-screen md:w-[90%] transition-all duration-300 ease-in-out`}
		>
			<div
				className={
					"grid grid-cols-4 sm:w-[90%] w-full  border-b border-primary-400"
				}
			>
				<h2
					className={
						"sm:text-sm lg:text-xl xl:text-2xl font-semibold col-span-2"
					}
				>
					{name}
				</h2>
				<button
					type={"button"}
					onClick={() => setIsFlipped(!isFlipped)}
					className={"inline-flex justify-center items-center col-span-2"}
				>
					<Triangle
						fill="currentColor"
						stroke="none"
						className={`${isFlipped ? "rotate-180" : "rotate-90"} hover:scale-95 cursor-pointer text-primary-400 sm:size-4 lg:size-6`}
					/>
				</button>
			</div>
			{isFlipped && renderedCourseInstances}
		</article>
	)
}

function CourseInstanceInHistory({
	name,
	finalGrade,
	_id
}: CourseInstancePresentation) {
	const [isLetterGrade, setIsLetterGrade] = useState(true)
	const computedFinalGrade = finalGrade * 100
	const presentationGrade =
		computedFinalGrade === 0 ? 0 : Number(computedFinalGrade.toFixed(2))
	const letterGrade = gradeToLetter(computedFinalGrade)
	const navigate = useNavigate({ from: "/home/history" })
	// TODO change the rounding method
	return (
		<div className={"grid grid-cols-4 justify-between items-center xl:w-[90%]"}>
			<div className={"flex items-center justify-center w-50 text-center"}>
				<p className={"sm:text-xs sm:max-w-[20ch] lg:text-base 2xl:text-xl"}>
					{name}
				</p>
			</div>
			<div className={"flex items-center justify-center"}>
				<p className={"sm:text-xs lg:text-base 2xl:text-xl"}>
					{isLetterGrade ? letterGrade : presentationGrade}
				</p>
			</div>
			<IconButton
				className={"sm:size-5 lg:size-7 2xl:size-10"}
				action={() => setIsLetterGrade(!isLetterGrade)}
				img={{
					src: "/refresh-cw.svg",
					alt: isLetterGrade
						? "Botón para cambiar la nota de letra a números"
						: "Botón para cambiar la nota de números a letras"
				}}
			/>
			<IconButton
				className={"sm:size-5 lg:size-7 2xl:size-10"}
				action={async () =>
					navigate({
						to: "/home/course-instance/edit/$courseInstanceId",
						params: { courseInstanceId: _id.toString() }
					})
				}
				img={{
					src: "/editing-pencil.svg",
					alt: "Botón para editar una materia"
				}}
			/>
		</div>
	)
}
