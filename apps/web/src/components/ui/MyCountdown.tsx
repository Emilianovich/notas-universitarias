import Countdown from "react-countdown"
import formatDate from "@/utils/date-formats.ts"

export default function MyCountdown({ endDate }: { endDate: Date }) {
	return (
		<div className="absolute top-0 right-2 xl:right-8 text-base 2xl:text-lg text-primary-500">
			<Countdown date={formatDate(endDate)} />
		</div>
	)
}
