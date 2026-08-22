import type {
	AppTheme,
	CoursesInfo,
	FontFamily,
	PetName
} from "@notas-universitarias/types"
import type { JSX } from "react"
import GeneralInputContainer from "@/components/form/general/GeneralInputContainer.tsx"
import type { InputProps } from "@/types/input.ts"

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
	"Metamorphous",
	"Audiowide",
	"Cabin Sketch"
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
} & Omit<
	InputProps<string>,
	"originallyPassword" | "type" | "placeholder" | "value"
>

export default function DropdownMenu<
	T extends string | number | readonly string[] | undefined
>({
	selectedItem,
	iterableItems,
	id,
	isBlurred,
	label,
	error,
	handleBlur,
	syncValueToState
}: DropdownMenuProps<T>) {
	const borderColor =
		error && isBlurred ? "border border-red-400" : "transparent"
	let itemsToRender: JSX.Element[] = []
	if (iterableItems instanceof Set) {
		itemsToRender = [...iterableItems].map((item, i) => (
			<option
				key={`${item}-${i}`}
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
			inputId={id}
			maxWidth={400}
			isBlurred={isBlurred}
			input={
				<div className={"w-fit h-fit relative"}>
					<select
						className={`p-2 w-100 h-11.25 rounded-[10px] outline-none shadow-[0px_2px_4px_rgba(0,0,0,0.25)] ${borderColor}`}
						onBlur={handleBlur}
						onChange={syncValueToState}
					>
						{...itemsToRender}
					</select>
				</div>
			}
			error={error}
		/>
	)
}
