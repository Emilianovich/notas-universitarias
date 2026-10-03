import type {ModalProps} from "@/contexts/modal.ts";

export default function Modal({
                                  modalTitle,
                                  Content,
                              }: ModalProps) {
    return (
        <div
            className={`flex text-primary-400 items-center justify-center p-8 gap-4 bg-secondary h-[min(300px,calc(100dvh-32px))] rounded-[20px] transition-all ease-in-out duration-300`}
            style={{ aspectRatio: "151 / 89" }}
        >
            <div className={"modal-wrapper w-[90%]"}>
                <h2 className={"text-primary-500 sm:text-2xl xl:text-3xl font-bold"}>
                    {modalTitle}
                </h2>
                {Content}
            </div>
        </div>
    );
}