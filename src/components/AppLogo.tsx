import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number | string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'w-10 h-10', size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        <radialGradient id="skyGradLogo" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#40c9ff" />
          <stop offset="45%" stopColor="#0099ff" />
          <stop offset="100%" stopColor="#0052cc" />
        </radialGradient>

        <linearGradient id="rayGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="ringGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#84cc16" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>

        <linearGradient id="woodGradLogo" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="40%" stopColor="#542409" />
          <stop offset="100%" stopColor="#3b1706" />
        </linearGradient>

        <linearGradient id="porGradLogo" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        <linearGradient id="letA1Logo" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ff4500" /><stop offset="100%" stopColor="#c22700" /></linearGradient>
        <linearGradient id="letVLogo" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ff8c00" /><stop offset="100%" stopColor="#d95b00" /></linearGradient>
        <linearGradient id="letELogo" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ffcc00" /><stop offset="100%" stopColor="#e6a100" /></linearGradient>
        <linearGradient id="letNLogo" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#a3e635" /><stop offset="100%" stopColor="#65a30d" /></linearGradient>
        <linearGradient id="letTLogo" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#15803d" /></linearGradient>
        <linearGradient id="letULogo" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#0e7490" /></linearGradient>
        <linearGradient id="letRLogo" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1d4ed8" /></linearGradient>
        <linearGradient id="letA2Logo" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#2563eb" /></linearGradient>
      </defs>

      {/* Rounded Squircle Container */}
      <rect width="512" height="512" rx="115" fill="url(#skyGradLogo)" />

      {/* Sunbeams */}
      <path d="M256 256 L120 0 L180 0 Z" fill="url(#rayGradLogo)" />
      <path d="M256 256 L330 0 L390 0 Z" fill="url(#rayGradLogo)" />
      <path d="M256 256 L512 120 L512 180 Z" fill="url(#rayGradLogo)" />
      <path d="M256 256 L0 120 L0 180 Z" fill="url(#rayGradLogo)" />

      {/* Left Adventure Canopy Tower */}
      <g stroke="#3e2723" strokeWidth="4" fill="#a0522d">
        <line x1="85" y1="90" x2="80" y2="280" stroke="#5c3818" strokeWidth="8" strokeLinecap="round" />
        <line x1="125" y1="90" x2="135" y2="280" stroke="#5c3818" strokeWidth="8" strokeLinecap="round" />
        <line x1="65" y1="120" x2="60" y2="280" stroke="#4a2c11" strokeWidth="7" strokeLinecap="round" />
        <rect x="55" y="110" width="85" height="14" rx="3" fill="#8b5a2b" stroke="#3e2723" strokeWidth="3" />
        <rect x="70" y="200" width="70" height="12" rx="3" fill="#8b5a2b" stroke="#3e2723" strokeWidth="3" />
        <polygon points="50,110 95,75 145,110" fill="#6d431d" stroke="#2c1708" strokeWidth="4" />
        <line x1="125" y1="210" x2="185" y2="230" stroke="#d97706" strokeWidth="4" />
        <line x1="125" y1="225" x2="185" y2="245" stroke="#92400e" strokeWidth="4" />
        <line x1="140" y1="215" x2="140" y2="235" stroke="#78350f" strokeWidth="3" />
        <line x1="155" y1="220" x2="155" y2="240" stroke="#78350f" strokeWidth="3" />
        <line x1="170" y1="225" x2="170" y2="245" stroke="#78350f" strokeWidth="3" />
      </g>

      {/* Right Climbing Tower */}
      <g>
        <polygon points="370,80 430,70 450,260 365,270" fill="#f97316" stroke="#c2410c" strokeWidth="4" />
        <polygon points="370,80 345,95 340,275 365,270" fill="#0284c7" stroke="#0369a1" strokeWidth="4" />
        <polygon points="345,95 400,65 430,70 370,80" fill="#78350f" stroke="#451a03" strokeWidth="4" />
        <circle cx="360" cy="120" r="7" fill="#fbbf24" />
        <circle cx="385" cy="105" r="8" fill="#38bdf8" />
        <circle cx="415" cy="115" r="7" fill="#ec4899" />
        <circle cx="375" cy="145" r="9" fill="#22c55e" />
        <circle cx="405" cy="150" r="8" fill="#fb923c" />
        <circle cx="365" cy="180" r="8" fill="#a855f7" />
        <circle cx="420" cy="185" r="7.5" fill="#facc15" />
        <circle cx="390" cy="210" r="9" fill="#06b6d4" />
        <circle cx="355" cy="225" r="8" fill="#f43f5e" />
      </g>

      {/* Outer Green Ring Frame */}
      <circle cx="256" cy="245" r="195" fill="none" stroke="url(#ringGradLogo)" strokeWidth="24" />
      <circle cx="256" cy="245" r="183" fill="none" stroke="#fef08a" strokeWidth="3" opacity="0.6" />

      {/* Zipline Wire */}
      <path d="M120 115 Q256 160 380 95" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />

      {/* Zipline Adventurer Silhouette */}
      <g transform="translate(230, 105)">
        <circle cx="25" cy="16" r="6" fill="#64748b" stroke="#0f172a" strokeWidth="3" />
        <line x1="25" y1="20" x2="25" y2="40" stroke="#334155" strokeWidth="4" />
        <circle cx="25" cy="45" r="10" fill="#1e293b" />
        <path d="M22 38 Q32 36 34 44" fill="#0f172a" />
        <path d="M25 52 L16 35 M25 52 L32 34" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
        <path d="M20 52 L30 52 L26 76 L18 76 Z" fill="#1e293b" />
        <circle cx="23" cy="74" r="5" fill="#0284c7" />
        <path d="M19 76 L8 88 L-4 82" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 76 L36 94 L46 98" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="-7" cy="81" rx="6" ry="4" fill="#0f172a" />
        <ellipse cx="49" cy="99" rx="6" ry="4" fill="#0f172a" />
      </g>

      {/* Nature Base */}
      <g transform="translate(0, 10)">
        <path d="M190 395 Q256 360 322 395 L300 420 Q256 405 210 420 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <polygon points="256,335 220,385 292,385" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
        <polygon points="256,335 240,358 250,352 256,362 265,350 272,358" fill="#ffffff" />
        <polygon points="256,335 272,358 292,385 256,385" fill="#94a3b8" />
        <polygon points="195,345 180,385 210,385" fill="#166534" stroke="#14532d" strokeWidth="2" />
        <polygon points="195,345 186,365 204,365" fill="#22c55e" />
        <polygon points="315,348 300,385 330,385" fill="#166534" stroke="#14532d" strokeWidth="2" />
        <polygon points="315,348 306,365 324,365" fill="#22c55e" />
      </g>

      {/* Wooden Sign Shield */}
      <path
        d="M 68 280 Q 256 220 444 280 Q 425 390 256 425 Q 87 390 68 280 Z"
        fill="url(#woodGradLogo)"
        stroke="#facc15"
        strokeWidth="7"
      />
      <path
        d="M 78 285 Q 256 230 434 285 Q 416 380 256 414 Q 96 380 78 285 Z"
        fill="none"
        stroke="#92400e"
        strokeWidth="3"
        strokeDasharray="8,5"
      />

      {/* "POR" Text */}
      <g>
        <text
          x="256"
          y="248"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="88"
          letterSpacing="4"
          fill="#111827"
          stroke="#111827"
          strokeWidth="24"
          strokeLinejoin="round"
        >
          POR
        </text>
        <text
          x="256"
          y="248"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="88"
          letterSpacing="4"
          fill="url(#porGradLogo)"
          stroke="#ffffff"
          strokeWidth="4"
        >
          POR
        </text>
      </g>

      {/* "AVENTURA" 3D Text */}
      <g>
        <text
          x="256"
          y="348"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="80"
          letterSpacing="2"
          fill="#000000"
          stroke="#000000"
          strokeWidth="22"
          strokeLinejoin="round"
        >
          AVENTURA
        </text>
        <text x="88" y="348" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="80" fill="url(#letA1Logo)" stroke="#ffffff" strokeWidth="3">A</text>
        <text x="135" y="348" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="80" fill="url(#letVLogo)" stroke="#ffffff" strokeWidth="3">V</text>
        <text x="184" y="348" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="80" fill="url(#letELogo)" stroke="#ffffff" strokeWidth="3">E</text>
        <text x="230" y="348" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="80" fill="url(#letNLogo)" stroke="#ffffff" strokeWidth="3">N</text>
        <text x="284" y="348" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="80" fill="url(#letTLogo)" stroke="#ffffff" strokeWidth="3">T</text>
        <text x="330" y="348" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="80" fill="url(#letULogo)" stroke="#ffffff" strokeWidth="3">U</text>
        <text x="382" y="348" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="80" fill="url(#letRLogo)" stroke="#ffffff" strokeWidth="3">R</text>
        <text x="430" y="348" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="80" fill="url(#letA2Logo)" stroke="#ffffff" strokeWidth="3">A</text>
      </g>

      {/* Roller Coaster */}
      <g>
        <path d="M-10 500 Q90 400 240 510" fill="none" stroke="#b91c1c" strokeWidth="8" strokeLinecap="round" />
        <path d="M-10 512 Q90 412 240 522" fill="none" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
        <path d="M20 465 L25 480 M50 440 L55 455 M85 430 L90 445 M125 440 L130 455 M165 460 L170 475" stroke="#f59e0b" strokeWidth="5" />
        <g transform="translate(100, 400) rotate(-18)">
          <rect x="0" y="0" width="60" height="22" rx="6" fill="#ea580c" stroke="#7c2d12" strokeWidth="3" />
          <circle cx="12" cy="22" r="6" fill="#1e293b" />
          <circle cx="48" cy="22" r="6" fill="#1e293b" />
          <circle cx="16" cy="-6" r="5" fill="#1e293b" />
          <path d="M12 -2 L16 8 L20 -2" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="32" cy="-8" r="5" fill="#1e293b" />
          <path d="M26 -6 L32 8 L38 -6" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="48" cy="-6" r="5" fill="#1e293b" />
          <path d="M44 -4 L48 8 L54 -4" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>

      {/* Inflatable Slide */}
      <g>
        <path d="M370 512 Q400 410 440 430 Q470 445 500 512" fill="#22c55e" stroke="#15803d" strokeWidth="5" />
        <path d="M390 512 Q415 440 435 445 Q455 450 475 512" fill="#0284c7" stroke="#0369a1" strokeWidth="4" />
        <path d="M380 435 Q400 370 430 380 Q450 390 460 445" fill="#facc15" stroke="#ca8a04" strokeWidth="5" />
        <line x1="395" y1="375" x2="395" y2="355" stroke="#334155" strokeWidth="3" />
        <polygon points="395,355 418,363 395,371" fill="#ef4444" />
      </g>

      {/* Gloss reflection overlay */}
      <path d="M 0 115 C 0 50, 50 0, 115 0 L 397 0 C 462 0, 512 50, 512 115 C 400 160, 112 160, 0 115 Z" fill="#ffffff" opacity="0.18" />
    </svg>
  );
};
