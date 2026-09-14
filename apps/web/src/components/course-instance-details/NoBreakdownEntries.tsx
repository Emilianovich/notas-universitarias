import { NO_BREAKDOWN_ENTRIES } from "@notas-universitarias/types"

export default function NoBreakdownEntries() {
	return (
		<div
			className={
				"w-130 bg-secondary h-18.5 flex items-center justify-center rounded-[10px] shadow-[0_6px_4px_-1px_rgba(0,0,0,0.25)]"
			}
		>
			<span className={"text-primary-700 text-base"}>
				{NO_BREAKDOWN_ENTRIES}
			</span>
		</div>
	)
}
