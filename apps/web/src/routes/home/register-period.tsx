import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/home/register-period")({
	component: RegisterPeriodPage
})

function RegisterPeriodPage() {
	return <div>Hi, from register period page!</div>
}
