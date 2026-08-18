

export function CurrentPeriodPending() {
    return (
        <main className={"flex flex-col items-center justify-center"}>
            <section className="flex flex-col items-center justify-center gap-10 animate-pulse">
                <div className="flex flex-col justify-center items-center gap-10 mb-8">
                    <div className="w-80 h-5 bg-gray-200 rounded-sm"></div>
                    <div className="w-60 h-5 bg-gray-200 rounded-sm"></div>
                </div>
                <div className="flex flex-col gap-10 justify-center items-center p-4">
                    <div className="flex justify-center items-centergap-4 max-w-175 flex-wrap gap-10">
                        <div
                            className="w-80 h-30 py4 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] flex items-center justify-center transition-all duration-300 ease-in-out bg-gray-200"></div>
                        <div
                            className="w-80 h-30 py4 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] flex items-center justify-center transition-all duration-300 ease-in-out bg-gray-200"></div>
                        <div
                            className="w-80 h-30 py4 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] flex items-center justify-center transition-all duration-300 ease-in-out bg-gray-200"></div>
                        <div
                            className="w-80 h-30 py4 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] flex items-center justify-center transition-all duration-300 ease-in-out bg-gray-200"></div>
                    </div>
                    <div className={"flex flex-col gap-4 justify-center items-center"}>
                        <div className="w-40 h-4 bg-gray-200 rounded-sm"></div>
                        <div className="size-4 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            </section>
        </main>
    );
}