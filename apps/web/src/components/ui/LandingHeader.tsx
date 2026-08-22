import Header from "@/components/general/Header.tsx"
import { Nav, NavOption, NavToOutside } from "@/components/general/Nav.tsx"
import { ProfileOrLogoInHeader } from "@/components/ui/ProfileOrLogoInHeader.tsx"

export default function LandingHeader() {
	return (
		<Header>
			<ProfileOrLogoInHeader
				src={"/profile.svg"}
				direction={"right"}
				alt={"Icono para redirigir el usuario al perfil"}
				className={"size-10"}
			/>
			<Nav>
				<NavOption navigateTo={"/"} text={"Inicio"} />
				<NavOption navigateTo={"/demo"} text={"Demo"} />
				<NavToOutside
					href={"https://github.com/Emilianovich/notas-universitarias"}
					text="Repositorio"
				/>
			</Nav>
		</Header>
	)
}
