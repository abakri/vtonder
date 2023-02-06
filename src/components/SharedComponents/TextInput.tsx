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
        <div className="flex flex-col gap-y-1 w-full">
            <label htmlFor={name}>{label}</label>
            <input
                type={type || "text"}
                id={name}
                name={name}
                disabled={disabled || false}
                placeholder={placeholder}
                onChange={(e) => onChange && onChange(e.target.value)}
                className="border-2 border-black rounded-lg h-10 p-2"
            />
            <InputError message={error} />
        </div>
    );
}