import { barY, defineChart } from "@tanstack/charts"
import type { CourseBreakdownTableData } from "@/utils/getCourseEvalFromBreakdowns.ts"
import {Chart} from "@tanstack/charts/react";
import {scaleLinear} from "@tanstack/charts/scales/linear";
import {tooltip} from "@tanstack/charts/tooltip";
import {scaleBand} from "@tanstack/charts/scales/band";
import {roundNumber} from "@notas-universitarias/helpers";


export default function ContributionGraph({userData, label} : CourseBreakdownTableData) {
	// const namesAndPercentages = userData.map((data) => {
	// 	return {
	// 		name: data.name,
	// 		percentage: data.percentage
	// 	}
	// })
	const namesAndContributions = userData.map((data) => {
		return {
			name: data.name,
			contribution: data.contribution * 100
		}
	})
	const breakdownData = defineChart({
		marks: [
			barY(namesAndContributions, {
				x: "name",
				y: "contribution",
				fill: "var(--color-primary-300)",
				maxThickness: 75
			}),
		],
		scales: {
			x: {
				scale: scaleBand,
				axis: {
					label: "Evaluaciones",
				}
			},
			y: {
				nice: true,
				scale: scaleLinear,
				axis: {
					label: "Porcentajes"
				},
			}
		},
		keyboard: true,
		tooltip: {
			use: tooltip,
			format: ({datum}) => `${datum.name} - ${roundNumber({number: datum.contribution})}`
		}
	})
	return <Chart
				ariaLabel={label}
				definition={breakdownData}
			/>
}
