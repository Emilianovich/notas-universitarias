export default function ErrorMessage({ error }: { error: string }) {
	return <span className={"text-red-400"}>{error}</span>
}
