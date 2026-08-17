import { createFileRoute } from "@tanstack/react-router"
import { MoveLeft } from "lucide-react"
import { useState } from "react"
import ToastProvider from "@/components/context-providers/toast-provider.tsx"
import CreateAcademicPeriodForm from "@/components/form/register/CreateAcademicPeriodForm.tsx"
import UserCredentialsForm from "@/components/form/register/UserCredentialsForm.tsx"
import UserSettingsForm from "@/components/form/register/UserSettingsForm.tsx"
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
		isSecondDone: false,
		afterRegisterData: {}
	})
	const { isFirstDone, progress, isSecondDone } = registerState
	const totalContainerWidth = 550
	return (
		<Content bodyClasses={"bg-secondary"}>
			<ToastProvider>
				<main className={"w-screen h-screen flex items-center justify-center"}>
					<section
						className={
							"relative flex flex-col gap-8 bg-tertiary rounded-[10px] shadow-[0px_4px_10px_2px_rgba(0,0,0,0.25)] p-8"
						}
						style={{ width: totalContainerWidth }}
					>
						{!isFirstDone && (
							<>
								<h1 className={"mt-5 text-2xl text-center"}>
									Cuéntanos sobre ti
								</h1>
								<UserCredentialsForm
									registerState={registerState}
									setGlobalFormState={setRegisterState}
								/>
							</>
						)}
						{isFirstDone && !isSecondDone && (
							<>
								<h1 className={"mt-5 text-2xl text-center"}>
									Personaliza el aspecto de la página
								</h1>
								<UserSettingsForm
									registerState={registerState}
									setGlobalFormState={setRegisterState}
								/>
							</>
						)}
						{isSecondDone && (
							<>
								<MoveLeft
									onClick={() =>
										setRegisterState({
											...registerState,
											isSecondDone: false,
											progress: 33
										})
									}
									className={
										"absolute top-13 left-4 hover:scale-110 cursor-pointer transition-all duration-300 ease-in-out"
									}
								/>
								<h1 className={"mt-5 text-2xl text-center"}>
									Registra un periodo académico
								</h1>
								<CreateAcademicPeriodForm
									registerState={registerState}
									setGlobalFormState={setRegisterState}
								/>
							</>
						)}
						<ProgressBar progress={progress} barWidth={totalContainerWidth} />
					</section>
				</main>
			</ToastProvider>
		</Content>
	)
}
