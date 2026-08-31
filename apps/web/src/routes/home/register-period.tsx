import { createFileRoute } from "@tanstack/react-router"
import ErrorComponent from "@/components/error-components/current-period/ErrorComponent.tsx"
import AcademicPeriodForm from "@/components/form/academic-periods/create/AcademicPeriodForm.tsx"
import LoadingComponent from "@/components/loading-components/current-period/LoadingComponent.tsx"
import authMiddleware from "@/middlewares/auth.ts"
import { useGetCurrentAcademicPeriod } from "@/routes/home/current-period"

export const Route = createFileRoute("/home/register-period")({
	component: RegisterPeriodPage,
	head: () => ({
		meta: [
			{
				title: "Registrar periodo académico"
			}
		]
	}),
	server: {
		middleware: [authMiddleware]
	},
	pendingComponent: () => <LoadingComponent text={"Cargando contenido..."} />,
	errorComponent: () => (
		<ErrorComponent
			text={
				"Ocurrió un error al cargar el formulario para registrar un nuevo periodo académico"
			}
		/>
	)
})

function RegisterPeriodPage() {
	const { data, isSuccess } = useGetCurrentAcademicPeriod()
	return (
		<main className={"flex flex-col justify-center items-center w-full gap-8"}>
			{isSuccess && data.content.isActive && (
				<h1 className={"text-center sm:text-base lg:text-2xl text-primary-500"}>
					El periodo académico actual tiene que finalizar para registrar uno
					nuevo
				</h1>
			)}
			{isSuccess && !data.content.isActive && (
				<>
					<h1
						className={
							"sm:text-2xl sm:mt-2 lg:text-3xl lg:mt-0 text-4xl font-bold text-center text-primary-500"
						}
					>
						Registrar nuevo periodo académico
					</h1>
					<AcademicPeriodForm />
				</>
			)}
		</main>
	)
}
