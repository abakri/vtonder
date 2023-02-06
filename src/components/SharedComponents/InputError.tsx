import React from 'react'

export type InputErrorProps = {
    message?: string;
}

export const InputError: React.FC<InputErrorProps> = ({ message }) => (
    <>
        {message && <p className="text-red-500 text-sm ml-1">{message}</p>}
    </>
)