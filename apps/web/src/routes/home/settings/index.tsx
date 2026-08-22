import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import {
	type AppTheme,
	type FontFamily,
	type PetName,
	type UpdateUserDTO,
	updateUserDTO
} from "@notas-universitarias/types"
import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { getUserPreferences } from "@/components/context-providers/settings-provider.tsx"
import ErrorComponent from "@/components/error-components/current-period/ErrorComponent.tsx"
import DropdownMenu, {
	allowedFontFamilies,
	allowedPets,
	allowedThemes
} from "@/components/form/general/DropdownMenu.tsx"
import Input from "@/components/form/general/Input.tsx"
import { SettingsContainer } from "@/components/form/settings/SettingsContainer.tsx"
import Button from "@/components/general/Button.tsx"
import LoadingComponent from "@/components/loading-components/current-period/LoadingComponent.tsx"
import PreviewPet from "@/components/ui/PreviewPet.tsx"
import PreviewText from "@/components/ui/PreviewText.tsx"
import { findPetByName } from "@/contexts/pet.ts"
import useSettings from "@/contexts/settings.ts"
import useToast from "@/contexts/toast.ts"
import authMiddleware from "@/middlewares/auth.ts"

export const Route = createFileRoute("/home/settings/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Configuraciones"
			}
		]
	}),
	server: {
		middleware: [authMiddleware]
	},
	pendingComponent: () => (
		<LoadingComponent text={"Cargando sus configuraciones..."} />
	),
	errorComponent: () => (
		<ErrorComponent text={"Ocurrió un error al cargar sus configuraciones"} />
	)
})

export const updateUserSettings = async (dto: UpdateUserDTO) => {
	return await buildRequest<string, string>({
		method: "PUT",
		path: "/users",
		includeCredentials: true,
		reqBody: dto
	})
}

function RouteComponent() {
	const { data } = useSuspenseQuery({
		queryKey: ["userPreferences"],
		queryFn: getUserPreferences
	})
	const { user } = data.content
	const { name, email, preferences } = user
	const { petName, theme, fontFamily } = preferences
	const { buildToast } = useToast()
	// @ts-expect-error
	// NOTE: this is only used in authenticated routes
	const { changeUserSettings } = useSettings()
	const navigate = useNavigate({ from: "/home/settings/" })
	const mutation = useMutation({
		mutationFn: updateUserSettings,
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
			buildToast({
				id: Date.now(),
				type: "success",
				content: data.content
			})
		}
	})
	const { mutate } = mutation

	const form = useForm({
		validators: {
			onBlur: updateUserDTO
		},
		defaultValues: {
			name,
			email,
			fontFamily,
			theme,
			petName
		},
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: "Hi"
			})
		},
		onSubmit: ({ value }) => {
			mutate(value, {
				onSuccess: () => {
					const pet = findPetByName(value.petName)
					changeUserSettings({
						theme: value.theme,
						pet,
						fontFamily: value.fontFamily
					})
				}
			})
		}
	})
	const { Field } = form
	const selectedFontFamily = useSelector(
		form.store,
		(state) => state.values.fontFamily
	)
	const selectedPetName = useSelector(
		form.store,
		(state) => state.values.petName
	)
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	return (
		<main>
			<form
				onSubmit={async (e) => {
					e.preventDefault()
					e.stopPropagation()
					await form.handleSubmit()
				}}
				className={"p-4"}
			>
				<SettingsContainer
					title={"Información personal"}
					btnText={"Actualizar datos"}
					btnAction={async () => console.log("Hi")}
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
									label={"Tu apodo"}
									type={"text"}
									name={name}
									value={state.value}
									error={errors[0]?.message}
									syncValueToState={(e) => handleChange(e.target.value)}
									handleBlur={handleBlur}
									isBlurred={isBlurred || submissionAttempts > 0}
									color={"#F9FCFC"}
									originallyPassword={false}
								/>
							)
						}}
					/>
					<Field
						name={"email"}
						children={(fieldApi) => {
							const { errors, isBlurred } = fieldApi.state.meta
							const { name, handleBlur, state, handleChange } = fieldApi
							return (
								<Input
									key={name}
									id={name}
									label={"Tu correo"}
									type={"text"}
									name={name}
									value={state.value}
									error={errors[0]?.message}
									syncValueToState={(e) => handleChange(e.target.value)}
									handleBlur={handleBlur}
									isBlurred={isBlurred || submissionAttempts > 0}
									color={"#F9FCFC"}
									originallyPassword={false}
								/>
							)
						}}
					/>
					<div className={"flex gap-4 relative w-150"}>
						<Input
							key={name}
							id={name}
							label={"Tu contraseña"}
							type={"password"}
							name={name}
							value={"Esto no tu contraseña real sjsjs"}
							syncValueToState={(_e) =>
								console.log("Esto literal no hace nada lol")
							}
							handleBlur={() =>
								console.log(
									"Estás haciendo un cambio que no afecta el legado de Lebrón"
								)
							}
							isBlurred={false}
							color={"#F9FCFC"}
							originallyPassword={true}
							error={"Shhh"}
						/>
						<div
							className={
								"absolute top-1/2 -translate-y-1/2 right-0 xl:-right-10"
							}
						>
							<Button
								// TODO buscar mejor nombre para este botón
								text={"Actualizar contraseña"}
								type={"button"}
								styleType={"secondary"}
								isDisabled={false}
								clickAction={async () =>
									await navigate({ to: "/home/settings/change-password" })
								}
							/>
						</div>
					</div>
				</SettingsContainer>
				<SettingsContainer
					title={"Preferencias"}
					btnText={"Guardar Preferencias"}
					btnAction={async () => console.log("Hi")}
				>
					<Field
						name={"fontFamily"}
						children={(fieldApi) => {
							const { errors, isBlurred } = fieldApi.state.meta
							const { name, handleBlur, handleChange } = fieldApi
							return (
								<div className={"flex flex-col"}>
									<DropdownMenu
										label={"Estilo de fuente"}
										name={name}
										selectedItem={fontFamily}
										id={name}
										isBlurred={isBlurred || submissionAttempts > 0}
										iterableItems={allowedFontFamilies}
										error={errors[0]?.message}
										handleBlur={handleBlur}
										syncValueToState={(e) =>
											handleChange(e.target.value as FontFamily)
										}
										color={"#F9FCFC"}
									/>
									<PreviewText font={selectedFontFamily} />
								</div>
							)
						}}
					/>
					<Field
						name={"theme"}
						children={(fieldApi) => {
							const { errors, isBlurred } = fieldApi.state.meta
							const { name, handleBlur, handleChange } = fieldApi
							return (
								<DropdownMenu
									label={"Tema de la aplicación"}
									name={name}
									selectedItem={theme}
									id={name}
									isBlurred={isBlurred || submissionAttempts > 0}
									iterableItems={allowedThemes}
									error={errors[0]?.message}
									handleBlur={handleBlur}
									syncValueToState={(e) =>
										handleChange(e.target.value as AppTheme)
									}
									color={"#F9FCFC"}
								/>
							)
						}}
					/>
					<Field
						name={"petName"}
						children={(fieldApi) => {
							const { errors, isBlurred } = fieldApi.state.meta
							const { name, handleBlur, handleChange } = fieldApi
							return (
								<div className={"flex flex-col"}>
									<DropdownMenu
										label={"Mascota"}
										name={name}
										selectedItem={petName}
										id={"pet"}
										isBlurred={isBlurred || submissionAttempts > 0}
										iterableItems={allowedPets}
										error={errors[0]?.message}
										handleBlur={handleBlur}
										syncValueToState={(e) =>
											handleChange(e.target.value as PetName)
										}
										color={"#F9FCFC"}
									/>
									<PreviewPet petName={selectedPetName} />
								</div>
							)
						}}
					/>
				</SettingsContainer>
				<div className={"w-full flex justify-center items-center"}>
					<Button
						text={"Guardar"}
						type={"submit"}
						styleType={"primary"}
						isDisabled={false}
					/>
				</div>
			</form>
		</main>
	)
}
