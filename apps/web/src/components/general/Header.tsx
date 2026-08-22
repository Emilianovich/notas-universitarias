import { Link } from "@tanstack/react-router"
import type { HeaderAndNavProps } from "@/components/general/Nav.tsx"

export default function Header({ children }: HeaderAndNavProps) {
	return (
		<header className={`sticky top-0 p-4 z-100 bg-tertiary`}>
			<div className={"relative flex justify-center items-center"}>
				{children}
			</div>
		</header>
	)
}

export function SettingsIcon() {
	return (
		<Link to={"/home/settings"}>
			<img
				src="/settings-icon.svg"
				alt="Icono para ir a las configuraciones"
				title={"Configuraciones"}
				className="hover:rotate-180 transition-all duration-700 ease-in-out w-8.75 sm:w-5 h-9.25 sm:h-5.5 lg:w-7.5 lg:h-8"
			/>
		</Link>
	)
}
