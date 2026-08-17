import { createFileRoute, Outlet } from "@tanstack/react-router"
import ModalProvider from "@/components/context-providers/modal-provider.tsx"
import PetProvider from "@/components/context-providers/pet-provider.tsx"
import SettingsProvider from "@/components/context-providers/settings-provider.tsx"
import ToastProvider from "@/components/context-providers/toast-provider.tsx"
import Header, { SettingsIcon } from "@/components/general/Header.tsx"
import HomeContent from "@/components/general/HomeContent.tsx"
import { Nav, NavOption } from "@/components/general/Nav.tsx"
import LogoutIcon from "@/components/ui/LogoutIcon.tsx"

export const Route = createFileRoute("/home")({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<SettingsProvider>
			<HomeContent bodyClasses={"main-body"}>
				<ToastProvider>
					<PetProvider>
						<ModalProvider>
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
								<div
									className={
										"absolute right-8 top-1/2 -translate-y-1/2 w-fit h-fit flex gap-4"
									}
								>
									<LogoutIcon />
									<SettingsIcon />
								</div>
							</Header>
							<Outlet />
						</ModalProvider>
					</PetProvider>
				</ToastProvider>
			</HomeContent>
		</SettingsProvider>
	)
}
