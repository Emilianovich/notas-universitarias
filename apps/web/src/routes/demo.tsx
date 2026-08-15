import { createFileRoute } from "@tanstack/react-router"
import Content from "@/components/general/Content.tsx";
import {UpdateCourseInstanceForm} from "@/components/form/courses/Update&Demo/UpdateCourseInstanceForm.tsx";
import type {UpdateCourseInstanceDto} from "@notas-universitarias/types";
import ModalProvider from "@/components/context-providers/modal-provider.tsx";
import ToastProvider from "@/components/context-providers/toast-provider.tsx";

const defaultValues : UpdateCourseInstanceDto = {
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
				<Content bodyClasses={"main-body"}>
					<UpdateCourseInstanceForm defaultValues={defaultValues} isForDemo={true} />
				</Content>
			</ToastProvider>
		</ModalProvider>
	)
}
