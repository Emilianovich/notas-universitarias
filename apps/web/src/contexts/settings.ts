import type { AppTheme, FontFamily, PetName } from "@notas-universitarias/types"
import { createContext, useContext } from "react"

export type UserSettings = Omit<SettingsProviderProps, "setUserSettings">

type PetImageData = {
	src: string
	aspectRatio: string
	preferredWidth: number
}

export interface Pet {
	name: PetName
	alt: string
	awake: PetImageData
	sleeping: PetImageData
	shocked: PetImageData
	lost: PetImageData
}

export type PetProps = Pet & { togglePetFocus: () => void; isFocused: boolean }

export const Spike: Pet = {
	name: "Spike",
	alt: "Spike, el dinosaurio",
	awake: {
		src: "/spike-awake.png",
		aspectRatio: "219 / 256",
		preferredWidth: 155
	},
	sleeping: {
		src: "/spike-sleeping.png",
		aspectRatio: "1024 / 835",
		preferredWidth: 160
	},
	shocked: {
		src: "/spike-shocked.png",
		aspectRatio: "1 / 1",
		preferredWidth: 160
	},
	lost: {
		src: "/spike-lost.png",
		aspectRatio: "1 / 1",
		preferredWidth: 160
	}
}

export const Leon: Pet = {
	name: "Leon",
	alt: "Leon, el staffy",
	awake: {
		src: "/leon-awake.png",
		aspectRatio: "66 / 59",
		preferredWidth: 185
	},
	sleeping: {
		src: "/leon-sleeping.png",
		aspectRatio: "3 / 2",
		preferredWidth: 160
	},
	shocked: {
		src: "/leon-shocked.png",
		aspectRatio: "1 / 1",
		preferredWidth: 155
	},
	lost: {
		src: "/leon-lost.png",
		aspectRatio: "1 / 1",
		preferredWidth: 155
	}
}

export const Nita: Pet = {
	name: "Nita",
	alt: "Nita, la panda roja no roja",
	awake: {
		src: "/nita-awake.png",
		aspectRatio: "3 / 2",
		preferredWidth: 160
	},
	sleeping: {
		src: "/nita-sleeping.png",
		aspectRatio: "3 / 2",
		preferredWidth: 160
	},
	shocked: {
		src: "/nita-shocked.png",
		aspectRatio: "3 / 2",
		preferredWidth: 170
	},
	lost: {
		src: "/nita-lost.png",
		aspectRatio: "3 / 2",
		preferredWidth: 170
	}
}

export const Tom: Pet = {
	name: "Tom",
	alt: "Tom, el gato",
	awake: {
		src: "/tom-awake.png",
		aspectRatio: "1 / 1",
		preferredWidth: 190
	},
	sleeping: {
		src: "/tom-sleeping.png",
		aspectRatio: "1 / 1",
		preferredWidth: 175
	},
	shocked: {
		src: "/tom-shocked.png",
		aspectRatio: "1 / 1",
		preferredWidth: 155
	},
	lost: {
		src: "/tom-lost.png",
		aspectRatio: "1 / 1",
		preferredWidth: 155
	}
}

export const Mila: Pet = {
	name: "Mila",
	alt: "Mila, la hurón",
	awake: {
		src: "/mila-awake.png",
		aspectRatio: "1449 / 1570",
		preferredWidth: 145
	},
	sleeping: {
		src: "/mila-sleeping.png",
		aspectRatio: "1 / 1",
		preferredWidth: 160
	},
	shocked: {
		src: "/mila-shocked.png",
		aspectRatio: "1 / 1",
		preferredWidth: 150
	},
	lost: {
		src: "/mila-lost.png",
		aspectRatio: "1 / 1",
		preferredWidth: 150
	}
}

export type SettingsProviderProps = {
	fontFamily: FontFamily
	theme: AppTheme
	pet: Pet
}

export type SettingsContextType = SettingsProviderProps & {
	changeUserSettings: (data: UserSettings) => void
}

export const SettingsContext = createContext<SettingsContextType | null>(null)

const useSettings = () => {
	return useContext(SettingsContext)
}

export default useSettings
