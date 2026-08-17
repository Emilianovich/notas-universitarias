import {
	type FontFamily,
	PREVIEW_TEXT_HEIGHT
} from "@notas-universitarias/types"

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
			className={`w-full flex justify-center items-center tracking-wider text-xl h-[${PREVIEW_TEXT_HEIGHT}px]`}
		>
			<p>{previewText ? previewText : "Vista Previa"}</p>
		</div>
	)
}
