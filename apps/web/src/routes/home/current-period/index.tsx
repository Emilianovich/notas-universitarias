import { buildRequest } from "@notas-universitarias/helpers"
import type { CurrentAcademicPeriod } from "@notas-universitarias/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import ErrorComponent from "@/components/error-components/current-period/ErrorComponent.tsx"
import LoadingComponent from "@/components/loading-components/current-period/LoadingComponent.tsx"
import authMiddleware from "@/middlewares/auth.ts"
import CourseInstancesContainer from "@/routes/home/current-period/-CourseInstancesContainer.tsx"

const getCurrentAcademicPeriod = async () => {
	return buildRequest<CurrentAcademicPeriod, string>({
		method: "GET",
		path: "/academic-periods",
		includeCredentials: true
	})
}
export const useGetCurrentAcademicPeriod = () =>
	useSuspenseQuery({
		queryKey: ["currentAcademicPeriod"],
		queryFn: () => getCurrentAcademicPeriod()
	})

export const Route = createFileRoute("/home/current-period/")({
	component: CurrentPeriodPage,
	head: () => ({
		meta: [
			{
				title: "Periodo académico actual"
			}
		]
	}),
	ssr: true,
	server: {
		middleware: [authMiddleware]
	}
})

function CurrentPeriodPage() {
	const { data, isPending, isError, isSuccess } = useGetCurrentAcademicPeriod()
	return (
		<main className={"flex flex-col items-center justify-center"}>
			{isPending && (
				<LoadingComponent text={"Cargando tu periodo académico actual..."} />
			)}
			{isError && (
				<ErrorComponent
					text={
						"Ocurrió un error al buscar tu periodo académico actual. Intenta nuevamente"
					}
				/>
			)}
			{isSuccess && <CourseInstancesContainer {...data.content} />}
		</main>
	)
}
