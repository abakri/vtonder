import React from 'react';
import { InputError } from './InputError';

export type TextAreaProps = {
    disabled?: boolean;
    error?: string;
    type?: "text" | "number" | "password";
    label: string;
    name: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ disabled, error, label, name, onChange, placeholder }) => {
    return (
        <div className="flex flex-col gap-y-1 w-full">
            <label htmlFor={name}>{label}</label>
            <textarea
                id={name}
                name={name}
                disabled={disabled || false}
                placeholder={placeholder}
                onChange={(e) => onChange && onChange(e.target.value)}
                rows={5}
                className="border-2 border-black rounded-lg p-2"
            />
            <InputError message={error} />
        </div>
    );
}