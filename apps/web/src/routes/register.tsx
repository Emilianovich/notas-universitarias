import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import CreateAcademicPeriodForm from "@/components/form/register/CreateAcademicPeriodForm.tsx"
import UserCredentialsForm from "@/components/form/register/UserCredentialsForm.tsx"
import ProgressBar from "@/components/ui/ProgressBar.tsx"
import useSettings from "@/contexts/settings.ts"
import type { RegisterState } from "@/types/input.ts"

export const Route = createFileRoute("/register")({
	component: RouteComponent
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
		isFirstHasBeenCompleted: false,
		isSecondHasBeenCompleted: false
	})
	const { isFirstDone, progress } = registerState
	const totalContainerWidth = 550
	const { fontFamily } = useSettings()
	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		setRegisterState(prevState =>  ({...prevState, progress: prevState.progress + 2.5}))
	// 	}, 1000)
	// 	return () => clearInterval(interval)
	// }, []);
	return (
		<div className={"w-screen h-screen flex items-center justify-center"}>
			<section
				className={"relative flex flex-col gap-8 border-black border"}
				style={{ width: totalContainerWidth, fontFamily }}
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
					<h1 className={"mt-10 text-2xl text-center"}>Cuéntanos sobre ti</h1>
				)}
				{isFirstDone && (
					<UserCredentialsForm
						registerState={registerState}
						setGlobalFormState={setRegisterState}
					/>
				)}
			</section>
		</div>
	)
}
