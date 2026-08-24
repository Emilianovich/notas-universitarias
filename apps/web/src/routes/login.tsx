import { buildRequest } from "@notas-universitarias/helpers"
import type { LoginDTO } from "@notas-universitarias/types"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import ToastProvider from "@/components/context-providers/toast-provider.tsx"
import LoginForm from "@/components/form/login/LoginForm.tsx"
import Content from "@/components/general/Content"
import { baseUrl } from "@/routes/__root.tsx"

const redirectedSchema = z.object({
	wasRedirected: z.enum(["true"]).optional()
})

export const Route = createFileRoute("/login")({
	component: RouteComponent,
	ssr: false,
	head: () => ({
		meta: [
			{
				title: "Inicio de Sesión"
			}
		]
	}),
	validateSearch: redirectedSchema
})

const handleLogin = async (dto: LoginDTO) => {
	return buildRequest<string, string>({
		baseUrl,
		method: "POST",
		includeCredentials: true,
		path: "/auth/login",
		reqBody: dto
	})
}

function RouteComponent() {
	const { wasRedirected } = Route.useSearch()
	return (
		<Content bodyClasses={"bg-secondary"}>
			<ToastProvider>
				<main className={"w-screen h-screen flex justify-center items-center"}>
					<LoginForm wasRedirected={wasRedirected} />
				</main>
			</ToastProvider>
		</Content>
	)
}

export default handleLogin
