import { createFileRoute, useNavigate } from "@tanstack/react-router"
import PetProvider from "@/components/context-providers/pet-provider.tsx"
import Button from "@/components/general/Button.tsx"
import Content from "@/components/general/Content.tsx"
import Header from "@/components/general/Header.tsx"
import { Nav, NavOption, NavToOutside } from "@/components/general/Nav.tsx"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
	const navigate = useNavigate({ from: "/" })
	return (
		<PetProvider>
			<Content bodyClasses={"main-body"}>
				<Header>
					<Nav>
						<NavOption navigateTo={"/"} text={"Inicio"} />
						<NavOption navigateTo={"/demo"} text={"Demo"} />
						<NavToOutside
							href={"https://github.com/Emilianovich/notas-universitarias"}
							text="Repositorio"
						/>
					</Nav>
				</Header>
				<main
					className={"flex flex-col items-center justify-evenly w-full h-full"}
				>
					<h1
						className={
							"text-5xl font-bold text-center max-w-[25ch] leading-normal"
						}
					>
						Tus notas e historial universitario en un solo lugar
					</h1>
					<p className={"text-2xl text-center max-w-[55ch] leading-loose"}>
						¿Cansado de llevar un Excel o correr al final del periodo académico
						para saber tus notas? Aquí sabrás exactamente cómo vas, en cualquier
						momento, sin fórmulas ni cálculos.
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
			</Content>
		</PetProvider>
	)
}
