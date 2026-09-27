import type { ReactNode } from "react"
import TableHeadContent from "@/components/ui/table/TableHeaderContent.tsx"

type TableProps<T> = {
	headerTitles: string[]
	tableBodyData: T[]
	renderTableBodyData: (data: T) => ReactNode
}
export default function Table<T>({
	headerTitles,
	tableBodyData,
	renderTableBodyData
}: TableProps<T>) {
	return (
		<table className={"border-separate overflow-hidden border-spacing-0"}>
			<TableHeadContent headerTitles={headerTitles} />
			<tbody>
				{tableBodyData.map((data, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <the keys are stable between renders>
					<tr key={i} className={"flex"}>
						{renderTableBodyData(data)}
					</tr>
				))}
			</tbody>
		</table>
	)
}
