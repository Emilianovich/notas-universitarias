import type {CourseInstance, Laboratory} from "@notas-universitarias/types"
import {updateCourseInstanceFinalGrade} from "@notas-universitarias/helpers";

export type CourseBreakdownTableData = {
	label: string
	userData: ReturnType<typeof getCourseEvalFromBreakdowns>
}

export type CourseEvalFromBreakdownsType = ReturnType<typeof getCourseEvalFromBreakdowns>
export default function getCourseEvalFromBreakdowns(course: CourseInstance) {
	return course.breakdowns.map((breakdown) => {
		return {
			name: breakdown.name,
			percentage: breakdown.percentage * 100,
			contribution: breakdown.contribution * 100
		}
	})
}

export function getLaboratoryBreakdownData(lab: Laboratory) {
	const { percentage } = lab
	updateCourseInstanceFinalGrade(lab)
	const contribution = (percentage * lab.finalGrade)
	return {
		name: "Laboratorio",
		percentage: percentage * 100,
		contribution,
	}
}