import type { GradeLetter } from "@notas-universitarias/types"
import {
	FaceAngry,
	FaceGrinning,
	FaceNeutral,
	FaceSlightlyFrowning,
	FaceSlightlySmiling
} from "lucide-react"

export default function EmojiForGrade({
	letterGrade
}: {
	letterGrade: GradeLetter
}) {
	const emojiSize = 50
	const strokeWith = 2
	switch (letterGrade) {
		case "A":
			return (
				<FaceGrinning
					size={emojiSize}
					className={"text-success"}
					strokeWidth={strokeWith}
				/>
			)
		case "B":
			return (
				<FaceSlightlySmiling
					size={emojiSize}
					className={"text-success"}
					strokeWidth={strokeWith}
				/>
			)
		case "C":
			return (
				<FaceNeutral
					size={emojiSize}
					className={"text-info"}
					strokeWidth={strokeWith}
				/>
			)
		case "D":
			return (
				<FaceSlightlyFrowning
					size={emojiSize}
					className={"text-error"}
					strokeWidth={strokeWith}
				/>
			)
		case "F":
			return (
				<FaceAngry
					size={emojiSize}
					className={"text-error"}
					strokeWidth={strokeWith}
				/>
			)
	}
}
