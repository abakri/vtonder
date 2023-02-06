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
        <div className="flex flex-col gap-y-2 w-full">
            <label className="font-fredoka text-[#ff4589]" htmlFor={name}>{label}</label>
            <textarea
                id={name}
                name={name}
                disabled={disabled || false}
                placeholder={placeholder}
                onChange={(e) => onChange && onChange(e.target.value)}
                rows={5}
                className="w-full p-2 border-[3px] border-[#ff5c98] rounded-lg focus:outline-none resize-none placeholder-[#ff9cb4]"
                style={{
                    boxShadow: "6px 6px 0px #ff5c98"
                }}
            />
            <InputError message={error} />
        </div>
    );
}