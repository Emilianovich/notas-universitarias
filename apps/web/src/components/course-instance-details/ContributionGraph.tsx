import { roundNumber } from "@notas-universitarias/helpers"
import { barY, defineChart, fold, ruleY, stack } from "@tanstack/charts"
import { Chart } from "@tanstack/charts/react"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { tooltip } from "@tanstack/charts/tooltip"
import type { CourseBreakdownTableData } from "@/utils/getCourseEvalFromBreakdowns.ts"

export default function ContributionGraph({
	userData,
	label
}: CourseBreakdownTableData) {
	const data = userData.map((data) => {
		const contribution = data.contribution * 100
		const { percentage } = data
		return {
			...data,
			contribution,
			remaining:
				percentage - roundNumber({ number: contribution, amountOfDecimals: 2 })
		}
	})
	const dataLabels = ["contribution", "remaining"] as const
	const dataColors = [
		"var(--color-chart-contribution)",
		"var(--color-chart-remaining)"
	]
	const rows = fold(data, {
		fields: dataLabels,
		as: {
			key: "metric",
			value: "value"
		}
	})
	console.log(rows)
	const breakdownData = defineChart({
		marks: [
			barY(rows, {
				id: "user-percentages",
				x: "name",
				y: "value",
				z: "metric",
				color: "metric",
				layout: stack({
					order: dataLabels
				}),
				maxThickness: 75
			}),
			ruleY([0])
		],
		theme: {
			foreground: "var(--color-primary-300)",
			muted: "var(--color-chart-tick)"
		},
		scales: {
			x: {
				scale: scaleBand,
				axis: {
					label: {
						text: "Evaluaciones",
						fontSize: 14,
						fontWeight: 700,
						fill: "var(--color-chart-axis)"
					}
				}
			},
			y: {
				nice: true,
				scale: scaleLinear,
				axis: {
					label: {
						text: "Porcentajes",
						fontSize: 14,
						fontWeight: 700,
						fill: "var(--color-chart-axis)"
					}
				}
			}
		},
		color: {
			domain: dataLabels,
			range: dataColors
		},
		keyboard: true,
		tooltip: {
			use: tooltip,
			className: "custom-tooltip",
			format: ({ datum }) => {
				const { contribution, metric, remaining, name } = datum
				const messageForRemaining =
					remaining > 0
						? `Te falta ${roundNumber({ number: remaining })}% para completar el porcentaje de ${name}`
						: `¡Tienes todo el porcentaje de ${name}!`
				if (metric === "remaining") return messageForRemaining
				return `Tienes el ${roundNumber({ number: contribution })}% de ${name}`
			}
		}
	})
	return (
		<div className="relative">
			<div className="absolute right-1/2 translate-x-1/2 z-10 flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<span className="size-3 rounded-full bg-chart-contribution" />
					<span className="text-primary-500 text-xs">
						Tu porcentaje acumulado
					</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="size-3 rounded-full bg-chart-remaining" />
					<span className="text-primary-500 text-xs">
						Porcentaje faltante para el total
					</span>
				</div>
			</div>
			<Chart
				ariaLabel={label}
				definition={breakdownData}
				className="breakdown-chart"
			/>
		</div>
	)
}
