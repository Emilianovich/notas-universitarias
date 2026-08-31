import {
	ON_SUBMIT_INVALID_MSG,
	type PetName,
	PREVIEW_PET_HEIGHT,
	PREVIEW_TEXT_HEIGHT
} from "@notas-universitarias/types"
import {
	type CreateSettingsDto,
	createUserPreferencesSchema
} from "@notas-universitarias/types/dtos"
import { createFormHook, useSelector } from "@tanstack/react-form"
import defaultSettings from "@/components/context-providers/default-settings.ts"
import SelectField, {
	allowedFontFamilies,
	allowedPets,
	allowedThemes
} from "@/components/form/tanstack-fields/SelectField.tsx"
import SubmitBtn from "@/components/form/tanstack-fields/SubmitBtn.tsx"
import Button from "@/components/general/Button.tsx"
import PreviewPet from "@/components/ui/PreviewPet.tsx"
import PreviewText from "@/components/ui/PreviewText.tsx"
import useToast from "@/contexts/toast.ts"
import { fieldContext, formContext } from "@/hooks/form.ts"
import type { RegisterFormProps } from "@/types/input.ts"

const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		SelectField
	},
	formComponents: {}
})
export default function UserSettingsForm({
	setGlobalFormState,
	registerState
}: RegisterFormProps) {
	const { buildToast } = useToast()
	const { theme: defaultTheme, fontFamily: defaultFont } = defaultSettings
	const form = useAppForm({
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
	const { AppField, AppForm } = form
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
		<AppForm>
			<form
				onSubmit={async (e) => {
					e.preventDefault()
					e.stopPropagation()
					await form.handleSubmit()
				}}
				className={`grid grid-rows-[auto_${PREVIEW_TEXT_HEIGHT}px_auto_auto_${PREVIEW_PET_HEIGHT}_1fr] justify-center items-center gap-4`}
			>
				<AppField
					name={"fontFamily"}
					children={(field) => {
						return (
							<div className={"flex flex-col"}>
								<field.SelectField
									label={"Estilo de fuente"}
									selectedItem={currentFontFamily}
									inputId={field.name}
									iterableItems={allowedFontFamilies}
								/>
								<PreviewText
									font={currentFontFamily}
									previewText={registerState.username}
								/>
							</div>
						)
					}}
				/>
				<AppField
					name={"theme"}
					children={(field) => {
						return (
							<field.SelectField
								label={"Tema de la aplicación"}
								selectedItem={currentTheme}
								inputId={field.name}
								iterableItems={allowedThemes}
							/>
						)
					}}
				/>
				<AppField
					name={"petName"}
					children={(field) => {
						return (
							<div className={"flex flex-col"}>
								<field.SelectField
									label={"Mascota"}
									selectedItem={currentPetName}
									inputId={"pet"}
									iterableItems={allowedPets}
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
					<SubmitBtn text={"Guardar configuraciones"} />
				</div>
			</form>
		</AppForm>
	)
}
