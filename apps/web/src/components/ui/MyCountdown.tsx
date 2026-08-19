import Countdown from "react-countdown";
import formatDate from "@/utils/date-formats.ts";

export default function MyCountdown({ endDate }: { endDate: Date }) {
    return (
        <div className="fixed top-[20%] right-[10%] text-[16px] text-primary-500">
            <Countdown date={formatDate(endDate)} />
        </div>
    );
}
