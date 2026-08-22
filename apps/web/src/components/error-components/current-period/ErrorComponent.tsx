import defaultSettings from "@/components/context-providers/default-settings.ts"
import { PetVariant } from "@/components/general/Pet.tsx"
import useLocalStorage from "@/hooks/localStorage.ts"

export default function ErrorComponent({ text }: { text: string }) {
	const data = useLocalStorage()
	return (
		<main
			className={"flex flex-col items-center justify-center"}
			style={{ fontFamily: data?.fontFamily ?? defaultSettings.fontFamily }}
		>
			<div
				className={
					"flex sm:flex-col xl:flex-row gap-4 justify-center items-center full text-red-700"
				}
			>
				<p
					className={
						"max-w-[50ch] text-center leading-normal sm:text-xl xl:text-2xl"
					}
				>
					{text}
				</p>
				<PetVariant variant={"shocked"} />
			</div>
		</main>
	)
}
