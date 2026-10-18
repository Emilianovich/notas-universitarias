export default function FieldText({ text }: { text: string }) {
	return (
		<span style={{ fontSize: 18 }} className={"text-primary-500"}>
			{text}
		</span>
	)
}
