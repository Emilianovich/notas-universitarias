import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import useModal from "@/contexts/modal.ts"
import useToast from "@/contexts/toast.ts"
import { baseUrl, queryClient } from "@/routes/__root.tsx"

const handleLogout = async () => {
	return buildRequest<string, string>({
		baseUrl,
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
				content: "Redirigiendo a la página principal..."
			})
			setTimeout(async () => {
				await navigate({ to: "/" })
				queryClient.clear()
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
				"cursor-pointer w-8.75 sm:w-5 h-9.25 sm:h-5.5 lg:w-7.5 lg:h-8 hover:scale-110 transition-all duration-300 ease-in-out"
			}
			onClick={() => {
				buildModal({
					modalTitle: "Cerrar sesión",
					modalContent: "¿Está seguro que quiere cerrar la sesión?",
					closeButtonTitle: "Quedarme",
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
