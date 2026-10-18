import type {
	AppTheme,
	CoursesInfo,
	FontFamily,
	PetName
} from "@notas-universitarias/types"
import type { OptionFunctions } from "@/components/form/tanstack-fields/Select/SelectField.tsx"

export const fontFamilyOptions: OptionFunctions<FontFamily> = {
	setOptionKeys: (font) => font,
	setOptionsText: (font) => font,
	setOptionsValues: (font) => font
}

export const petNameOptions: OptionFunctions<PetName> = {
	setOptionsValues: (name) => name,
	setOptionsText: (name) => name,
	setOptionKeys: (name) => name
}

export const appThemeOptions: OptionFunctions<AppTheme> = {
	setOptionsValues: (theme) => theme,
	setOptionsText: (theme) => {
		return theme === "dark" ? "Oscuro" : theme === "light" ? "Claro" : theme
	},
	setOptionKeys: (theme) => theme
}

export const courseInfoOptions: OptionFunctions<CoursesInfo> = {
	setOptionKeys: ({ _id: id }) => id.toString(),
	setOptionsText: ({ name }) => name,
	setOptionsValues: ({ _id: id }) => id.toString()
}
