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
        <div className="flex flex-col w-[150px] h-max-[150px] h-min-[150px]">
            <label htmlFor={name}>{label}</label>
            <div
                {...getRootProps()}
                className="flex flex-col justify-center items-center border-2 border-black border-dashed rounded-lg p-4 h-32"
            >
                {value ? (
                    <div className="flex flex-col justify-center w-full h-full w-max-full h-max-full overflow-hidden">
                        <TiDocument className=" text-3xl" />
                        <p className="truncate text-left">{value.name}</p>
                    </div>
                ) : (
                    <>
                        <input id={name} name={name} {...getInputProps()} />
                        <div>Choose a file<br />or drag it here</div>
                    </>
                )}
            </div>
            {error && <InputError message={error} />}
        </div>
    )
}