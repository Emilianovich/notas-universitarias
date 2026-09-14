export default function HeaderData({ data }: { data: string }) {
	return (
		<th className={"rounded-sm"}>
			<h3 className="text-primary-700 font-bold text-xl">{data}</h3>
		</th>
	)
}
