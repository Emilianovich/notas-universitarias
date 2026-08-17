import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/home/")({
	component: RouteComponent,
	beforeLoad: () => {
		throw redirect({ to: "/home/current-period" })
	}
})

function RouteComponent() {
	return <div>Hello "/home/"!</div>
}
