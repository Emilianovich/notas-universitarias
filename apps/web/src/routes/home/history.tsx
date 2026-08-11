import { createFileRoute } from "@tanstack/react-router"
import authMiddleware from "@/middlewares/auth.ts"

export const Route = createFileRoute("/home/history")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Historial académico"
			}
		]
	}),
	server: {
		middleware: [authMiddleware]
	}
})

function RouteComponent() {
	return <div>Greetings and salutations</div>
}
