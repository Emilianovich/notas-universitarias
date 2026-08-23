import defaultSettings from "@/components/context-providers/default-settings.ts"
import { Fact } from "@/components/context-providers/pet-provider.tsx"
import usePet, { findPetByName } from "@/contexts/pet.ts"
import useLocalStorage from "@/hooks/localStorage.ts"
import useSettings from "@/contexts/settings.ts";

// NOTE: i'm now using data from localStorage to make sure in landing page selected pet is there
export default function Pet() {
	const data = useLocalStorage()
	const userSettings = useSettings()
	const pet = findPetByName(userSettings?.pet.name ?? data?.petName ?? defaultSettings.pet.name)
	const { alt, awake, sleeping } = pet
	const { togglePetHover, isHovered } = usePet()
	return (
		<div
			id="pet"
			className={`fixed flex justify-evenly gap-4 items-center p-4 bottom-4 sm:bottom-0  sm:right-4 lg:right-8`}
		>
			<Fact />
			<img
				style={{
					aspectRatio: isHovered ? awake.aspectRatio : sleeping.aspectRatio,
					width: isHovered ? awake.preferredWidth : sleeping.preferredWidth
				}}
				alt={alt}
				src={isHovered ? awake.src : sleeping.src}
				className={`hover:scale-[1.1] transition-all duration-200 ease-in-out cursor-pointer z-10 h-30`}
				onMouseLeave={togglePetHover}
				onMouseEnter={togglePetHover}
			/>
		</div>
	)
}

export type PetVariant = {
	variant: "shocked" | "lost"
}
// NOTE: testing localStorage
export function PetVariant({ variant }: PetVariant) {
	const data = useLocalStorage()
	const pet = findPetByName(data?.petName ?? defaultSettings.pet.name)
	console.log("pet", JSON.stringify(pet))
	const { shocked, lost, alt } = pet
	let src: string
	let preferredWidth: number
	let aspectRatio: string
	if (variant === "shocked") {
		src = shocked.src
		preferredWidth = shocked.preferredWidth
		aspectRatio = shocked.aspectRatio
	} else {
		src = lost.src
		preferredWidth = lost.preferredWidth
		aspectRatio = lost.aspectRatio
	}
	return (
		<img
			src={src}
			alt={alt}
			style={{ aspectRatio }}
			className={`xl:w-[${preferredWidth}px] sm:w-42.5`}
		/>
	)
}
