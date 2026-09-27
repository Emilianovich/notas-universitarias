export default function TableBodyData({ data }: { data: string }) {
	return (
		<td className={"rounded-sm"}>
			<h4 className="text-primary-500 text-bold sm:text-sm lg:text-lg">
				{data}
			</h4>
		</td>
	)
}
