import { buildRequest } from "@notas-universitarias/helpers"
import type { CurrentAcademicPeriod } from "@notas-universitarias/types"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import ErrorComponent from "@/components/error-components/current-period/ErrorComponent.tsx"
import { CurrentPeriodPending } from "@/components/pending-components/current-period/CurrentPeriodPending.tsx"
import HomePending from "@/components/pending-components/home/HomePending.tsx"
import authMiddleware from "@/middlewares/auth.ts"
import { baseUrl } from "@/routes/__root.tsx"
import CourseInstancesContainer from "@/routes/home/current-period/-CourseInstancesContainer.tsx"

const getCurrentAcademicPeriod = async () => {
	return buildRequest<CurrentAcademicPeriod, string>({
		baseUrl,
		method: "GET",
		path: "/academic-periods",
		includeCredentials: true
	})
}
export const useGetCurrentAcademicPeriod = () =>
	useSuspenseQuery(getAcademicPeriodQueryOpts)

export const getAcademicPeriodQueryOpts = queryOptions({
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
	server: {
		middleware: [authMiddleware]
	},
	pendingComponent: () => <CurrentPeriodPending />,
	errorComponent: () => (
		<ErrorComponent
			text={
				"Ocurrió un error al buscar tu periodo académico actual. Intenta nuevamente"
			}
		/>
	)
})

function CurrentPeriodPage() {
	const { data } = useGetCurrentAcademicPeriod()
	return (
		<Suspense fallback={<HomePending />}>
			<main
				className={
					"relative flex flex-col items-center sm:justify-evenly lg:justify-center"
				}
			>
				<CourseInstancesContainer {...data.content} />
			</main>
		</Suspense>
	)
}
