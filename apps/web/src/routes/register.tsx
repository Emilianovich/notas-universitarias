import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import ToastProvider from "@/components/context-providers/toast-provider.tsx"
import CreateAcademicPeriodForm from "@/components/form/register/CreateAcademicPeriodForm.tsx"
import UserCredentialsForm from "@/components/form/register/UserCredentialsForm.tsx"
import Content from "@/components/general/Content"
import ProgressBar from "@/components/ui/ProgressBar.tsx"
import type { RegisterState } from "@/types/input.ts"

export const Route = createFileRoute("/register")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Crear cuenta"
			}
		]
	})
})

function RouteComponent() {
	const [registerState, setRegisterState] = useState<RegisterState>({
		isFirstDone: false,
		progress: 2,
		firstFormContent: {
			name: "",
			startDate: "",
			endDate: ""
		},
		secondFormContent: {
			username: "",
			email: "",
			password: ""
		},
		isFirstBeenCompleted: false,
		isSecondBeenCompleted: false
	})
	const { isFirstDone, progress } = registerState
	const totalContainerWidth = 550
	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		setRegisterState(prevState =>  ({...prevState, progress: prevState.progress + 2.5}))
	// 	}, 1000)
	// 	return () => clearInterval(interval)
	// }, []);
	return (
		<Content bodyClasses={"bg-secondary"}>
			<ToastProvider>
				<main className={"w-screen h-screen flex items-center justify-center"}>
					<section
						className={
							"relative flex flex-col gap-8 bg-tertiary rounded-[10px] shadow-[0px_4px_10px_2px_rgba(0,0,0,0.25)]"
						}
						style={{ width: totalContainerWidth }}
					>
						{!isFirstDone && (
							<h1 className={"mt-10 text-2xl text-center"}>
								Empecemos registrando un periodo académico
							</h1>
						)}
						<ProgressBar progress={progress} barWidth={totalContainerWidth} />
						{!isFirstDone && (
							<CreateAcademicPeriodForm
								setGlobalFormState={setRegisterState}
								registerState={registerState}
							/>
						)}
						{isFirstDone && (
							<h1 className={"mt-10 text-2xl text-center"}>
								Cuéntanos sobre ti
							</h1>
						)}
						{isFirstDone && (
							<UserCredentialsForm
								registerState={registerState}
								setGlobalFormState={setRegisterState}
							/>
						)}
					</section>
				</main>
			</ToastProvider>
		</Content>
	)
}
