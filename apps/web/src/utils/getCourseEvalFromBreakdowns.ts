import type { CourseInstance } from "@notas-universitarias/types"

export type CourseBreakdownTableData = ReturnType<
	typeof getCourseEvalFromBreakdowns
>
export default function getCourseEvalFromBreakdowns(course: CourseInstance) {
	return course.breakdown.map((breakdown) => {
		return {
			name: breakdown.name,
			percentage: breakdown.percentage,
			contribution: breakdown.contribution
		}
	})
}

export function getLabEvalFromBreakdowns(course: CourseInstance) {
	const labCourse = course.breakdown.find(
		(breakdown) => breakdown.type === "NESTED"
	)
	if (!labCourse) return undefined
	return {
		labEvals: getCourseEvalFromBreakdowns(
			labCourse?.laboratoryDetails as CourseInstance
		),
		labCourseInstance: labCourse?.laboratoryDetails as CourseInstance
	}
}
