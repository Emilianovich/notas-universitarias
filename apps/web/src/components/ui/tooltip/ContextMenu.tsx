import {type RefObject, useEffect, useRef} from "react";
import ContextMenuOption, {type CtxMenuOptsProps} from "@/components/ui/tooltip/ContextMenuOption.tsx";

type CtxMenuOpts = {
    opts: CtxMenuOptsProps[]
    id: string
    cursorLocation: {
        x: number
        y: number
    }
}
export default function ContextMenu({opts, id, cursorLocation} : CtxMenuOpts) {
    return (
        <div className={"fixed inset-0 z-10"}>
            <div
                className={`bg-success-bg w-75 p-4 fixed flex flex-col items-center justify-center border gap-2 rounded-md`}
                id={id}
                style={{
                    top: `${cursorLocation.y}px`,
                    left: `${cursorLocation.x}px`
                }}
            >
                {opts.map((tooltip, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <Keys are stable>
                    <ContextMenuOption key={i} {...tooltip} />
                ))}
            </div>
            <div className={"fixed border border-l-2"}></div>
        </div>
    );
}