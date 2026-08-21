import { Attraction, AttractionRating, AreaId } from '../types';
import { ATTRACTIONS, AREAS } from '../data/attractions';

export interface AttractionRecommendation {
  attraction: Attraction;
  matchPercentage: number; // 0 - 100
  reasonTitle: string;
  reasonDescription: string;
  matchTag: string;
  categoryType: 'high-thrill' | 'same-area' | 'water' | 'family' | 'dark-ride' | 'smoother-alternative' | 'top-rated';
}

/**
 * Computes smart recommendations based on an attraction evaluation
 */
export function getSmartRecommendations(
  evaluatedAttraction: Attraction,
  rating: AttractionRating,
  excludeAttractionIds: string[] = []
): AttractionRecommendation[] {
  const isHighRating = (rating.score ?? 8) >= 7;
  const isExtremeLover = (rating.adrenalineScore ?? 3) >= 4;
  const isThemingLover = (rating.themingScore ?? 3) >= 4;
  const isSkipFear = rating.skipReason === 'miedo';
  const isSkipQueue = rating.skipReason === 'mucha_cola';
  const isSkipStyle = rating.skipReason === 'no_mi_estilo';

  const otherAttractions = ATTRACTIONS.filter(
    (a) => a.id !== evaluatedAttraction.id && !excludeAttractionIds.includes(a.id)
  );

  const scoredList = otherAttractions.map((target) => {
    let score = 50; // base score
    let matchTag = 'Recomendado para ti';
    let reasonTitle = 'Atracción compatible con tu perfil';
    let reasonDescription = `Basado en tu valoración de ${evaluatedAttraction.name}.`;
    let categoryType: AttractionRecommendation['categoryType'] = 'top-rated';

    const isSameArea = target.areaId === evaluatedAttraction.areaId;
    const isSameCategory = target.category === evaluatedAttraction.category;
    const isSameIntensity = target.intensity === evaluatedAttraction.intensity;

    // Proximity in the park (Same world or neighboring)
    if (isSameArea) {
      score += 25;
    }

    // --- Scenario A: User loved the ride (Score 7-10) ---
    if (isHighRating) {
      if (evaluatedAttraction.category === 'Montaña Rusa') {
        if (target.category === 'Montaña Rusa' || target.category === 'Caída Libre') {
          score += 35;
          if (target.intensity === 'Extrema' || target.intensity === 'Fuerte') {
            score += 20;
            categoryType = 'high-thrill';
            matchTag = isSameArea ? 'Mismo Mundo • Máxima Adrenalina' : 'Adrenalina Pura';
            reasonTitle = `Porque te fascinó la velocidad de ${evaluatedAttraction.name}`;
            reasonDescription = `${target.name} ofrece una intensidad vertiginosa similar con ${target.maxSpeedKmh ? `${target.maxSpeedKmh} km/h y ` : ''}${target.heightM ? `${target.heightM}m de altura` : 'emociones fuertes'}.`;
          }
        }
      } else if (evaluatedAttraction.category === 'Acuática') {
        if (target.category === 'Acuática') {
          score += 45;
          categoryType = 'water';
          matchTag = 'Ruta de Agua & Chapuzón';
          reasonTitle = `Para seguir refrescándote en el parque`;
          reasonDescription = `Si disfrutaste del agua en ${evaluatedAttraction.name}, ${target.name} es la parada acuática perfecta.`;
        }
      } else if (evaluatedAttraction.category === 'Dark Ride / Simulador') {
        if (target.category === 'Dark Ride / Simulador' || isThemingLover) {
          score += 40;
          categoryType = 'dark-ride';
          matchTag = 'Inmersión & Efectos Especiales';
          reasonTitle = `Por tu gusto por la tematización y aventura`;
          reasonDescription = `${target.name} destaca por sus animatronics, tecnología y una gran puesta en escena.`;
        }
      } else if (evaluatedAttraction.category === 'Infantil' || evaluatedAttraction.category === 'Familiar') {
        if (target.category === 'Infantil' || target.category === 'Familiar') {
          score += 35;
          categoryType = 'family';
          matchTag = 'Ideal para Toda la Familia';
          reasonTitle = `Perfecto para continuar el recorrido familiar`;
          reasonDescription = `Una atracción accesible y muy divertida para disfrutar juntos.`;
        }
      }

      // If user loved theming
      if (isThemingLover && (target.id === 'uncharted' || target.id === 'street-mission' || target.id === 'furius-baco' || target.id === 'angkor')) {
        score += 20;
      }

      // If same area and high rating
      if (isSameArea && score >= 70) {
        matchTag = `A 2 min en ${AREAS[target.areaId]?.name}`;
        reasonDescription += ` Está justo al lado en ${target.locationDetail}.`;
      }
    } 
    // --- Scenario B: User skipped or gave low rating due to fear/intensity ---
    else if (isSkipFear || (rating.score && rating.score <= 5 && (evaluatedAttraction.intensity === 'Extrema' || evaluatedAttraction.intensity === 'Fuerte'))) {
      if (target.intensity === 'Suave' || target.intensity === 'Moderada' || target.intensity === 'Familiar') {
        score += 45;
        categoryType = 'smoother-alternative';
        matchTag = 'Más Suave & Panorámica';
        reasonTitle = `Una experiencia más relajante y disfrutable`;
        reasonDescription = `Si ${evaluatedAttraction.name} te pareció demasiado intensa, ${target.name} te permite disfrutar sin vértigo extremo.`;
        if (isSameArea) {
          score += 20;
          matchTag = `En ${AREAS[target.areaId]?.name} • Sin Vértigo`;
        }
      } else {
        score -= 40; // penalize extreme rides
      }
    }
    // --- Scenario C: Skipped due to long queue ---
    else if (isSkipQueue) {
      if (target.category !== 'Caída Libre') {
        score += 20;
        reasonTitle = `Alternativa con gran capacidad`;
        reasonDescription = `Aprovecha el tiempo en el parque con atracciones de embarque continuo.`;
      }
      if (isSameArea) {
        score += 30;
        matchTag = `Cerca en ${AREAS[target.areaId]?.name}`;
      }
    }
    // --- Scenario D: Not user style or low rating on slow rides ---
    else if (isSkipStyle || (rating.score && rating.score <= 5 && evaluatedAttraction.intensity === 'Suave')) {
      if (target.intensity === 'Fuerte' || target.intensity === 'Extrema') {
        score += 35;
        categoryType = 'high-thrill';
        matchTag = '¡Más Adrenalina!';
        reasonTitle = `Sube el nivel de emoción`;
        reasonDescription = `Si buscas sensaciones más fuertes y velocidad, prueba ${target.name}.`;
      }
    }

    // Boost top community-rated attractions slightly
    score += Math.round(target.communityScore * 2);

    // Clamp score between 60% and 99%
    const matchPercentage = Math.min(99, Math.max(65, Math.round(score)));

    return {
      attraction: target,
      matchPercentage,
      reasonTitle,
      reasonDescription,
      matchTag,
      categoryType,
    };
  });

  // Sort by match score descending
  scoredList.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Return distinct top 3 recommendations (ensuring diverse areas or strong top match)
  const result: AttractionRecommendation[] = [];
  for (const item of scoredList) {
    if (result.length >= 3) break;
    result.push(item);
  }

  return result;
}

/**
 * Returns tailored recommendations based on an entire finished session
 */
export function getSessionRecommendations(
  ratings: Record<string, AttractionRating>
): AttractionRecommendation[] {
  const ratedEntries = Object.values(ratings).filter((r) => r.rodeIt && typeof r.score === 'number');
  if (ratedEntries.length === 0) {
    // Fallback: Recommend top 3 icons
    const topIcons = ['shambhala', 'red-force', 'tutuki-splash']
      .map((id) => ATTRACTIONS.find((a) => a.id === id))
      .filter((a): a is Attraction => !!a);
    return topIcons.map((a, i) => ({
      attraction: a,
      matchPercentage: 98 - i * 3,
      reasonTitle: 'Imprescindible de PortAventura',
      reasonDescription: 'Una de las atracciones mejor valoradas por la comunidad de visitantes.',
      matchTag: 'Top del Parque',
      categoryType: 'top-rated',
    }));
  }

  // Find top rated attraction
  ratedEntries.sort((a, b) => (b.score || 0) - (a.score || 0));
  const favoriteRating = ratedEntries[0];
  const favoriteAttraction = ATTRACTIONS.find((a) => a.id === favoriteRating.attractionId);

  if (!favoriteAttraction) {
    return [];
  }

  const ratedIds = ratedEntries.map((r) => r.attractionId);
  return getSmartRecommendations(favoriteAttraction, favoriteRating, ratedIds);
}
