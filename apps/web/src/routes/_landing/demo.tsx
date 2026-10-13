import { createFileRoute } from "@tanstack/react-router"
import CourseInstanceForm from "@/components/form/courses/CourseInstanceForm.tsx"
import { defaultValues } from "@/components/form/courses/types/types.ts"

export const Route = createFileRoute("/_landing/demo")({
	component: RouteComponent,
	ssr: false
})

function RouteComponent() {
	return (
		<main>
			<CourseInstanceForm
				mode={"edit"}
				defaultValues={defaultValues}
				isForDemo={true}
			/>
		</main>
	)
}
