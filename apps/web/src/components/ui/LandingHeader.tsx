import { Link } from "@tanstack/react-router"
import defaultSettings from "@/components/context-providers/default-settings.ts"
import Header from "@/components/general/Header.tsx"
import { Nav, NavOption, NavToOutside } from "@/components/general/Nav.tsx"
import useLocalStorage from "@/hooks/localStorage.ts"

export default function LandingHeader() {
	const data = useLocalStorage()
	return (
		<Header>
			<div
				className={`sm:right-0 lg:right-8 absolute top-1/2 -translate-y-1/2`}
			>
				<Link
					to={"/login"}
					className={
						"sm:text-sm lg:text-base hover:underline hover:text-primary-400"
					}
					style={{ fontFamily: data?.fontFamily ?? defaultSettings.fontFamily }}
				>
					Iniciar sesión
				</Link>
			</div>
			<Nav fontFamily={data?.fontFamily}>
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
