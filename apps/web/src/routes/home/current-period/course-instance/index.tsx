import { createFileRoute } from "@tanstack/react-router"
import CreateCourseInstanceForm from "@/components/form/courses/Create/CreateCourseInstanceForm.tsx"

export const Route = createFileRoute("/home/current-period/course-instance/")({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<main className={"flex flex-col justify-start items-center gap-4"}>
			<h1 className={"text-4xl text-primary-600 mt-4"}>Registra una materia</h1>
			<CreateCourseInstanceForm />
		</main>
	)
}
