import { type ReactNode, useState } from "react"

export function SettingsContainer({
	title,
	children
}: {
	title: string
	children: ReactNode
	btnText: string
	btnAction: () => Promise<void>
}) {
	const [disabled, setDisabled] = useState(true)
	const imgAlt = disabled
		? "Icono de un lápiz para habilitar la edición"
		: "Icono de un lápiz para cancelar la edición"
	const imgSrc = disabled ? "/editing-pencil.svg" : "/pencil-cancel-edit.svg"
	return (
		<section className={"ml-4 w-full flex flex-col gap-4 p-4"}>
			<div className={"flex gap-4 w-[20%]"}>
				<h2 className={"font-bold text-2xl"}>{title}</h2>
				<img
					alt={imgAlt}
					src={imgSrc}
					style={{ width: 30, height: 30 }}
					title={imgAlt}
					className={
						"cursor-pointer hover:scale-95 transition-all duration-300"
					}
					onClick={() => setDisabled(!disabled)}
				/>
			</div>
			<div
				inert={disabled}
				className={
					"flex flex-col gap-6 transition-all duration-300 ease-in-out"
				}
			>
				{children}
			</div>
		</section>
	)
}
