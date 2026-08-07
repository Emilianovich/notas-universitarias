import { Link } from "@tanstack/react-router"
import type { HeaderAndNavProps } from "@/components/general/Nav.tsx"

export default function Header({ children }: HeaderAndNavProps) {
	return (
		<header className={`relative flex justify-center items-center p-4`}>
			{children}
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
				className="hover:rotate-180 transition-all duration-700 ease-in-out"
				width={35}
				height={37.06}
			/>
		</Link>
	)
}
