import type {
	AppTheme,
	CoursesInfo,
	FontFamily,
	PetName
} from "@notas-universitarias/types"
import { useSelector } from "@tanstack/react-form"
import type { JSX } from "react"
import GeneralInputContainer from "@/components/form/general/GeneralInputContainer.tsx"
import { useFieldContext, useFormContext } from "@/hooks/form.ts"

export const allowedFontFamilies: Set<FontFamily> = new Set([
	"Arima",
	"Amiko",
	"Playwrite VN",
	"Elsie",
	"Libertinus Math",
	"Nunito",
	"Gorditas",
	"Special Elite",
	"Short Stack",
	"Uncial Antiqua",
	"Saira Stencil",
	"Cherry Cream Soda",
	"Audiowide",
	"Cabin Sketch",
	"Chalkboard SE",
	"Fredoka",
	"Erzieherisch"
])

export const allowedThemes: Set<AppTheme> = new Set(["dark", "light"])

export const allowedPets: Set<PetName> = new Set([
	"Tom",
	"Spike",
	"Leon",
	"Mila",
	"Nita"
])

type DropdownMenuProps<T> = {
	selectedItem: T
	iterableItems: Set<T> | Array<CoursesInfo>
	label: string
}

export default function SelectField<
	T extends string | number | readonly string[] | undefined
>({ selectedItem, iterableItems, label }: DropdownMenuProps<T>) {
	const field = useFieldContext<string>()
	const form = useFormContext()
	const { errors, isBlurred } = field.state.meta
	const { name, handleBlur, handleChange } = field
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	const borderColor =
		errors[0]?.message && isBlurred ? "border border-red-400" : "transparent"
	let itemsToRender: JSX.Element[]
	if (iterableItems instanceof Set) {
		itemsToRender = [...iterableItems].map((item, i) => (
			<option
				key={`${item}-${
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					i
				}`}
				value={item}
				selected={selectedItem === item}
			>
				{item === "dark" ? "Oscuro" : item === "light" ? "Claro" : item}
			</option>
		))
	} else {
		itemsToRender = iterableItems.map((item) => (
			<option
				key={item.name}
				value={item._id.toString()}
				selected={selectedItem === item.name}
			>
				{item.name}
			</option>
		))
	}
	return (
		<GeneralInputContainer
			labelText={label}
			maxWidth={400}
			isBlurred={isBlurred || submissionAttempts > 0}
			input={
				<div className={"w-fit h-fit relative"}>
					<select
						className={`p-2 w-100 h-11.25 rounded-[10px] outline-none shadow-[0px_2px_4px_rgba(0,0,0,0.25)] ${borderColor}`}
						onBlur={handleBlur}
						onChange={(e) => handleChange(e.target.value)}
						name={name}
					>
						{...itemsToRender}
					</select>
				</div>
			}
			error={errors[0]?.message}
		/>
	)
}
