import { buildRequest } from "@notas-universitarias/helpers"
import type { LoginDTO } from "@notas-universitarias/types"
import { createFileRoute } from "@tanstack/react-router"
import ToastProvider from "@/components/context-providers/toast-provider.tsx"
import LoginForm from "@/components/form/login/LoginForm.tsx"
import Content from "@/components/general/Content"

export const Route = createFileRoute("/login")({
	component: RouteComponent
})

const handleLogin = async (dto: LoginDTO) => {
	return buildRequest<string, string>({
		method: "POST",
		includeCredentials: true,
		path: "/auth/login",
		reqBody: dto
	})
}

function RouteComponent() {
	return (
		<Content bodyClasses={"bg-secondary"}>
			<ToastProvider>
				<main className={"w-screen h-screen flex justify-center items-center"}>
					<LoginForm />
				</main>
			</ToastProvider>
		</Content>
	)
}

export default handleLogin
