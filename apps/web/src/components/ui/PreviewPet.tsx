import { type PetName, PREVIEW_PET_HEIGHT } from "@notas-universitarias/types"
import { findPetByName } from "@/contexts/pet.ts"
import { Spike } from "@/contexts/settings.ts"

export default function PreviewPet({ petName }: { petName: PetName }) {
	const pet = findPetByName(petName)
	const { alt, sleeping } = pet ?? Spike
	return (
		<div
			className={`w-full flex justify-center items-center transition-all h-[${PREVIEW_PET_HEIGHT}px]`}
		>
			<img
				src={sleeping.src}
				alt={alt}
				style={{
					aspectRatio: sleeping.aspectRatio,
					width: sleeping.preferredWidth
				}}
			/>
		</div>
	)
}
