import { barY, defineChart } from "@tanstack/charts"
import type { CourseBreakdownTableData } from "@/utils/getCourseEvalFromBreakdowns.ts"

export function ContributionGraph(props: CourseBreakdownTableData) {
	const namesAndPercentages = props.map((props) => {
		return {
			name: props.name,
			percentage: props.percentage
		}
	})
	const namesAndContributions = props.map((props) => {
		return {
			name: props.name,
			contribution: props.contribution
		}
	})
	const breakdownData = defineChart({
		marks: [barY(namesAndContributions), barY(namesAndPercentages)]
	})
	return <></>
}
