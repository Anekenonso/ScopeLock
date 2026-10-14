import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function LogoIcon({ className = "", size = 28 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer subtle shield / scope container */}
      <rect
        width="32"
        height="32"
        rx="9"
        fill="#0A0A0A"
      />
      {/* Interlocking geometric lock shackle */}
      <path
        d="M11 14V11.5C11 8.73858 13.2386 6.5 16 6.5C18.7614 6.5 21 8.73858 21 11.5V14"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Lock body / Scope target */}
      <rect
        x="9"
        y="14"
        width="14"
        height="11"
        rx="3.5"
        fill="#0284C7"
      />
      {/* Precision scope center aperture */}
      <circle
        cx="16"
        cy="19.5"
        r="2"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={size} />
      <span className="text-base font-extrabold text-ink tracking-tight">
        ScopeLock
      </span>
    </div>
  );
}
