import {
	type ChartNoAxesColumnDecreasing,
	ChevronRight,
	type Pencil
} from "lucide-react"
export type CtxMenuOptsProps = {
	text: string
	navigateTo: () => Promise<void> | void
	icon: typeof ChartNoAxesColumnDecreasing | typeof Pencil
}
export default function ContextMenuOption({
	text,
	navigateTo,
	icon
}: CtxMenuOptsProps) {
	const Icon = icon
	return (
		<button
			type="button"
			onClick={() => navigateTo()}
			className={
				"bg-transparent hover:bg-secondary text-primary-300 relative w-full transition-all duration-300 ease-in-out cursor-pointer rounded-lg h-15"
			}
		>
			<div className="ml-4 flex gap-4 rounded-lg hover:bg-secondary items-center  transition-colors">
				<Icon className="sm:size-3 lg:size-5" strokeWidth={3} />
				<span className="sm:text-md sm:font-normal lg:text-xl xl:text-base lg:font-semibold">
					{text}
				</span>
			</div>
			<ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2  sm:size-3 lg:size-5 text-primary-300" />
		</button>
	)
}
