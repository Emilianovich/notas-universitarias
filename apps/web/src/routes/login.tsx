import { buildRequest } from "@notas-universitarias/helpers"
import {loginDTO, type LoginDTO, createSuccessApiRes} from "@notas-universitarias/types"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import ToastProvider from "@/components/context-providers/toast-provider.tsx"
import LoginForm from "@/components/form/login/LoginForm.tsx"
import Content from "@/components/general/Content"
import { baseUrl } from "@/routes/__root.tsx"
import RequestBuilder from "@/lib/builder.ts";

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

export const testLogin = async (dto: LoginDTO) => {
	const reqBuilder = new RequestBuilder<ReturnType<typeof createSuccessApiRes>>

	("/auth/login", createSuccessApiRes<z._ZodNumber>(z.number("The response should be of type string")))

			return reqBuilder
				.includesBody(true)
				.method("POST")
				.includesCredentials(true)
				.body(loginDTO, dto)
				.build()
				.sendRequest()
}
const handleLogin = async (dto: LoginDTO) => {
	return testLogin(dto)
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
