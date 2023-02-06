import React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

export type ImageModalProps = {
    src: string
    alt: string
}

export const ImageModal = NiceModal.create(({ src, alt }: ImageModalProps) => {
    const modal = useModal();
    return (
        <div className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity" onClick={() => modal.remove()}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <img src={src} alt={alt} className="bg-white object-scale-down transform max-w-[70%] max-h-[90%] rounded-3xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline" />
        </div>
    )
})