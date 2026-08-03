import { createFileRoute, Outlet } from "@tanstack/react-router"
import ModalProvider from "@/components/context-providers/modal-provider.tsx"
import PetProvider from "@/components/context-providers/pet-provider.tsx"
import ToastProvider from "@/components/context-providers/toast-provider.tsx"
import Content from "@/components/general/Content.tsx"
import Header, { SettingsIcon } from "@/components/general/Header.tsx"
import { Nav, NavOption } from "@/components/general/Nav.tsx"

export const Route = createFileRoute("/home")({
	component: HomeLayout
})

function HomeLayout() {
	return (
		<ToastProvider>
			<PetProvider>
				<ModalProvider>
					<Content>
						<Header>
							<Nav>
								<NavOption
									navigateTo={"/home/current-period"}
									text={"Periodo actual"}
								/>
								<NavOption navigateTo={"/home/history"} text={"Historial"} />
								<NavOption
									navigateTo={"/home/register-period"}
									text={"Registrar periodo"}
								/>
							</Nav>
							<SettingsIcon />
						</Header>
						<Outlet />
					</Content>
				</ModalProvider>
			</PetProvider>
		</ToastProvider>
	)
}
