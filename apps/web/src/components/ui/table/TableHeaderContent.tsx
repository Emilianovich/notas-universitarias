import TableCellContainer from "@/components/ui/table/TableCellContainer.tsx"

export type TableHeadContent = {
	headerTitles: string[]
}

export default function TableHeadContent({ headerTitles }: TableHeadContent) {
	return (
		<thead>
			<tr className="flex rounded-md">
				{headerTitles.map((title, i) => (
					<TableCellContainer
						data={title}
						isHeader={true}
						key={`${title}_${
							// biome-ignore lint/suspicious/noArrayIndexKey: <using it with the header title>
							i
						}`}
					/>
				))}
			</tr>
		</thead>
	)
}
