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
			textColor: "text-primary-400",
			bgColor: "bg-[#E3F3F3]"
		},
		error: {
			nextToTextImg: "/error-svgrepo-com.svg",
			closeIcon: "/close-x-error.svg",
			textColor: "text-red-700",
			bgColor: "bg-[#D7D1D1]"
		},
		info: {
			nextToTextImg: "/info-circle-svgrepo-com.svg",
			closeIcon: "/close-x-info.svg",
			textColor: "text-blue-600",
			bgColor: "bg-[#DBDDEE]"
		}
	}
	let appliedStyles: string
	let nextToImgSrc: string
	let closeIconSrc: string
	if (type === "success") {
		appliedStyles = `${stylesObject.success.textColor} ${stylesObject.success.bgColor}`
		closeIconSrc = stylesObject.success.closeIcon
		nextToImgSrc = stylesObject.success.nextToTextImg
	} else if (type === "error") {
		appliedStyles = `${stylesObject.error.textColor} ${stylesObject.error.bgColor}`
		closeIconSrc = stylesObject.error.closeIcon
		nextToImgSrc = stylesObject.error.nextToTextImg
	} else {
		appliedStyles = `${stylesObject.info.textColor} ${stylesObject.info.bgColor}`
		closeIconSrc = stylesObject.info.closeIcon
		nextToImgSrc = stylesObject.info.nextToTextImg
	}
	return (
		<div
			className={`${appliedStyles} shadow-[0px_5px_2px_2px_rgba(0,0,0,0.25)] rounded-[40px] w-100 h-25 p-2 flex flex-col gap-2 ${shouldVanish ? "translate-x-[-125%]" : "toast-fade-in-animation"} duration-700 transition-all ease-in-out`}
			onTransitionEnd={(event) => {
				if (event.propertyName !== "transform") return
				removeToast(id)
			}}
		>
			<div className={"w-full  flex justify-end"}>
				<img
					src={closeIconSrc}
					alt="Botón para cerrar el toast"
					width={20}
					height={20}
					className={"mr-4 hover:scale-110 cursor-pointer"}
					onClick={() => setShouldVanish(true)}
				/>
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
