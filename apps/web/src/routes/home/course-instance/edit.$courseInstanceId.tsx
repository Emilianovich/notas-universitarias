import { buildRequest } from "@notas-universitarias/helpers"
import type { CourseInstanceForEdit } from "@notas-universitarias/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { UpdateCourseInstanceForm } from "@/components/form/courses/Update&Demo/UpdateCourseInstanceForm.tsx"
import ErrorMessage from "@/components/form/general/ErrorMessage.tsx"
import LoadingComponent from "@/components/loading-components/current-period/LoadingComponent.tsx"
import { baseUrl } from "@/routes/__root.tsx"

export const getCourseInstance = async (id: string) => {
	return buildRequest<CourseInstanceForEdit, string>({
		baseUrl,
		method: "GET",
		path: `/course-instances/${id}`,
		includeCredentials: true
	})
}

export const Route = createFileRoute(
	"/home/course-instance/edit/$courseInstanceId"
)({
	component: RouteComponent
})

function RouteComponent() {
	const id = Route.useParams().courseInstanceId
	const { data, error } = useSuspenseQuery({
		queryKey: ["getCourseInstanceForEdit", id],
		queryFn: () => getCourseInstance(id)
	})
	const { courseInstance, courseName } = data.content
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
						<UpdateCourseInstanceForm
							defaultValues={courseInstance}
							isForDemo={false}
							courseInstanceId={id}
						/>
					</>
				)}
			</Suspense>
		</main>
	)
}
