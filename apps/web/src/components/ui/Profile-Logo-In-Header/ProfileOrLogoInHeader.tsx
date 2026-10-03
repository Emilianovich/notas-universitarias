import { useNavigate } from "@tanstack/react-router"
import IconButton from "@/components/ui/IconButton.tsx"
import useModal from "@/contexts/modal.ts"
import GenericModalContentCtn from "@/components/ui/modal/GenericModalContentCtn.tsx";

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
	const { buildModal } = useModal()
	const navigate = useNavigate()
	const action = async () => navigate({
			to: src === "/profile.svg" ? "/home/settings" : "/"
		})
return (
		<div className={`absolute ${direction}-8 top-1/2 -translate-y-1/2`}>
			<IconButton
				className={className}
				action={() => {
					buildModal({
						modalTitle: "Navegar a la landing page",
						Content: <GenericModalContentCtn
									text={"Irás a la landing page. Para regresar tu perfil agrega /home/settings al final de tu URL actual"}
									closeBtnTitle={"No navegar"}
									confirmButton={{
										text: "Navegar",
										type: "button",
										styleType: "primary",
										action,
									}}
								/>
					})
				}}
				img={{
					alt,
					src
				}}
			/>
		</div>
	)
}
//
