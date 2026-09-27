import type {
	BreakdownCategory,
	CourseBreakdownEntry,
	CourseInstance
} from "@notas-universitarias/types"

export type BreakdownDetail = {
	breakdownName: string
	contribution: number
	percentage: number
	entriesData: CourseBreakdownEntry[]
	type: BreakdownCategory
}
export default function getEntriesFromBreakdown(course: CourseInstance) {
	const breakdownDetail: BreakdownDetail[] = []
	course.breakdown.forEach((breakdown) => {
		const { contribution, name: breakdownName, percentage, type } = breakdown
		const entriesData: CourseBreakdownEntry[] = []
		if (breakdown.type === "NESTED") return
		breakdown.entries.forEach((entry) => {
			entriesData.push({
				...entry
			})
		})
		breakdownDetail.push({
			contribution: contribution,
			percentage,
			breakdownName,
			entriesData,
			type
		})
	})
	return breakdownDetail
}

export function getEntriesFromLaboratory(
	course: CourseInstance
): BreakdownDetail[] {
	const labBreakdownDetail: BreakdownDetail[] = []
	course.breakdown.forEach((breakdown) => {
		if (breakdown.laboratoryDetails) {
			labBreakdownDetail.push(
				...getEntriesFromBreakdown(breakdown.laboratoryDetails)
			)
		}
	})
	return labBreakdownDetail
}
