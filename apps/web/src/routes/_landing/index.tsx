import { createFileRoute, useNavigate } from "@tanstack/react-router"
import Button from "@/components/general/Button.tsx"
import { TextEffect } from "@/components/motion-primitives/text-effect.tsx"

export const Route = createFileRoute("/_landing/")({
	component: RouteComponent
})

function RouteComponent() {
	const navigate = useNavigate({ from: "/" })
	return (
		<main className={"flex flex-col items-center justify-evenly w-full h-full"}>
			<TextEffect
				per={"char"}
				as={"h1"}
				className={"text-5xl font-bold text-center max-w-[25ch] leading-normal"}
			>
				Tus notas e historial universitario en un solo lugar
			</TextEffect>
			<p className={"text-2xl text-center max-w-[55ch] leading-loose"}>
				¿Cansado de llevar un Excel o correr al final del periodo académico para
				saber tus notas? Aquí sabrás exactamente cómo vas, en cualquier momento,
				sin fórmulas ni cálculos.
			</p>
			<section className={"w-full flex justify-center items-center gap-8"}>
				<Button
					text={"Crea tu cuenta"}
					type={"button"}
					styleType={"primary"}
					isDisabled={false}
					clickAction={async () => navigate({ to: "/register" })}
				/>
				<Button
					text={"Probar"}
					type={"button"}
					styleType={"secondary"}
					isDisabled={false}
					clickAction={async () => navigate({ to: "/demo" })}
				/>
			</section>
		</main>
	)
}
