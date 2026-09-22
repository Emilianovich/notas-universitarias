export type CtxMenuOptsProps = {
    text: string
    navigateTo: () => Promise<void> | void
}
export default function ContextMenuOption({text, navigateTo}: CtxMenuOptsProps) {
    return (
        <button
            type="button"
            onClick={() => navigateTo()}
            className={"px-2 text-left w-full text-primary-500 transition-all duration-300 ease-in-out hover:bg-primary-300 cursor-pointer rounded-sm h-15 hover:text-success-bg"}
        >
            {text}
        </button>
    )
}