"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface SkillsInputProps {
    value: string[];
    onChange: (skills: string[]) => void;
    placeholder?: string;
    maxSkills?: number;
}

export function SkillsInput({
    value,
    onChange,
    placeholder = "Tambahkan skill...",
    maxSkills = 20,
}: SkillsInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            addSkill(inputValue.trim());
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            // Remove last skill when backspace on empty input
            removeSkill(value.length - 1);
        }
    };

    const addSkill = (skill: string) => {
        if (value.length >= maxSkills) {
            return;
        }
        if (!value.includes(skill)) {
            onChange([...value, skill]);
            setInputValue("");
        }
    };

    const removeSkill = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 min-h-[42px]">
                {value.map((skill, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                    >
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? placeholder : ""}
                    disabled={value.length >= maxSkills}
                    className="flex-1 min-w-[120px] outline-none bg-transparent text-black placeholder:text-gray-400 disabled:cursor-not-allowed"
                />
            </div>
            <p className="mt-1 text-xs text-gray-500">
                Tekan Enter untuk menambahkan skill. Maksimal {maxSkills} skills.
                {value.length > 0 && ` (${value.length}/${maxSkills})`}
            </p>
        </div>
    );
}
