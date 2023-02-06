import React from 'react'
import { useDropzone } from 'react-dropzone'
import { TiDocument } from 'react-icons/ti'
import { InputError } from './InputError';

export type DropzoneProps = {
    error?: string;
    label: string;
    name: string;
    value?: File | null;
    onDrop?: (files: File[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ error, label, name, onDrop, value }) => {
    const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false })
    return (
        <div className="flex flex-col w-full h-[150px] gap-y-2">
            <label className="font-fredoka text-[#ff4589]" htmlFor={name}>{label}</label>
            <div
                {...getRootProps()}
                className="flex flex-col w-full sm:w-[150px] justify-center items-center border-[3px] border-[#ff5c98] border-dashed rounded-lg p-4 h-32"
            >
                {value ? (
                    <div className="flex flex-col justify-center w-full h-full w-max-full h-max-full overflow-hidden">
                        <TiDocument className=" text-3xl" />
                        <p className="truncate text-left font-fredoka">{value.name}</p>
                    </div>
                ) : (
                    <>
                        <input id={name} name={name} {...getInputProps()} />
                        <div className="font-fredoka text-[#ff5c98]">Choose a file<br />or drag it here</div>
                    </>
                )}
            </div>
            {error && <InputError message={error} />}
        </div>
    )
}