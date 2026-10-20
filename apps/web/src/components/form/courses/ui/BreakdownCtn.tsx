import type {ReactNode} from "react";

export default function BreakdownCtn({ children } : { children: ReactNode }) {
    return (
        <div className={"bg-tertiary border border-primary-300 rounded-lg p-4"}>
            {children}
        </div>
    );
}