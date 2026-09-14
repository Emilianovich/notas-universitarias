import { roundNumber } from "@notas-universitarias/helpers"
import NoBreakdownEntries from "@/components/course-instance-details/NoBreakdownEntries.tsx"
import Table from "@/components/ui/table/Table.tsx"
import TableCellContainer from "@/components/ui/table/TableCellContainer.tsx"
import type { BreakdownDetail } from "@/utils/getEntriesFromBreakdown.ts"

export function BreakdownEntryDetail({
	breakdownDetail
}: {
	breakdownDetail: BreakdownDetail
}) {
	const { breakdownName, entriesData, contribution, percentage, type } =
		breakdownDetail
	return (
		<article className={"flex flex-col justify-start items-center gap-8"}>
			<div className={"flex justify-between items-center w-full"}>
				<h4 className={"text-primary-700 text-lg"}>{breakdownName}</h4>
				<span
					className={"text-primary-700 text-xs"}
				>{`Porcentaje obtenido: ${roundNumber({ number: contribution * 100, amountOfDecimals: 2 })} de ${percentage}%`}</span>
			</div>
			<div className={"flex items-center justify-center"}>
				{entriesData.length === 0 ? (
					<NoBreakdownEntries />
				) : type === "STANDALONE" ? (
					<StandaloneEntriesDetails breakdownDetail={breakdownDetail} />
				) : (
					<NotNestedEntriesDetails breakdownDetail={breakdownDetail} />
				)}
			</div>
		</article>
	)
}

function NotNestedEntriesDetails({
	breakdownDetail
}: {
	breakdownDetail: BreakdownDetail
}) {
	const { entriesData } = breakdownDetail
	return (
		<Table
			headerTitles={["Nombre", "Nota obtenida"]}
			tableBodyData={entriesData}
			renderTableBodyData={(data) => (
				<>
					<TableCellContainer
						isHeader={false}
						data={data.name ?? "Sin Nombre"}
					/>
					<TableCellContainer
						isHeader={false}
						data={`${data.rawScore}/${data.maxScore}`}
					/>
				</>
			)}
		/>
	)
}

function StandaloneEntriesDetails({
	breakdownDetail
}: {
	breakdownDetail: BreakdownDetail
}) {
	const { entriesData } = breakdownDetail
	return (
		<Table
			headerTitles={["Nota obtenida", "Nota máxima"]}
			tableBodyData={entriesData}
			renderTableBodyData={(data) => (
				<>
					<TableCellContainer
						isHeader={false}
						data={data.rawScore.toString()}
					/>
					<TableCellContainer
						isHeader={false}
						data={data.maxScore.toString()}
					/>
				</>
			)}
		/>
	)
}
