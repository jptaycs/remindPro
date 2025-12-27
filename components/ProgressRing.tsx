
import React from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  label: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ progress, size = 80, stroke = 8, color = "text-indigo-500", label }) => {
  const radius = (size / 2) - stroke;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-gray-100 dark:text-white/5"
            strokeWidth={stroke}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={`${color} transition-all duration-1000 ease-out`}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-black dark:text-white">{Math.round(progress)}%</span>
        </div>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600">{label}</span>
    </div>
  );
};
