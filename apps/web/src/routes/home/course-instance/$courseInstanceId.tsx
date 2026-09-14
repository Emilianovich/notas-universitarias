import {
	BREAKDOWN_TABLE_TITLE_COURSE,
	COURSE_INSTANCE_CONTRIBUTION_GRAPH_TITLE,
	COURSE_INSTANCE_CONTRIBUTION_TITLE,
	LAB_BREAKDOWN_TABLE_TITLE_COURSE,
	LAB_CONTRIBUTION_GRAPH_TITLE,
	LAB_CONTRIBUTION_TITLE
} from "@notas-universitarias/types"
import { createFileRoute } from "@tanstack/react-router"
import { UserRound } from "lucide-react"
import { Suspense } from "react"
import BreakdownEntriesDetail from "@/components/course-instance-details/BreakdownEntriesDetail.tsx"
import GradeCard from "@/components/course-instance-details/GradeCard.tsx"
import ErrorMessage from "@/components/form/general/ErrorMessage.tsx"
import LoadingComponent from "@/components/loading-components/current-period/LoadingComponent.tsx"
import Table from "@/components/ui/table/Table.tsx"
import TableCellContainer from "@/components/ui/table/TableCellContainer.tsx"
import useCourseInstanceData from "@/hooks/useCourseInstanceData.ts"
import getCourseEvalFromBreakdowns, {
	getLabEvalFromBreakdowns
} from "@/utils/getCourseEvalFromBreakdowns.ts"

export const Route = createFileRoute("/home/course-instance/$courseInstanceId")(
	{
		component: RouteComponent
	}
)

function RouteComponent() {
	const id = Route.useParams().courseInstanceId
	const {
		courseInstance,
		courseName,
		error,
		courseInstanceGrade,
		profesorName
	} = useCourseInstanceData(id)
	const courseEvalData = getCourseEvalFromBreakdowns(courseInstance)
	const labData = getLabEvalFromBreakdowns(courseInstance)
	return (
		<main
			className={
				"flex flex-col items-start justify-center gap-20 transition-all duration-300 ease-in-out p-4"
			}
		>
			<Suspense
				fallback={
					<LoadingComponent text={"Cargando la información de la materia"} />
				}
			>
				{error ? (
					<ErrorMessage error={"No se encontró la materia especificada"} />
				) : (
					<>
						<section className={"flex justify-between items-center w-full"}>
							<article className={"flex flex-col gap-4"}>
								<h1 className={"text-4xl text-primary-500 mt-4 font-bold"}>
									{courseName}
								</h1>
								<div className={"flex gap-4"}>
									<UserRound className={"text-primary-300 size-5"} />
									<span
										className={"text-primary-600 text-sm"}
									>{`Prof. ${profesorName}`}</span>
								</div>
							</article>
							<div>
								<GradeCard rawGrade={courseInstanceGrade} />
							</div>
						</section>
						<section
							className={
								"flex flex-col gap-4 w-full items-center justify-center"
							}
						>
							<div className={"flex justify-start items-center w-full"}>
								<h2 className={"text-primary-700 text-2xl"}>
									{BREAKDOWN_TABLE_TITLE_COURSE}
								</h2>
							</div>
							<Table
								headerTitles={["Evaluación", "Porcentaje"]}
								tableBodyData={courseEvalData}
								renderTableBodyData={(data) => (
									<>
										<TableCellContainer isHeader={false} data={data.name} />
										<TableCellContainer
											isHeader={false}
											data={`${data.percentage.toString()}%`}
										/>
									</>
								)}
							/>
						</section>
						{labData && (
							<section
								className={
									"flex flex-col gap-4 w-full items-center justify-center"
								}
							>
								<div className={"flex justify-start items-center w-full"}>
									<h2 className={"text-primary-700 text-xl"}>
										{LAB_BREAKDOWN_TABLE_TITLE_COURSE}
									</h2>
								</div>
								<Table
									headerTitles={["Evaluación", "Porcentaje"]}
									tableBodyData={labData.labEvals}
									renderTableBodyData={(data) => (
										<>
											<TableCellContainer isHeader={false} data={data.name} />
											<TableCellContainer
												isHeader={false}
												data={`${data.percentage.toString()}%`}
											/>
										</>
									)}
								/>
							</section>
						)}
						<section className={"w-full flex flex-col gap-10"}>
							<h2 className={"text-primary-700 text-2xl"}>
								{COURSE_INSTANCE_CONTRIBUTION_GRAPH_TITLE}
							</h2>
							<h3 className={"text-primary-700 text-xl"}>
								{COURSE_INSTANCE_CONTRIBUTION_TITLE}
							</h3>
							<BreakdownEntriesDetail course={courseInstance} />
						</section>
						{labData && (
							<section className={"w-full flex flex-col gap-10"}>
								<h2 className={"text-primary-700 text-2xl"}>
									{LAB_CONTRIBUTION_GRAPH_TITLE}
								</h2>
								<h3 className={"text-primary-700 text-xl"}>
									{LAB_CONTRIBUTION_TITLE}
								</h3>
								<BreakdownEntriesDetail course={labData.labCourseInstance} />
							</section>
						)}
					</>
				)}
			</Suspense>
		</main>
	)
}
