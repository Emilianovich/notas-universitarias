import defaultSettings from "@/components/context-providers/default-settings.ts"
import { Fact } from "@/components/context-providers/pet-provider.tsx"
import usePet from "@/contexts/pet.ts"
import useSettings from "@/contexts/settings.ts"

export default function Pet() {
	const { pet } = useSettings() ?? defaultSettings
	const { alt, awake, sleeping } = pet
	const { togglePetHover, isHovered } = usePet()
	return (
		<div
			className={`fixed flex justify-evenly gap-4 items-center p-4 bottom-4 right-8`}
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

export function PetVariant({ variant }: PetVariant) {
	const { pet } = useSettings() ?? defaultSettings
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
		<img src={src} alt={alt} style={{ width: preferredWidth, aspectRatio }} />
	)
}
