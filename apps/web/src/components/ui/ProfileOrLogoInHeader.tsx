import { useNavigate } from "@tanstack/react-router"
import IconButton from "@/components/ui/IconButton.tsx"

export type ProfileOrLogoInHeaderProps =
	| {
			src: "/logo.png"
			alt: "Logo de Notas Universitarias"
			direction: "left"
			className: string
	  }
	| {
			src: "/profile.svg"
			alt: "Icono para redirigir el usuario al perfil"
			direction: "right"
			className: string
	  }

export function ProfileOrLogoInHeader({
	src,
	alt,
	direction,
	className
}: ProfileOrLogoInHeaderProps) {
	const navigate = useNavigate()
	return (
		<div className={`absolute ${direction}-8 top-1/2 -translate-y-1/2`}>
			<IconButton
				className={className}
				action={async () =>
					navigate({ to: src === "/profile.svg" ? "/home/settings" : "/" })
				}
				img={{
					alt,
					src
				}}
			/>
		</div>
	)
}
