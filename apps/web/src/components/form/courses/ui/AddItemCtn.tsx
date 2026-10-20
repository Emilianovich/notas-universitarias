import type {ReactNode} from "react";

export default function AddItemCtn({children} : { children: ReactNode }) {
    return (
        <div className={"p-2 border-2 border-primary-400 border-dashed flex items-center justify-center rounded-lg"}>
            {children}
        </div>
    );
}