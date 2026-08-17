import { Loader2 } from "lucide-react"

export default function LoadingComponent({ text }: { text: string }) {
	return (
		<main className={"flex flex-col items-center justify-center"}>
			<div
				className={
					"w-full h-10 flex items-center justify-center text-primary-400 text-2xl"
				}
			>
				<Loader2 className={"mr-3 size-7 animate-spin text-primary-400"} />
				<div>{text}</div>
			</div>
		</main>
	)
}
