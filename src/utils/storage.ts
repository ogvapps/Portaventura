import { ATTRACTIONS, AREAS } from '../data/attractions';
import { Attraction, AttractionRating, SurveySession, VisitorProfile } from '../types';

const SESSIONS_KEY = 'pa_survey_sessions_v1';
const ACTIVE_SESSION_KEY = 'pa_active_session_v1';

export function loadSavedSessions(): SurveySession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: SurveySession): void {
  if (typeof window === 'undefined') return;
  try {
    const sessions = loadSavedSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = { ...session, updatedAt: new Date().toISOString() };
    } else {
      sessions.unshift({ ...session, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 30)));
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Error saving session', e);
  }
}

export function loadActiveSession(): SurveySession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearActiveSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch {}
}

export function deleteSession(id: string): SurveySession[] {
  if (typeof window === 'undefined') return [];
  try {
    const sessions = loadSavedSessions().filter((s) => s.id !== id);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    const active = loadActiveSession();
    if (active?.id === id) {
      clearActiveSession();
    }
    return sessions;
  } catch {
    return [];
  }
}

export function computeVisitorProfile(ratings: Record<string, AttractionRating>): VisitorProfile {
  const ratedEntries = Object.values(ratings).filter((r) => r.rodeIt && typeof r.score === 'number');
  
  if (ratedEntries.length === 0) {
    return {
      title: 'Explorador Novato',
      archetype: 'Primeriza Visita',
      description: 'Estás dando tus primeros pasos por los mundos de PortAventura World.',
      icon: 'Compass',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      topArea: 'Mediterrània',
      maxSpeedRode: 0,
      maxHeightRode: 0,
      averageScore: 0,
    };
  }

  const scores = ratedEntries.map((r) => r.score || 0);
  const averageScore = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));

  let maxSpeed = 0;
  let maxHeight = 0;
  let waterCount = 0;
  let extremeCount = 0;
  let darkRideCount = 0;
  const areaCounts: Record<string, number> = {};

  ratedEntries.forEach((r) => {
    const attraction = ATTRACTIONS.find((a) => a.id === r.attractionId);
    if (!attraction) return;

    if (attraction.maxSpeedKmh && attraction.maxSpeedKmh > maxSpeed) {
      maxSpeed = attraction.maxSpeedKmh;
    }
    if (attraction.heightM && attraction.heightM > maxHeight) {
      maxHeight = attraction.heightM;
    }
    if (attraction.category === 'Acuática') waterCount++;
    if (attraction.intensity === 'Extrema') extremeCount++;
    if (attraction.category === 'Dark Ride / Simulador') darkRideCount++;

    areaCounts[attraction.areaId] = (areaCounts[attraction.areaId] || 0) + 1;
  });

  let topAreaId = 'china';
  let maxAreaCount = 0;
  Object.entries(areaCounts).forEach(([area, count]) => {
    if (count > maxAreaCount) {
      maxAreaCount = count;
      topAreaId = area;
    }
  });

  const topAreaName = AREAS[topAreaId as keyof typeof AREAS]?.name || 'China';

  // Archetype evaluation
  if (extremeCount >= 3 || maxSpeed >= 134) {
    return {
      title: 'Maestro de la Adrenalina',
      archetype: 'Thrillseeker Extremo',
      description: 'Nada te detiene ante las grandes colinas de Shambhala, el loop del Dragón o el despegue de Red Force. ¡Vives al límite de las fuerzas G!',
      icon: 'Flame',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      topArea: topAreaName,
      maxSpeedRode: maxSpeed,
      maxHeightRode: maxHeight,
      averageScore,
    };
  }

  if (waterCount >= 2) {
    return {
      title: 'Capitán de las Aguas',
      archetype: 'Aficionado al Chapuzón',
      description: 'Tu hábitat son las olas volcánicas de Tutuki Splash y los saltos de Silver River. ¡Incluso sin chubasquero, siempre preparado para refrescarte!',
      icon: 'Waves',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      topArea: topAreaName,
      maxSpeedRode: maxSpeed,
      maxHeightRode: maxHeight,
      averageScore,
    };
  }

  if (darkRideCount >= 2) {
    return {
      title: 'Buscador de Tesoros',
      archetype: 'Aventurero Temático',
      description: 'Aprecias la tematización inmersiva, los efectos especiales y las historias como las de Uncharted o Street Mission.',
      icon: 'Sparkles',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      topArea: topAreaName,
      maxSpeedRode: maxSpeed,
      maxHeightRode: maxHeight,
      averageScore,
    };
  }

  return {
    title: 'Viajero Equilibrado',
    archetype: 'Explorador Universal',
    description: 'Disfrutas del equilibrio perfecto entre paseos escénicos, atracciones familiares y buenas dosis de diversión.',
    icon: 'Sun',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    topArea: topAreaName,
    maxSpeedRode: maxSpeed,
    maxHeightRode: maxHeight,
    averageScore,
  };
}

export function getAttractionById(id: string): Attraction | undefined {
  return ATTRACTIONS.find((a) => a.id === id);
}
