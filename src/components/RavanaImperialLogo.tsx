'use client';

import React from 'react';

interface RavanaImperialLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const RavanaImperialLogo: React.FC<RavanaImperialLogoProps> = ({
  className = '',
  size = 40,
  glow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          {/* Imperial Rich Gold Gradient */}
          <linearGradient id="ravanaGoldGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" /> {/* amber-100 */}
            <stop offset="25%" stopColor="#FCD34D" /> {/* amber-300 */}
            <stop offset="60%" stopColor="#F59E0B" /> {/* amber-500 */}
            <stop offset="90%" stopColor="#B45309" /> {/* amber-700 */}
            <stop offset="100%" stopColor="#78350F" /> {/* amber-900 */}
          </linearGradient>

          {/* Core Sunburst Glow */}
          <radialGradient id="solarAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#D97706" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
          </radialGradient>

          {/* Gem Glow */}
          <radialGradient id="rubyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </radialGradient>

          {/* Filter for golden radiance */}
          <filter id="goldRadiance" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Ambient Solar Aura Background */}
        <circle cx="50" cy="50" r="44" fill="url(#solarAura)" />

        {/* 2. Concentric Ancient Solar Celestial Rings */}
        <circle
          cx="50"
          cy="50"
          r="41"
          stroke="url(#ravanaGoldGrad)"
          strokeWidth="1.2"
          strokeDasharray="1.5 3.5"
          className="opacity-70 group-hover:rotate-45 transition-transform duration-1000 origin-center"
        />
        <circle
          cx="50"
          cy="50"
          r="34"
          stroke="url(#ravanaGoldGrad)"
          strokeWidth="1.5"
          className="opacity-90"
        />

        {/* 3. 10 Solar Rays (Representing the 10 Maha Vidyas & Solar Dynasty) */}
        <g className="origin-center transition-transform duration-700 group-hover:rotate-12">
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, idx) => (
            <g key={angle} transform={`rotate(${angle} 50 50)`}>
              {/* Tapered Solar Flame Ray */}
              <path
                d="M50 8 L52.2 21 C51.2 22.5 48.8 22.5 47.8 21 Z"
                fill="url(#ravanaGoldGrad)"
                opacity={idx % 2 === 0 ? '1' : '0.85'}
              />
              {/* Micro Solar Bead */}
              <circle cx="50" cy="27" r="1.3" fill="#FDE68A" />
            </g>
          ))}
        </g>

        {/* 4. Center Imperial Ravana Five-Pointed Crown */}
        <g id="ravanaImperialCrown" filter="url(#goldRadiance)">
          {/* Base Crown Arch / Diadem Band */}
          <path
            d="M27 68 C35 71 65 71 73 68 C72 65 28 65 27 68 Z"
            fill="url(#ravanaGoldGrad)"
            stroke="#92400E"
            strokeWidth="0.8"
          />

          {/* Diadem Inset Line */}
          <path
            d="M30 67 C42 69 58 69 70 67"
            stroke="#FEF3C7"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* 5-Peak Crown Silhouette */}
          <path
            d="M27 66
               L26 50
               C30 54 33 55 37 46
               C40 52 44 54 50 33
               C56 54 60 52 63 46
               C67 55 70 54 74 50
               L73 66
               C65 69 35 69 27 66 Z"
            fill="url(#ravanaGoldGrad)"
            stroke="#78350F"
            strokeWidth="1"
            strokeLinejoin="round"
          />

          {/* Inner Filigree / Royal Relief */}
          <path
            d="M42 66 L50 42 L58 66 Z"
            fill="#B45309"
            fillOpacity="0.35"
          />

          {/* Center Solar Peak Diamond Finial */}
          <polygon
            points="50,29 52.5,33 50,37 47.5,33"
            fill="#FFFBEB"
            stroke="#D97706"
            strokeWidth="0.7"
          />

          {/* Flank Peaks Pearls */}
          <circle cx="26" cy="49" r="1.6" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="37" cy="45" r="1.8" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="63" cy="45" r="1.8" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="74" cy="49" r="1.6" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.5" />

          {/* Central Solar Chakra / Royal Gem at Diadem Heart */}
          <circle cx="50" cy="62" r="3.2" fill="url(#rubyGlow)" stroke="#FDE68A" strokeWidth="0.8" />
          <circle cx="41" cy="64" r="1.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.5" />
          <circle cx="59" cy="64" r="1.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.5" />
          <circle cx="33" cy="65.5" r="1.4" fill="#FDE68A" />
          <circle cx="67" cy="65.5" r="1.4" fill="#FDE68A" />
        </g>
      </svg>

      {/* Optional Outer Subtle Gold Glow Pulse */}
      {glow && (
        <div className="absolute inset-0 rounded-full bg-amber-500/15 blur-md -z-10 group-hover:bg-amber-400/25 transition-colors" />
      )}
    </div>
  );
};
