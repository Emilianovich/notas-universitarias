import ErrorComponent from "@/components/error-components/current-period/ErrorComponent.tsx"
import HomeContent from "@/components/general/HomeContent.tsx"
import LandingHeader from "@/components/ui/LandingHeader.tsx"

export function ErrorPage() {
	return (
		<HomeContent bodyClasses={"main-body"}>
			<LandingHeader />
			<ErrorComponent
				text={"Ocurrió un error. Asegúrate haber iniciado sesión"}
			/>
		</HomeContent>
	)
}
