import { createFileRoute, Outlet } from "@tanstack/react-router"
import ModalProvider from "@/components/context-providers/modal-provider.tsx"
import PetProvider from "@/components/context-providers/pet-provider.tsx"
import ToastProvider from "@/components/context-providers/toast-provider.tsx"
import NotFound from "@/components/error-components/NotFound.tsx"
import Content from "@/components/general/Content.tsx"
import LandingHeader from "@/components/ui/LandingHeader.tsx"

export const Route = createFileRoute("/_landing")({
	component: RouteComponent,
	notFoundComponent: () => <NotFound isHome={false} />
})

function RouteComponent() {
	return (
		<Content bodyClasses={"main-body"}>
			<ModalProvider>
				<ToastProvider>
					<PetProvider>
						<LandingHeader />
						<Outlet />
					</PetProvider>
				</ToastProvider>
			</ModalProvider>
		</Content>
	)
}
