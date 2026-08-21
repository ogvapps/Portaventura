import { AreaId } from '../types';
import { ATTRACTIONS } from './attractions';

export type AttractionStatus = 'open' | 'closed' | 'maintenance' | 'weather_delay';

export interface AttractionWaitTime {
  attractionId: string;
  name: string;
  areaId: AreaId;
  status: AttractionStatus;
  waitMinutes: number;
  expressAvailable: boolean;
  expressWaitMinutes?: number;
  singleRiderAvailable: boolean;
  singleRiderWaitMinutes?: number;
  trend: 'rising' | 'falling' | 'stable';
  lastUpdated: string;
  historicalPeakHour: string; // e.g. "14:00 - 16:30"
  capacityPerHour: number;
}

// Base average wait times by attraction category and popularity
const BASE_WAIT_TIMES: Record<string, { baseMin: number; express: boolean; singleRider: boolean }> = {
  // Ultra Popular Coasters & Thrills
  'shambhala': { baseMin: 55, express: true, singleRider: true },
  'dragon-khan': { baseMin: 45, express: true, singleRider: true },
  'furius-baco': { baseMin: 50, express: true, singleRider: true },
  'red-force': { baseMin: 65, express: true, singleRider: true },
  'uncharted': { baseMin: 55, express: true, singleRider: true },
  'hurakan-condor': { baseMin: 40, express: true, singleRider: true },
  'stampida': { baseMin: 35, express: true, singleRider: false },
  
  // Water Attractions
  'tutuki-splash': { baseMin: 45, express: true, singleRider: false },
  'silver-river-flume': { baseMin: 40, express: true, singleRider: false },
  'grand-canyon-rapids': { baseMin: 35, express: true, singleRider: false },
  'angkor': { baseMin: 20, express: true, singleRider: false },

  // Dark rides & Simulators
  'street-mission': { baseMin: 30, express: true, singleRider: false },
  'templo-del-fuego': { baseMin: 25, express: false, singleRider: false },
  'flying-dreams': { baseMin: 35, express: true, singleRider: false },
  'racing-legends': { baseMin: 30, express: true, singleRider: false },

  // Moderate & Family Thrills
  'el-diablo': { baseMin: 25, express: true, singleRider: false },
  'tomahawk': { baseMin: 20, express: true, singleRider: false },
  'thrill-towers-caida': { baseMin: 25, express: true, singleRider: false },
  'thrill-towers-rebote': { baseMin: 25, express: true, singleRider: false },
  'maranello-grand-race': { baseMin: 30, express: true, singleRider: false },
  'volpaiute': { baseMin: 15, express: false, singleRider: false },
  'serpiente-emplumada': { baseMin: 15, express: false, singleRider: false },
  'crazy-barrels': { baseMin: 15, express: false, singleRider: false },
  'wild-buffalos': { baseMin: 15, express: false, singleRider: false },
  'canoes': { baseMin: 10, express: false, singleRider: false },
  'tea-cups': { baseMin: 10, express: false, singleRider: false },
  'kontiki': { baseMin: 15, express: false, singleRider: false },
  'cobracha': { baseMin: 10, express: false, singleRider: false },
  'los-potrillos': { baseMin: 10, express: false, singleRider: false },
  'armadillos': { baseMin: 5, express: false, singleRider: false },
  'carousel': { baseMin: 10, express: false, singleRider: false },

  // SésamoAventura
  'tami-tami': { baseMin: 20, express: true, singleRider: false },
  'coco-piloto': { baseMin: 15, express: false, singleRider: false },
  'la-granja-de-elmo': { baseMin: 15, express: false, singleRider: false },
  'mariposas-saltarinas': { baseMin: 10, express: false, singleRider: false },
  'magic-fish': { baseMin: 10, express: false, singleRider: false },
  'el-huerto-encantado': { baseMin: 5, express: false, singleRider: false },
  'el-salto-de-blas': { baseMin: 10, express: false, singleRider: false },
  'kiddi-dragons': { baseMin: 5, express: false, singleRider: false },
  'sreet-mission-kids': { baseMin: 15, express: false, singleRider: false },

  // Ferrari Land Kids / Family
  'junior-championship': { baseMin: 15, express: false, singleRider: false },
  'flying-race': { baseMin: 10, express: false, singleRider: false },
  'crazy-pistons': { baseMin: 10, express: false, singleRider: false },
  'champions-race': { baseMin: 10, express: false, singleRider: false },
  'pole-position-challenge': { baseMin: 25, express: false, singleRider: false },
};

/**
 * Generates initial or updated live wait times with organic variations
 */
export function generateLiveWaitTimes(jitterOffset = 0): Record<string, AttractionWaitTime> {
  const result: Record<string, AttractionWaitTime> = {};
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  ATTRACTIONS.forEach((attraction) => {
    const config = BASE_WAIT_TIMES[attraction.id] || {
      baseMin: attraction.intensity === 'Extrema' ? 45 : attraction.intensity === 'Fuerte' ? 30 : 15,
      express: true,
      singleRider: attraction.intensity === 'Extrema',
    };

    // Minor random organic jitter (-10 to +15 mins, stepped by 5 mins)
    const randomShift = (Math.floor(Math.sin(attraction.name.length + jitterOffset) * 3) * 5);
    let waitMinutes = Math.max(5, config.baseMin + randomShift);

    // Round to nearest 5 minutes
    waitMinutes = Math.round(waitMinutes / 5) * 5;

    // Simulate occasional maintenance for 1-2 rides
    let status: AttractionStatus = 'open';
    if (attraction.id === 'cobracha' && jitterOffset % 3 === 0) {
      status = 'maintenance';
      waitMinutes = 0;
    }

    const trend: 'rising' | 'falling' | 'stable' =
      waitMinutes > config.baseMin ? 'rising' : waitMinutes < config.baseMin ? 'falling' : 'stable';

    const expressWaitMinutes = config.express && status === 'open' ? Math.max(5, Math.round(waitMinutes * 0.25 / 5) * 5) : undefined;
    const singleRiderWaitMinutes = config.singleRider && status === 'open' ? Math.max(5, Math.round(waitMinutes * 0.45 / 5) * 5) : undefined;

    result[attraction.id] = {
      attractionId: attraction.id,
      name: attraction.name,
      areaId: attraction.areaId,
      status,
      waitMinutes,
      expressAvailable: config.express,
      expressWaitMinutes,
      singleRiderAvailable: config.singleRider,
      singleRiderWaitMinutes,
      trend,
      lastUpdated: timeString,
      historicalPeakHour: '13:30 - 16:30',
      capacityPerHour: attraction.category === 'Montaña Rusa' ? 1400 : 900,
    };
  });

  return result;
}

const FAVORITES_STORAGE_KEY = 'pa_favorite_attractions';

export function getFavoriteAttractionIds(): string[] {
  if (typeof window === 'undefined') return ['shambhala', 'dragon-khan', 'tutuki-splash'];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return ['shambhala', 'dragon-khan', 'tutuki-splash'];
    return JSON.parse(raw);
  } catch {
    return ['shambhala', 'dragon-khan', 'tutuki-splash'];
  }
}

export function toggleFavoriteAttraction(id: string): string[] {
  const current = getFavoriteAttractionIds();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  if (typeof window !== 'undefined') {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}
