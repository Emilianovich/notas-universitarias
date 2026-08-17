import {
	type AppTheme,
	type FontFamily,
	ON_SUBMIT_INVALID_MSG,
	type PetName,
	PREVIEW_PET_HEIGHT,
	PREVIEW_TEXT_HEIGHT
} from "@notas-universitarias/types"
import {
	type CreateSettingsDto,
	createUserPreferencesSchema
} from "@notas-universitarias/types/dtos"
import { useForm, useSelector } from "@tanstack/react-form"
import defaultSettings from "@/components/context-providers/default-settings.ts"
import DropdownMenu, {
	allowedFontFamilies,
	allowedPets,
	allowedThemes
} from "@/components/form/general/DropdownMenu.tsx"
import Button from "@/components/general/Button.tsx"
import PreviewPet from "@/components/ui/PreviewPet.tsx"
import PreviewText from "@/components/ui/PreviewText.tsx"
import useToast from "@/contexts/toast.ts"
import type { RegisterFormProps } from "@/types/input.ts"

export default function UserSettingsForm({
	setGlobalFormState,
	registerState
}: RegisterFormProps) {
	const { buildToast } = useToast()
	const { theme: defaultTheme, fontFamily: defaultFont } = defaultSettings
	const form = useForm({
		validators: {
			onBlur: createUserPreferencesSchema
		},
		defaultValues: {
			fontFamily:
				registerState.afterRegisterData.settings?.fontFamily ?? defaultFont,
			petName: registerState.afterRegisterData.settings?.petName ?? "Spike",
			theme: registerState.afterRegisterData.settings?.theme ?? defaultTheme
		},
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: ON_SUBMIT_INVALID_MSG
			})
		},
		onSubmit: ({ value }) => {
			setGlobalFormState({
				...registerState,
				isSecondDone: true,
				progress: 66,
				afterRegisterData: {
					settings: value as CreateSettingsDto
				}
			})
		}
	})
	const { Field } = form
	const values = useSelector(form.store, (state) => state.values)
	JSON.stringify(values)
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	const currentFontFamily = useSelector(
		form.store,
		(state) => state.values.fontFamily
	)
	const currentPetName = useSelector(
		form.store,
		(state) => state.values.petName
	)
	const currentTheme = useSelector(form.store, (state) => state.values.theme)
	// TODO ver si puedo volver esto un componente junto al de los settings
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				e.stopPropagation()
				await form.handleSubmit()
			}}
			className={`grid grid-rows-[auto_${PREVIEW_TEXT_HEIGHT}px_auto_auto_${PREVIEW_PET_HEIGHT}_1fr] justify-center items-center gap-4`}
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
								selectedItem={currentFontFamily}
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
							<PreviewText
								font={currentFontFamily}
								previewText={registerState.username}
							/>
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
							selectedItem={currentTheme}
							id={name}
							isBlurred={isBlurred || submissionAttempts > 0}
							iterableItems={allowedThemes}
							error={errors[0]?.message}
							handleBlur={handleBlur}
							syncValueToState={(e) => handleChange(e.target.value as AppTheme)}
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
								selectedItem={currentPetName}
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
							<PreviewPet petName={currentPetName as PetName} />
						</div>
					)
				}}
			/>
			<div className={"w-full flex justify-center items-center gap-6"}>
				<Button
					text={"Hacer más tarde"}
					type={"button"}
					styleType={"secondary"}
					isDisabled={false}
					clickAction={() => {
						setGlobalFormState({
							...registerState,
							isSecondDone: true,
							progress: 66
						})
					}}
				/>
				<Button
					text={"Guardar configuraciones"}
					type={"submit"}
					styleType={"primary"}
					isDisabled={false}
				/>
			</div>
		</form>
	)
}
