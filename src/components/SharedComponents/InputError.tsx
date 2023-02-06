import React from 'react'

export type InputErrorProps = {
    message?: string;
}

export const InputError: React.FC<InputErrorProps> = ({ message }) => (
    <>
        {message && <p className="font-fredoka text-[#ff5c98] text-sm ml-1">{message}</p>}
    </>
)