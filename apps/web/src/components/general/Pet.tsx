import { Fact } from "@/components/context-providers/pet-provider.tsx"
import usePet from "@/contexts/pet.ts"
import useSettings from "@/contexts/settings.ts"

export default function Pet() {
	const { togglePetHover, isHovered } = usePet()
	const { pet } = useSettings()
	const { alt, awake, sleeping } = pet
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
