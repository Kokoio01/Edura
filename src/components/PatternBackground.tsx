import React from "react";

interface PatternBackgroundProps {
    color?: string;
    className?: string;
    patternHeight?: string | "auto";
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const cleanHex = hex.replace(/^#/, "");
    if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
        return null;
    }
    const expandedHex = cleanHex.length === 3
        ? cleanHex.split("").map(x => x + x).join("")
        : cleanHex;
    const num = parseInt(expandedHex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
}

function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0.5;
    const { r, g, b } = rgb;
    const [R, G, B] = [r, g, b].map(v => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

const PatternBackground: React.FC<PatternBackgroundProps> = ({
                                                                 color = "#E4844A",
                                                                 className = "",
                                                             }) => {
    const luminance = getLuminance(color);
    const backgroundColor = luminance < 0.5 ? "#F3F3F3" : "#1A1A1A";

    const patternStyle: React.CSSProperties = {
        backgroundImage: `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(3) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='${encodeURIComponent(backgroundColor)}'/><path d='M10-10L20 0v10L10 0zM20 0L10-10V0l10 10zm0 10L10 0v10l10 10zm0 10L10 10v10l10 10zM0 20l10-10v10L0 30zm0-10L10 0v10L0 20zM0 0l10-10V0L0 10z'  stroke-width='1.5' stroke='${encodeURIComponent(color)}' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(-120,-120)' fill='url(%23a)'/></svg>")`
    } as React.CSSProperties;

    return <div className={className} style={patternStyle} />;
};

export default PatternBackground;