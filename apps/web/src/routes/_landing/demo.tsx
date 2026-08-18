import type { UpdateCourseInstanceDto } from "@notas-universitarias/types"
import { createFileRoute } from "@tanstack/react-router"
import { UpdateCourseInstanceForm } from "@/components/form/courses/Update&Demo/UpdateCourseInstanceForm.tsx"

const defaultValues: UpdateCourseInstanceDto = {
	profesorName: "Tú mismo",
	breakdown: []
}

export const Route = createFileRoute("/_landing/demo")({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<main>
			<UpdateCourseInstanceForm
				defaultValues={defaultValues}
				isForDemo={true}
			/>
		</main>
	)
}
