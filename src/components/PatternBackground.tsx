import React from "react";

interface PatternBackgroundProps {
  color?: string;
  className?: string;
}

const PatternBackground: React.FC<PatternBackgroundProps> = ({
  color = "#E4844A",
  className = "",
}) => {
  const patternStyle: React.CSSProperties = {
    "--s": "16px",
    "--color": color,
    "--g": `radial-gradient(30% 50% at 30% 100%, transparent 66%, var(--color) 67% 98%, transparent)`,
    background: `var(--g), var(--g) calc(5*var(--s)) calc(3*var(--s)), repeating-linear-gradient(90deg, var(--color) 0 10%, transparent 0 50%)`,
    backgroundSize: "calc(10*var(--s)) calc(6*var(--s))",
  } as React.CSSProperties;

  return <div className={className} style={patternStyle} />;
};

export default PatternBackground;
