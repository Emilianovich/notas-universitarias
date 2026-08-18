import { Link } from "@tanstack/react-router"

type NotFoundPageProps = {
	isHome: boolean
}

export default function NotFound({ isHome }: NotFoundPageProps) {
	return (
		<main className={"flex flex-col items-center justify-evenly w-full"}>
			<img
				alt={"Imagen de las mascotas viendo"}
				src={"/404-image.png"}
				style={{ aspectRatio: "4 / 3" }}
				className={"w-[40%]"}
			/>
			<div className={"flex flex-col items-center justify-center gap-4"}>
				<h1 className={"text-4xl text-primary-600 font-bold"}>Oops!</h1>
				<p>
					La página que buscas no existe. Echa para atrás o dirígete a la{" "}
					<Link
						to={isHome ? "/home/current-period" : "/"}
						className={
							"text-primary-300 hover:scale-110 transition-all duration-300 ease-in-out hover:underline"
						}
					>
						página principal
					</Link>
				</p>
			</div>
		</main>
	)
}
