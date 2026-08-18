import Header from "@/components/general/Header.tsx"
import { Nav, NavOption, NavToOutside } from "@/components/general/Nav.tsx"

export default function LandingHeader() {
	return (
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
	)
}
