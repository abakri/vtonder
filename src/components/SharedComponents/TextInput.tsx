import React from 'react';
import { InputError } from './InputError';

export type TextInputProps = {
    disabled?: boolean;
    error?: string;
    type?: "text" | "number" | "password";
    label: string;
    name: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ disabled, error, type, label, name, onChange, placeholder }) => {
    return (
        <div className="flex flex-col gap-y-2 w-full">
            <label className="font-fredoka text-[#ff4589]" htmlFor={name}>{label}</label>
            <input
                type={type || "text"}
                id={name}
                name={name}
                disabled={disabled || false}
                placeholder={placeholder}
                onChange={(e) => onChange && onChange(e.target.value)}
                className="w-full border-[3px] border-[#ff5c98] rounded-lg h-10 p-2 focus:outline-none font-fredoka placeholder-[#ff9cb4]"
                style={{
                    boxShadow: "6px 6px 0px #ff5c98"
                }}
            />
            <InputError message={error} />
        </div>
    );
}