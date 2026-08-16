import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import useModal from "@/contexts/modal.ts"
import useToast from "@/contexts/toast.ts"

const handleLogout = async () => {
	return buildRequest<string, string>({
		method: "DELETE",
		includeCredentials: true,
		path: "/auth/logout"
	})
}

export default function LogoutIcon() {
	const { buildToast } = useToast()
	const { buildModal, closeModal } = useModal()
	// TODO: find a way to get current URL
	const navigate = useNavigate({ from: "/login" })
	const mutation = useMutation({
		mutationFn: handleLogout,
		onError: (error) => {
			if (error instanceof ServerErrorRes) {
				console.error(error.errors)
				buildToast({
					id: Date.now(),
					type: "error",
					content: error.errors
				})
			}
		},
		onSuccess: async () => {
			closeModal()
			buildToast({
				id: Date.now(),
				type: "info",
				content: "Redirigiendo al login..."
			})
			setTimeout(async () => {
				await navigate({ to: "/login" })
			}, 1000)
		}
	})
	const { mutate } = mutation
	return (
		<img
			src={"/logout.svg"}
			alt={"Icono para cerrar sesión"}
			title={"Cerrar sesión"}
			className={
				"cursor-pointer w-8.75 h-[37.06px] hover:scale-110 transition-all duration-300 ease-in-out"
			}
			onClick={() => {
				buildModal({
					modalTitle: "Cerrar sesión",
					modalContent: "¿Está seguro que quiere cerrar la sesión?",
					closeButtonTitle: "No, quiero quedarme un rato",
					confirmButton: {
						text: "Sí, cerrar sesión",
						type: "primary",
						action: () => mutate()
					}
				})
			}}
		/>
	)
}
