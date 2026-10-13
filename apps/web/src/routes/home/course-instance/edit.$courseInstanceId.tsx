import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import CourseInstanceForm from "@/components/form/courses/CourseInstanceForm.tsx"
import ErrorMessage from "@/components/form/general/ErrorMessage.tsx"
import LoadingComponent from "@/components/loading-components/current-period/LoadingComponent.tsx"
import useCourseInstanceData from "@/hooks/useCourseInstanceData.ts"

export const Route = createFileRoute(
	"/home/course-instance/edit/$courseInstanceId"
)({
	component: RouteComponent
})

function RouteComponent() {
	const id = Route.useParams().courseInstanceId
	const { courseInstance, courseName, error } = useCourseInstanceData(id)
	return (
		<main
			className={
				"flex flex-col items-center justify-center gap-10 transition-all duration-300 ease-in-out p-4"
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
						<h1 className={"text-4xl text-primary-500 mt-4"}>{courseName}</h1>
						<CourseInstanceForm
							defaultValues={courseInstance}
							isForDemo={false}
							courseInstanceId={id}
							mode={"edit"}
						/>
					</>
				)}
			</Suspense>
		</main>
	)
}
