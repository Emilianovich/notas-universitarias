import type { CourseInstance } from "@notas-universitarias/types"
import { BreakdownEntryDetail } from "@/components/course-instance-details/BreakdownEntryDetail.tsx"
import getEntriesFromBreakdown from "@/utils/getEntriesFromBreakdown.ts"

export default function BreakdownEntriesDetail({
	course
}: {
	course: CourseInstance
}) {
	const details = getEntriesFromBreakdown(course)
	return (
		<>
			{details.map((detail, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <The keys don't change between renders>
				<BreakdownEntryDetail breakdownDetail={detail} key={index} />
			))}
		</>
	)
}
