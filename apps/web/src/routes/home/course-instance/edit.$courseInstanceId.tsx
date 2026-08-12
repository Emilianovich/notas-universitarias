import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
	"/home/course-instance/edit/$courseInstanceId"
)({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<div>
			Hello "/home/current-period/course-instance/edit/$courseInstanceId"!
		</div>
	)
}
