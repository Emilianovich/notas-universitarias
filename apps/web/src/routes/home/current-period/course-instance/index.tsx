import { createFileRoute } from "@tanstack/react-router"
import CreateCourseInstanceForm from "@/components/form/courses/CreateCourseInstanceForm.tsx"

export const Route = createFileRoute("/home/current-period/course-instance/")({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<main className={"flex flex-col justify-center items-center gap-4"}>
			<CreateCourseInstanceForm />
		</main>
	)
}
