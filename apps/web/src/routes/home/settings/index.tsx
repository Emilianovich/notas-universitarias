import { buildRequest, ServerErrorRes } from "@notas-universitarias/helpers"
import { type UpdateUserDTO, updateUserDTO } from "@notas-universitarias/types"
import { createFormHook, useSelector } from "@tanstack/react-form"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { getUserPreferences } from "@/components/context-providers/settings-provider.tsx"
import ErrorComponent from "@/components/error-components/current-period/ErrorComponent.tsx"
import Input from "@/components/form/general/Input.tsx"
import { SettingsContainer } from "@/components/form/settings/SettingsContainer.tsx"
import EmailField from "@/components/form/tanstack-fields/EmailField.tsx"
import PasswordField from "@/components/form/tanstack-fields/PasswordField.tsx"
import {
	appThemeOptions,
	fontFamilyOptions,
	petNameOptions
} from "@/components/form/tanstack-fields/Select/option-functions.ts"
import SelectField from "@/components/form/tanstack-fields/Select/SelectField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import TextField from "@/components/form/tanstack-fields/TextField.tsx"
import Button from "@/components/general/Button.tsx"
import LoadingComponent from "@/components/loading-components/current-period/LoadingComponent.tsx"
import PreviewPet from "@/components/ui/PreviewPet.tsx"
import PreviewText from "@/components/ui/PreviewText.tsx"
import { allowedThemes } from "@/constants/app-themes.ts"
import { allowedFontFamilies } from "@/constants/font-families.ts"
import { allowedPets } from "@/constants/pet-names.ts"
import { findPetByName } from "@/contexts/pet.ts"
import useSettings from "@/contexts/settings.ts"
import useToast from "@/contexts/toast.ts"
import { fieldContext, formContext } from "@/hooks/form.ts"
import authMiddleware from "@/middlewares/auth.ts"
import { baseUrl } from "@/routes/__root.tsx"
import RadioGroup from "@/components/form/tanstack-fields/Radio/RadioGroup"
import { genericBooleanRadios, getRadioGroup } from "@/components/form/tanstack-fields/Radio/GetRadioGroup"
import FieldText from "@/components/form/general/FieldText"

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
		baseUrl,
		method: "PUT",
		path: "/users",
		includeCredentials: true,
		reqBody: dto
	})
}

const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		EmailField,
		PasswordField,
		Select: SelectField,
		RadioGroup
	},
	formComponents: {}
})

function RouteComponent() {
	const { data } = useSuspenseQuery({
		queryKey: ["userPreferences"],
		queryFn: getUserPreferences
	})
	const { user } = data.content
	const { name, email, preferences } = user
	const { petName, theme, fontFamily, disablePet } = preferences
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

	const form = useAppForm({
		validators: {
			onBlur: updateUserDTO
		},
		defaultValues: {
			name,
			email,
			fontFamily,
			theme,
			petName,
			disablePet
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
	const { AppField, AppForm } = form
	const selectedFontFamily = useSelector(
		form.store,
		(state) => state.values.fontFamily
	)
	const selectedPetName = useSelector(
		form.store,
		(state) => state.values.petName
	)
	return (
		<main>
			<AppForm>
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
						<AppField
							name={"name"}
							children={(field) => {
								return (
									<field.TextField
										label={"Tu apodo"}
										placeholder={"Ej. Eminola"}
									/>
								)
							}}
						/>
						<AppField
							name={"email"}
							children={(field) => {
								return (
									<field.EmailField
										label={"Tu correo"}
										placeholder={"eminola@correo.com"}
									/>
								)
							}}
						/>
						<div className={"flex gap-4 relative w-150"}>
							<Input
								key={name}
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
							<div className={"absolute top-1/2 right-0 xl:-right-10 bottom-0"}>
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
						className={"mt-8"}
					>
						<AppField
							name={"fontFamily"}
							children={(field) => {
								return (
									<div className={"flex flex-col"}>
										<field.Select
											labelText={"Estilo de fuente"}
											items={[...allowedFontFamilies]}
											{...fontFamilyOptions}
										/>
										<PreviewText font={selectedFontFamily} />
									</div>
								)
							}}
						/>
						<AppField
							name={"theme"}
							children={(field) => {
								return (
									<field.Select
										labelText={"Tema de la aplicación"}
										items={[...allowedThemes]}
										{...appThemeOptions}
									/>
								)
							}}
						/>
						<AppField
							name={"petName"}
							children={(field) => {
								return (
									<div className={"flex flex-col"}>
										<field.Select
											labelText={"Mascota"}
											items={[...allowedPets]}
											{...petNameOptions}
										/>
										<PreviewPet petName={selectedPetName} />
									</div>
								)
							}}
						/>
						<AppField
							name={"disablePet"}
							children={(field) => {
								return (
									<div className="flex flex-col gap-2 items-start justify-start">
										<FieldText text={"¿Deseas desactivar a tu mascota?"} />
										<field.RadioGroup
											radioGroupName={field.name}
											radios={getRadioGroup(field.name, genericBooleanRadios)}
										/>
									</div>
								)
							}}
						/>
					</SettingsContainer>
					<div className={"w-full flex justify-center items-center"}>
						<SubmitBtn text={"Guardar"} />
					</div>
				</form>
			</AppForm>
		</main>
	)
}
