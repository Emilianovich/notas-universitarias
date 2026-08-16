import type { UpdateCourseInstanceDto } from "@notas-universitarias/types"
import { createFileRoute } from "@tanstack/react-router"
import ModalProvider from "@/components/context-providers/modal-provider.tsx"
import PetProvider from "@/components/context-providers/pet-provider"
import ToastProvider from "@/components/context-providers/toast-provider.tsx"
import { UpdateCourseInstanceForm } from "@/components/form/courses/Update&Demo/UpdateCourseInstanceForm.tsx"
import Content from "@/components/general/Content.tsx"
import Header from "@/components/general/Header"
import { Nav, NavOption, NavToOutside } from "@/components/general/Nav"

const defaultValues: UpdateCourseInstanceDto = {
	profesorName: "Tú mismo",
	breakdown: []
}

export const Route = createFileRoute("/demo")({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<ModalProvider>
			<ToastProvider>
				<PetProvider>
					<Content bodyClasses={"main-body"}>
						<Header>
							<Nav>
								<NavOption navigateTo={"/"} text={"Inicio"} />
								<NavOption navigateTo={"/demo"} text={"Demo"} />
								<NavToOutside
									href={"https://github.com/Emilianovich/notas-universitarias"}
									text="Repositorio"
								/>
							</Nav>
						</Header>
						<main>
							<UpdateCourseInstanceForm
								defaultValues={defaultValues}
								isForDemo={true}
							/>
						</main>
					</Content>
				</PetProvider>
			</ToastProvider>
		</ModalProvider>
	)
}
