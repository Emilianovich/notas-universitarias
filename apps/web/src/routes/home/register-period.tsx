import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import {
	type CreateAcademicPeriodsDto,
	createAcademicPeriodsDTO,
	ON_SUBMIT_INVALID_MSG
} from "@notas-universitarias/types"
import { revalidateLogic, useForm, useSelector } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import ErrorComponent from "@/components/error-components/current-period/ErrorComponent.tsx"
import Input from "@/components/form/general/Input.tsx"
import Button from "@/components/general/Button.tsx"
import LoadingComponent from "@/components/loading-components/current-period/LoadingComponent.tsx"
import useToast from "@/contexts/toast.ts"
import authMiddleware from "@/middlewares/auth.ts"
import { queryClient } from "@/routes/__root.tsx"
import {
	getAcademicPeriodQueryOpts,
	useGetCurrentAcademicPeriod
} from "@/routes/home/current-period"

const createNewAcademicPeriod = async (dto: CreateAcademicPeriodsDto) => {
	return buildRequest<string, string>({
		method: "POST",
		path: "/academic-periods",
		reqBody: dto,
		includeCredentials: true
	})
}

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
	loader: () => queryClient.ensureQueryData(getAcademicPeriodQueryOpts),
	pendingComponent: () => <LoadingComponent text={"Cargando contenido..."} />,
	errorComponent: () => (
		<ErrorComponent
			text={
				"Ocurrió un error al cargar el formulario para registrar un nuevo periodo académico"
			}
		/>
	)
})

// TODO use isPending, isError
function RegisterPeriodPage() {
	const { data, isSuccess } = useGetCurrentAcademicPeriod()
	return (
		<main className={"flex flex-col justify-center items-center w-full gap-8"}>
			{isSuccess && data.content.isActive && (
				<h1 className={"text-2xl text-primary-500"}>
					El periodo académico actual tiene que finalizar para registrar uno
					nuevo
				</h1>
			)}
			{isSuccess && !data.content.isActive && (
				<>
					<h1 className={"text-4xl font-bold text-center text-primary-500"}>
						Registrar nuevo periodo académico
					</h1>
					<AcademicPeriodForm />
				</>
			)}
		</main>
	)
}

export default function AcademicPeriodForm() {
	const { buildToast } = useToast()
	const navigate = useNavigate()
	const mutation = useMutation({
		mutationFn: createNewAcademicPeriod,
		onError: (error) => {
			if (error instanceof ServerErrorRes) {
				buildToast({
					id: Date.now(),
					type: "error",
					content: error.errors
				})
			}
		},
		onSuccess: async (data) => {
			await navigate({ to: "/home/current-period" })
			buildToast({
				id: Date.now(),
				type: "success",
				content: data.content
			})
		}
	})
	const { mutate } = mutation
	const form = useForm({
		defaultValues: {
			name: "",
			startDate: "",
			endDate: ""
		},
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "blur"
		}),
		validators: {
			onDynamic: createAcademicPeriodsDTO,
			onBlur: createAcademicPeriodsDTO
		},
		onSubmit: ({ value }) => {
			const { name, endDate, startDate } = value
			mutate({
				name,
				startDate,
				endDate
			})
		},
		onSubmitInvalid: ({ value }) => {
			console.log(value)
			buildToast({
				id: Date.now(),
				type: "error",
				content: ON_SUBMIT_INVALID_MSG
			})
		}
	})
	const { Field } = form
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				e.stopPropagation()
				await form.handleSubmit()
			}}
			className={"grid grid-rows-4 gap-2 justify-center items-center relative"}
		>
			<Field
				name={"name"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							key={name}
							id={name}
							label={"Nombre del nuevo periodo académico"}
							type={"text"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isBlurred={isBlurred || submissionAttempts > 0}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"Semestre I 2026"}
						/>
					)
				}}
			/>
			<Field
				name={"startDate"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							key={name}
							id={name}
							label={"Fecha de inicio del periodo académico"}
							type={"date"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isBlurred={isBlurred || submissionAttempts > 0}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"2026/04/24"}
						/>
					)
				}}
			/>
			<Field
				name={"endDate"}
				children={(fieldApi) => {
					const { errors, isBlurred } = fieldApi.state.meta
					const { name, handleBlur, state, handleChange } = fieldApi
					return (
						<Input
							key={name}
							id={name}
							label={"Fecha final del periodo académico"}
							type={"date"}
							name={name}
							value={state.value}
							error={errors[0]?.message}
							syncValueToState={(e) => handleChange(e.target.value)}
							handleBlur={handleBlur}
							isBlurred={isBlurred || submissionAttempts > 0}
							color={"#F9FCFC"}
							originallyPassword={false}
							placeholder={"2026/07/17"}
						/>
					)
				}}
			/>
			<div
				className={
					"flex flex-col gap-4 justify-center items-center w-full h-fit"
				}
			>
				<Button
					text={"Registrar"}
					type={"submit"}
					styleType={"primary"}
					isDisabled={false}
				/>
			</div>
		</form>
	)
}
