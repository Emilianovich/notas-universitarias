import type { PetName } from "@notas-universitarias/types"
import { createContext, useContext } from "react"
import { Leon, Mila, Nita, type Pet, Spike, Tom } from "@/contexts/settings.ts"

export type PetContextProps = {
	isHovered: boolean
	togglePetHover: () => void
}

export const findPetByName = (name: PetName): Pet => {
	switch (name) {
		case "Spike":
			return Spike
		case "Mila":
			return Mila
		case "Leon":
			return Leon
		case "Nita":
			return Nita
		case "Tom":
			return Tom
	}
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
