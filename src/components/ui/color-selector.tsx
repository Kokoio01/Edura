import React, { useState, useEffect, useRef } from "react";
import { Input } from "./input";

function normalizeHex(input?: string): string {
    if (!input) return "#000000";
    let hex = input.trim().replace(/^#/, "");

    if (hex.length === 3) {
        hex = hex.split("").map((c) => c + c).join("");
    }

    if (!/^([0-9a-fA-F]{6})$/.test(hex)) return "#000000";
    return `#${hex.toLowerCase()}`;
}

function isValidHex(input: string): boolean {
    const hex = input.trim().replace(/^#/, "");
    return /^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}

type Props = {
    initialColor?: string;
    onChange?: (hex: string) => void;
};

export default function ColorSelector({ initialColor = "#3b82f6", onChange }: Props) {
    const [color, setColor] = useState<string>(() => normalizeHex(initialColor));
    const [hexInput, setHexInput] = useState<string>(() => normalizeHex(initialColor));
    const [isValid, setIsValid] = useState<boolean>(true);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        onChange?.(color);
    }, [color, onChange]);

    function updateColor(newColor: string) {
        const normalized = normalizeHex(newColor);
        setColor(normalized);
        setHexInput(normalized);
        setIsValid(true);
    }

    function handleHexChange(value: string) {
        let cleaned = value.trim();

        cleaned = cleaned.replace(/[^0-9a-fA-F#]/gi, "");

        setHexInput(cleaned);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        const valid = isValidHex(cleaned);
        setIsValid(valid);

        if (valid) {
            debounceRef.current = setTimeout(() => {
                const normalized = normalizeHex(cleaned);
                setColor(normalized);
            }, 150);
        }
    }

    function handleHexBlur() {
        if (!isValid || !hexInput.trim()) {
            setHexInput(color);
            setIsValid(true);
        } else {
            const normalized = normalizeHex(hexInput);
            setColor(normalized);
            setHexInput(normalized);
        }
    }

    function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
        updateColor(e.target.value);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleHexBlur();
        }
        if (e.key === "Escape") {
            setHexInput(color);
            setIsValid(true);
        }
    }

    return (
        <div className="flex flex-row gap-2">
            <label className="flex items-center gap-2">
                <Input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="w-10 h-8 p-0 border-0 bg-transparent transition-colors"
                    aria-label="Visual color picker"
                />
            </label>

            <label className="flex items-center gap-2 w-full">
                <Input
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                    onBlur={handleHexBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="#3b82f6"
                    className={`font-mono text-sm transition-colors ${
                        !isValid
                            ? "border-red-400 bg-red-50 focus:ring-red-500"
                            : "focus:ring-blue-500"
                    }`}
                    aria-label="Hex color input"
                />
            </label>
        </div>
    );
}