import type {
	CurrentAcademicPeriod,
	CurrentAcademicPeriodSubjects
} from "@notas-universitarias/types"
import { useNavigate } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { AddItem } from "@/components/general/AddItem.tsx"
import CourseInstanceBox from "@/routes/home/current-period/-CourseInstanceBox.tsx"
import formatDate from "@/utils/date-formats.ts"

export type AddItemProps = {
	title: string
	action: () => void | Promise<void>
}

export type ChildCourseContainerProps = {
	content: ReactNode
	addItemProps: AddItemProps
}

export function ChildCourseContainerProps({
	content,
	addItemProps
}: ChildCourseContainerProps) {
	return (
		<article
			className={"flex flex-col gap-10 justify-center items-center p-4 "}
		>
			<div>{content}</div>
			<AddItem {...addItemProps} />
		</article>
	)
}

export default function CourseInstancesContainer({
	isActive,
	courseInstances,
	name,
	startDate,
	endDate
}: CurrentAcademicPeriod) {
	const navigate = useNavigate({ from: "/home/current-period/" })
	const registeredCourseInstances = courseInstances.map(
		(instance: CurrentAcademicPeriodSubjects) => {
			return (
				<CourseInstanceBox
					courseInstanceId={instance.id}
					courseInstanceName={instance.name}
					key={instance.id}
					navigateTo={() =>
						navigate({
							to: "/home/course-instance/edit/$courseInstanceId",
							params: { courseInstanceId: instance.id }
						})
					}
				/>
			)
		}
	)
	return (
		<section className={"flex flex-col items-center justify-center gap-10"}>
			<div className={"flex flex-col gap-10 mb-8"}>
				<h1 className={"text-4xl font-bold text-center text-primary-500"}>
					{!name.trim().length ? "Sin periodo académico registrado" : `${name}`}
				</h1>
				{name.trim().length > 0 && (
					<h2 className={"text-2xl text-center text-primary-500 mb-8"}>
						{`${formatDate(new Date(startDate))} - ${formatDate(new Date(endDate))}`}
					</h2>
				)}
			</div>
			{!isActive ? (
				<ChildCourseContainerProps
					content={
						<p className={"text-2xl"}>
							¿Estás de vacaciones? Si no, registra un nuevo periodo académico
						</p>
					}
					addItemProps={{
						title: "Registrar un nuevo periodo",
						action: async () => await navigate({ to: "/home/register-period" })
					}}
				/>
			) : null}
			{isActive && !courseInstances.length ? (
				<ChildCourseContainerProps
					content={
						<p className={"text-2xl"}>
							No tienes materias registradas para este periodo
						</p>
					}
					addItemProps={{
						title: "Registrar materia",
						action: async () =>
							await navigate({ to: "/home/current-period/course-instance" })
					}}
				/>
			) : null}
			{courseInstances.length ? (
				<ChildCourseContainerProps
					content={
						<div
							className={
								"flex gap-10 justify-center items-center max-w-175 flex-wrap mb-8"
							}
						>
							{...registeredCourseInstances}
						</div>
					}
					addItemProps={{
						title: "Registrar materia",
						action: async () =>
							await navigate({ to: "/home/current-period/course-instance" })
					}}
				/>
			) : null}
		</section>
	)
}
