import { createContext, useContext } from "react"

export type UserSettings = Omit<SettingsContextProps, "pet"> & {
	selectedPet: string
	pets: Pet[]
}

export interface Pet {
	name: string
	alt: string
	awake: {
		src: string
		aspectRatio: string
		preferredWidth: number
	}
	sleeping: {
		src: string
		aspectRatio: string
		preferredWidth: number
	}
	sleepingSrc: string
	awakeSrc: string
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
	sleepingSrc: "/spike-sleeping.png",
	awakeSrc: "/spike-awake.png"
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
	sleepingSrc: "/leon-sleeping.png",
	awakeSrc: "/leon-awake.png"
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
	awakeSrc: "/nita-awake.png",
	sleepingSrc: "/nita-sleeping.png"
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
	awakeSrc: "/tom-awake.png",
	sleepingSrc: "/tom-sleeping.png"
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
	awakeSrc: "/mila-awake.png",
	sleepingSrc: "/mila-sleeping.png"
}

export type SettingsContextProps = {
	fontFamily: "Google Sans Code" | "Arima" | "Amiko" | "DynaPuff"
	theme: "dark" | "light"
	pet: Pet
}

export const SettingsContext = createContext<SettingsContextProps | null>(null)

const useSettings = () => {
	const context = useContext(SettingsContext)
	if (!context) {
		throw new Error("No context provided")
	}
	return context
}

export default useSettings
