import type { FontFamily } from "@notas-universitarias/types"

export default function PreviewText({ font }: { font: FontFamily }) {
	return (
		<div
			style={{ fontFamily: font }}
			className={
				"w-full flex justify-center items-center tracking-wider text-xl"
			}
		>
			<p>Preview Text</p>
		</div>
	)
}
