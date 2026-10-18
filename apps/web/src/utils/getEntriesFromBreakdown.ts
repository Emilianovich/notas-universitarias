import type {
	CourseBreakdownEntry,
	CourseInstance
} from "@notas-universitarias/types"

export type BreakdownDetail = {
	breakdownName: string
	contribution: number
	percentage: number
	entriesData: CourseBreakdownEntry[]
	allowsMultipleEntries: boolean
}
export default function getEntriesFromBreakdown(course: CourseInstance) {
	const breakdownDetail: BreakdownDetail[] = []
	course.breakdowns.forEach((breakdown) => {
		const {
			contribution,
			name: breakdownName,
			percentage,
			allowsMultipleEntries
		} = breakdown
		const entriesData: CourseBreakdownEntry[] = []
		breakdown.entries.forEach((entry) => {
			entriesData.push({
				...entry
			})
		})
		breakdownDetail.push({
			contribution,
			percentage,
			breakdownName,
			entriesData,
			allowsMultipleEntries
		})
	})
	return breakdownDetail
}
