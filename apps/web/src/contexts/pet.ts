import { createContext, useContext } from "react"

export type PetContextProps = {
	isHovered: boolean
	togglePetHover: () => void
}

export const PetContext = createContext<PetContextProps | null>(null)

export default function usePet() {
	const context = useContext(PetContext)
	if (!context)
		throw new Error(
			"To use Pet context, it should be wrapped in a PetContext.Provider"
		)
	return context
}
