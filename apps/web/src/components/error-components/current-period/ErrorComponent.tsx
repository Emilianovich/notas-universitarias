import { PetVariant } from "@/components/general/Pet.tsx"

export default function ErrorComponent({ text }: { text: string }) {
	return (
		<main className={"flex flex-col items-center justify-center"}>
			<div
				className={"flex gap-4 justify-center items-center full text-red-700"}
			>
				<p className={"text-2xl max-w-[50ch] text-center leading-normal"}>
					{text}
				</p>
				<PetVariant variant={"shocked"} />
			</div>
		</main>
	)
}
