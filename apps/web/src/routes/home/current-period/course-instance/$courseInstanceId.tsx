import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
	"/home/current-period/course-instance/$courseInstanceId"
)({
	component: RouteComponent
})

function RouteComponent() {
	return <div>Hello "/home/current-period/$courseInstanceId"!</div>
}
