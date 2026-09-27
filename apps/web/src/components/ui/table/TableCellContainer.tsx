import HeaderData from "@/components/ui/table/HeaderData.tsx"
import TableBodyData from "@/components/ui/table/TableBodyData.tsx"

type TableCellContainer = {
	isHeader: boolean
	data: string
}
export default function TableCellContainer({
	isHeader,
	data
}: TableCellContainer) {
	return (
		<div
			className={`p-2 flex items-center justify-center sm:w-70 md:w-90 lg:w-110 xl:w-150 ${isHeader ? "bg-success-bg" : "bg-input h-10"} border-black/20 border`}
		>
			{isHeader ? <HeaderData data={data} /> : <TableBodyData data={data} />}
		</div>
	)
}
