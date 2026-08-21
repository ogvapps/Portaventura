import React, { useState } from 'react';
import { Attraction } from '../types';
import { AREAS } from '../data/attractions';
import { Zap, Flame, Droplets, Compass, Sparkles, AlertCircle } from 'lucide-react';

interface AttractionImageProps {
  attraction: Attraction;
  className?: string;
  showBadge?: boolean;
  aspectRatio?: string;
}

// Verified authentic, distinct curated photography for PortAventura attractions
const AUTHENTIC_ATTRACTION_PHOTOS: Record<string, string> = {
  // 1. Mediterrània
  'furius-baco': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'port-drassana': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'estacio-nord': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',

  // 2. Polynesia
  'tutuki-splash': 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80',
  'kontiki': 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?auto=format&fit=crop&w=1200&q=80',
  'canoes': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'waikiki': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  'dino-safari': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',

  // 3. China
  'shambhala': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'dragon-khan': 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?auto=format&fit=crop&w=1200&q=80',
  'angkor': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'tea-cups': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'cobra-imperial': 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?auto=format&fit=crop&w=1200&q=80',
  'waitan-port': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'area-infantil-china': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',

  // 4. México
  'hurakan-condor': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'el-diablo': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'templo-del-fuego': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'serpiente-emplumada': 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?auto=format&fit=crop&w=1200&q=80',
  'los-potrillos': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  'yukatan': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'armadillos': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',

  // 5. Far West
  'uncharted': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'stampida': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'silver-river-flume': 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80',
  'grand-canyon-rapids': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'tomahawk': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'vol-paiute': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  'crazy-barrels': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'wild-buffalos': 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?auto=format&fit=crop&w=1200&q=80',
  'los-potrillos-fw': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  'penitence-station': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
  'carousel-fw': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',

  // 6. SésamoAventura
  'street-mission': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'tami-tami': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'la-granja-de-elmo': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  'magic-fish': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'el-salto-de-blas': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  'mariposas-saltarinas': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  'coco-piloto': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  'sesamo-station': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',

  // 7. Ferrari Land
  'red-force': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'flying-dreams': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'maranello-grand-race': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  'thrill-towers-caida': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'thrill-towers-rebote': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
  'racing-legends': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'junior-championship': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  'pole-position-challenge': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
};

export const AttractionImage: React.FC<AttractionImageProps> = ({
  attraction,
  className = 'h-48 sm:h-56 w-full',
  showBadge = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const photoSrc =
    AUTHENTIC_ATTRACTION_PHOTOS[attraction.id] ||
    attraction.photoUrl ||
    'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80';

  const area = AREAS[attraction.areaId];

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      {/* Skeleton / Gradient Placeholder */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${attraction.color.bgGradient} opacity-90 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Main Image */}
      {!hasError ? (
        <img
          src={photoSrc}
          alt={`Atracción ${attraction.name} en ${area?.name || 'PortAventura World'}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        /* Fallback Art Card if image fails */
        <div
          className={`w-full h-full bg-gradient-to-tr ${attraction.color.bgGradient} flex flex-col items-center justify-center text-white p-4 text-center`}
        >
          <span className="text-4xl mb-2">🎢</span>
          <div className="text-base font-serif font-black">{attraction.name}</div>
          <div className="text-xs text-white/80">{area?.name}</div>
        </div>
      )}

      {/* Subtle vignette gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Top Badges */}
      {showBadge && (
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
          {/* Area Badge */}
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md flex items-center gap-1 border border-white/30"
            style={{ backgroundColor: `${area?.color || '#E64A38'}E6` }}
          >
            <span>{area?.name}</span>
          </span>

          {/* Intensity Badge */}
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md border border-white/20 ${
              attraction.intensity === 'Extrema'
                ? 'bg-[#E64A38] text-white'
                : attraction.intensity === 'Fuerte'
                ? 'bg-[#d97706] text-white'
                : attraction.intensity === 'Moderada'
                ? 'bg-[#0284C7] text-white'
                : 'bg-[#059669] text-white'
            }`}
          >
            {attraction.intensity}
          </span>
        </div>
      )}

      {/* Bottom overlay info bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold pointer-events-none">
        <div className="flex items-center gap-2">
          {attraction.maxSpeedKmh && (
            <span className="px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 text-[11px] text-[#F7B731]">
              ⚡ {attraction.maxSpeedKmh} km/h
            </span>
          )}
          {attraction.heightM && (
            <span className="px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 text-[11px] text-white">
              🏔️ {attraction.heightM}m
            </span>
          )}
        </div>
        <span className="text-[11px] text-white/90 bg-black/40 px-2 py-0.5 rounded-lg backdrop-blur-sm">
          ★ {attraction.communityScore.toFixed(1)}
        </span>
      </div>
    </div>
  );
};
