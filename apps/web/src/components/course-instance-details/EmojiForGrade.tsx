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
	const classes = "sm:size-10 lg:size-12"
	const strokeWith = 2
	switch (letterGrade) {
		case "A":
			return (
				<FaceGrinning
					className={`text-success ${classes}`}
					strokeWidth={strokeWith}
				/>
			)
		case "B":
			return (
				<FaceSlightlySmiling
					className={`text-success ${classes}`}
					strokeWidth={strokeWith}
				/>
			)
		case "C":
			return (
				<FaceNeutral
					className={`text-info ${classes}`}
					strokeWidth={strokeWith}
				/>
			)
		case "D":
			return (
				<FaceSlightlyFrowning
					className={`text-error ${classes}`}
					strokeWidth={strokeWith}
				/>
			)
		case "F":
			return (
				<FaceAngry
					className={`text-error ${classes}`}
					strokeWidth={strokeWith}
				/>
			)
	}
}
