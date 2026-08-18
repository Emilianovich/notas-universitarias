import { createFileRoute, Outlet } from "@tanstack/react-router"
import ModalProvider from "@/components/context-providers/modal-provider.tsx"
import PetProvider from "@/components/context-providers/pet-provider.tsx"
import SettingsProvider from "@/components/context-providers/settings-provider.tsx"
import ToastProvider from "@/components/context-providers/toast-provider.tsx"
import NotFound from "@/components/error-components/NotFound.tsx"
import HomeContent from "@/components/general/HomeContent.tsx"
import HomePending from "@/components/pending-components/home/HomePending.tsx";
import HomeHeader from "@/components/ui/HomeHeader.tsx";

export const Route = createFileRoute("/home")({
	component: RouteComponent,
	pendingComponent: () => <HomePending />,
	notFoundComponent: () => <NotFound isHome={true} />
})

function RouteComponent() {
	return (
		<SettingsProvider>
			<HomeContent bodyClasses={"main-body"}>
				<ToastProvider>
					<PetProvider>
						<ModalProvider>
							<HomeHeader />
							<Outlet />
						</ModalProvider>
					</PetProvider>
				</ToastProvider>
			</HomeContent>
		</SettingsProvider>
	)
}
