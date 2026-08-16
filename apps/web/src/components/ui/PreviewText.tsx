import type { FontFamily } from "@notas-universitarias/types"

export default function PreviewText({
	font,
	previewText
}: {
	font: FontFamily
	previewText?: string
}) {
	return (
		<div
			style={{ fontFamily: font }}
			className={
				"w-full flex justify-center items-center tracking-wider text-xl"
			}
		>
			<p>{previewText ? previewText : "Vista Previa"}</p>
		</div>
	)
}
