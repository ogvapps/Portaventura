import React from 'react';

// Carnival Bunting Garland
export const CarnivalBunting: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-full overflow-hidden flex items-center justify-between pointer-events-none select-none opacity-80 ${className}`}>
    <svg viewBox="0 0 800 36" className="w-full h-8 text-[#E64A38]" preserveAspectRatio="none" fill="none">
      {/* String */}
      <path d="M 0,6 Q 100,16 200,6 Q 300,16 400,6 Q 500,16 600,6 Q 700,16 800,6" stroke="#C94A4A" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Flags with alternating flyer colors: Coral, Sunshine Yellow, Royal Blue, Lavender, Mint */}
      <polygon points="40,9 65,9 52,28" fill="#E64A38" />
      <polygon points="120,11 145,11 132,30" fill="#F7B731" />
      <polygon points="200,9 225,9 212,28" fill="#45B7D1" />
      <polygon points="280,11 305,11 292,30" fill="#8E7CC3" />
      <polygon points="360,9 385,9 372,28" fill="#E64A38" />
      <polygon points="440,11 465,11 452,30" fill="#81B29A" />
      <polygon points="520,9 545,9 532,28" fill="#F7B731" />
      <polygon points="600,11 625,11 612,30" fill="#45B7D1" />
      <polygon points="680,9 705,9 692,28" fill="#8E7CC3" />
      <polygon points="760,11 785,11 772,30" fill="#E64A38" />
    </svg>
  </div>
);

// Retro Amusement Park Castle & Coaster Silhouette (from Image 1)
export const ParkSkylineBanner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
    <svg viewBox="0 0 600 120" className="w-full max-w-xl h-auto text-[#E64A38]/30" fill="none">
      {/* Coaster track loops */}
      <path
        d="M 20,100 Q 80,10 140,80 T 260,30 Q 320,110 380,50 T 500,20 Q 550,60 580,100"
        stroke="#45B7D1"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 20,105 Q 80,15 140,85 T 260,35 Q 320,115 380,55 T 500,25 Q 550,65 580,105"
        stroke="#38A3A5"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      {/* Support pillars */}
      <line x1="80" y1="55" x2="80" y2="115" stroke="#45B7D1" strokeWidth="2" />
      <line x1="200" y1="55" x2="200" y2="115" stroke="#45B7D1" strokeWidth="2" />
      <line x1="320" y1="80" x2="320" y2="115" stroke="#45B7D1" strokeWidth="2" />
      <line x1="440" y1="40" x2="440" y2="115" stroke="#45B7D1" strokeWidth="2" />

      {/* Castle Towers (from Borcelle flyer) */}
      <rect x="250" y="60" width="100" height="55" fill="#FCE8DD" stroke="#E64A38" strokeWidth="2" rx="4" />
      <polygon points="245,60 270,15 295,60" fill="#E64A38" stroke="#E64A38" strokeWidth="2" />
      <polygon points="305,60 330,15 355,60" fill="#E64A38" stroke="#E64A38" strokeWidth="2" />
      {/* Central Gate */}
      <path d="M 285,115 V 90 A 15,15 0 0,1 315,90 V 115 Z" fill="#2A1845" />
      {/* Flags on towers */}
      <polygon points="270,15 285,20 270,25" fill="#F7B731" />
      <polygon points="330,15 345,20 330,25" fill="#F7B731" />
      {/* Ferris Wheel Silhouette in background */}
      <circle cx="100" cy="55" r="32" stroke="#8E7CC3" strokeWidth="2" strokeDasharray="3 3" />
      <line x1="100" y1="55" x2="100" y2="115" stroke="#8E7CC3" strokeWidth="2" />
      <line x1="85" y1="115" x2="115" y2="115" stroke="#8E7CC3" strokeWidth="3" />
    </svg>
  </div>
);

// Golden Sparkle Stars (from Image 3)
export const StarSparkles: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-1 text-[#F7B731] ${className}`}>
    <span>✦</span>
    <span className="text-xs">★</span>
    <span className="text-[10px]">✦</span>
  </span>
);

// Retro Ticket Stamp Badge
export const TicketStamp: React.FC<{ text: string; sub?: string; className?: string }> = ({
  text,
  sub,
  className = '',
}) => (
  <div
    className={`inline-flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl border-2 border-dashed border-[#E64A38] bg-[#FCE8DD]/60 text-[#2A1845] rotate-[-2deg] shadow-xs ${className}`}
  >
    {sub && <span className="text-[9px] uppercase font-bold tracking-widest text-[#E64A38]">{sub}</span>}
    <span className="font-script text-lg font-bold text-[#E64A38] leading-none">{text}</span>
  </div>
);

// Flyer Capsule Banner (White text on coral/peach pill from Image 1)
export const FlyerCapsule: React.FC<{ children: React.ReactNode; variant?: 'coral' | 'peach' | 'indigo'; className?: string }> = ({
  children,
  variant = 'coral',
  className = '',
}) => {
  const styles = {
    coral: 'bg-[#E64A38] text-white border-2 border-white/60 shadow-sm',
    peach: 'bg-[#FCE8DD] text-[#E64A38] border border-[#E64A38]/30 font-bold',
    indigo: 'bg-[#2A1845] text-[#FFF9F3] border border-[#F7B731]/40 shadow-sm',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
};
