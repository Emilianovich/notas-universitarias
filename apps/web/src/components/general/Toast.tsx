import { X } from "lucide-react"
import { useEffect, useState } from "react"
import type { ToastProps } from "@/contexts/toast.ts"

export default function Toast({ type, content, removeToast, id }: ToastProps) {
	const [shouldVanish, setShouldVanish] = useState(false)
	useEffect(() => {
		const vanishTimeout = setTimeout(() => {
			setShouldVanish(true)
		}, 3000)
		return () => {
			clearTimeout(vanishTimeout)
		}
	}, [])
	const stylesObject = {
		success: {
			nextToTextImg: "/checkmark-circle-svgrepo-com.svg",
			closeIcon: "/close-x-success.svg",
			textColor: "text-success",
			bgColor: "bg-success-bg"
		},
		error: {
			nextToTextImg: "/error-svgrepo-com.svg",
			closeIcon: "/close-x-error.svg",
			textColor: "text-error",
			bgColor: "bg-error-bg"
		},
		info: {
			nextToTextImg: "/info-circle-svgrepo-com.svg",
			closeIcon: "/close-x-info.svg",
			textColor: "text-info",
			bgColor: "bg-info-bg"
		}
	}
	let appliedStyles: string
	let nextToImgSrc: string
	let textColor: string
	if (type === "success") {
		textColor = stylesObject.success.textColor
		appliedStyles = `${stylesObject.success.textColor} ${stylesObject.success.bgColor}`
		nextToImgSrc = stylesObject.success.nextToTextImg
	} else if (type === "error") {
		textColor = stylesObject.error.textColor
		appliedStyles = `${stylesObject.error.textColor} ${stylesObject.error.bgColor}`
		nextToImgSrc = stylesObject.error.nextToTextImg
	} else {
		textColor = stylesObject.info.textColor
		appliedStyles = `${stylesObject.info.textColor} ${stylesObject.info.bgColor}`
		nextToImgSrc = stylesObject.info.nextToTextImg
	}
	return (
		<div
			className={`${appliedStyles} shadow-[0px_5px_2px_2px_rgba(0,0,0,0.25)] rounded-[40px] w-100 h-25 p-2 flex flex-col gap-2 ${shouldVanish ? "translate-x-[-125%]" : "toast-fade-in-animation"} duration-700 transition-all ease-in-out`}
			onTransitionEnd={(event) => {
				if (event.propertyName === "translate") {
					removeToast(id)
				}
			}}
		>
			<div className={"w-full  flex justify-end"}>
				<X
					role="button"
					className={`size-5 mr-4 hover:scale-110 cursor-pointer ${textColor}`}
					onClick={() => setShouldVanish(true)}
				>
					<title>{"Botón para cerrar el toast"}</title>
				</X>
			</div>
			<div className={"flex gap-4 h-fit"}>
				<img
					src={nextToImgSrc}
					alt="Imagen ilustrativa para el toast"
					width={20}
					height={20}
				/>
				<p className={"text-sm"}>{content}</p>
			</div>
		</div>
	)
}
