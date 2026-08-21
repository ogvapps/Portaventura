import { Attraction, UserPreferences } from '../types';
import { ATTRACTIONS } from '../data/attractions';

export interface ScoredAttraction {
  attraction: Attraction;
  matchScore: number; // 0 - 100
  matchReasons: string[];
  heightCompatible: boolean;
}

export function calculateAttractionMatch(
  attraction: Attraction,
  preferences: UserPreferences
): { score: number; reasons: string[]; heightCompatible: boolean } {
  let score = 50;
  const reasons: string[] = [];

  // Check height restriction
  const userHeight = preferences.heightCm || 170;
  const minHeight = attraction.minHeightCm || 0;
  const heightCompatible = userHeight >= minHeight;

  if (!heightCompatible) {
    score -= 45;
  }

  // 1. Adrenaline / Intensity match
  if (preferences.adrenalinePreference === 'extrema') {
    if (attraction.intensity === 'Extrema') {
      score += 28;
      reasons.push('Adrenalina extrema pura');
    } else if (attraction.intensity === 'Fuerte') {
      score += 18;
      reasons.push('Emoción intensa');
    } else if (attraction.intensity === 'Suave' || attraction.intensity === 'Infantil') {
      score -= 15;
    }
  } else if (preferences.adrenalinePreference === 'fuerte') {
    if (attraction.intensity === 'Fuerte' || attraction.intensity === 'Extrema') {
      score += 24;
      reasons.push('Intensidad ideal');
    } else if (attraction.intensity === 'Moderada') {
      score += 15;
    }
  } else if (preferences.adrenalinePreference === 'moderada') {
    if (attraction.intensity === 'Moderada' || attraction.intensity === 'Familiar') {
      score += 26;
      reasons.push('Nivel de emoción equilibrado');
    } else if (attraction.intensity === 'Extrema') {
      score -= 25;
    }
  } else if (preferences.adrenalinePreference === 'suave') {
    if (attraction.intensity === 'Suave' || attraction.intensity === 'Familiar' || attraction.intensity === 'Infantil') {
      score += 28;
      reasons.push('Paseo cómodo y disfrutable');
    } else if (attraction.intensity === 'Extrema' || attraction.intensity === 'Fuerte') {
      score -= 35;
    }
  }

  // 2. Personality Role match
  if (preferences.personalityRole === 'valiente') {
    if (attraction.intensity === 'Extrema' || (attraction.heightM && attraction.heightM >= 50)) {
      score += 12;
      reasons.push('Reto perfecto para tu valentía');
    }
  } else if (preferences.personalityRole === 'fotografo') {
    if (attraction.areaId === 'polynesia' || attraction.areaId === 'china' || attraction.category === 'Dark Ride / Simulador') {
      score += 12;
      reasons.push('Tematización y vistas increíbles');
    }
  } else if (preferences.personalityRole === 'alma_fiesta') {
    if (attraction.category === 'Acuática' || attraction.name.includes('Stampida') || attraction.areaId === 'mexico') {
      score += 10;
      reasons.push('Diversión total con ambiente de fiesta');
    }
  } else if (preferences.personalityRole === 'tranquilo') {
    if (attraction.intensity === 'Suave' || attraction.intensity === 'Familiar') {
      score += 15;
      reasons.push('Ritmo relajado y sin estrés');
    }
  }

  // 3. Motion Tolerance
  if (preferences.motionTolerance === 'sensible') {
    if (attraction.inversions && attraction.inversions > 2) {
      score -= 20;
    } else if (attraction.category === 'Montaña Rusa' && !attraction.inversions) {
      score += 10;
      reasons.push('Sin loopings mareantes');
    }
  }

  // 4. Water preference
  if (attraction.category === 'Acuática') {
    if (preferences.waterPreference === 'empapado') {
      score += 22;
      reasons.push('¡Refrescante y empapante!');
    } else if (preferences.waterPreference === 'moderado') {
      score += 10;
      reasons.push('Salpicaduras divertidas');
    } else if (preferences.waterPreference === 'seco') {
      score -= 30;
    }
  } else {
    if (preferences.waterPreference === 'seco') {
      score += 8;
    }
  }

  // 5. Heights & Free fall
  const isHighDrop = (attraction.heightM && attraction.heightM >= 40) || attraction.category === 'Caída Libre';
  if (isHighDrop) {
    if (preferences.heightsPreference === 'alturas_totales') {
      score += 20;
      reasons.push(`Gran altura de ${attraction.heightM || '100'}m`);
    } else if (preferences.heightsPreference === 'sin_alturas') {
      score -= 30;
    }
  }

  // 6. Inversions / Loopings
  const hasInversions = attraction.inversions && attraction.inversions > 0;
  if (hasInversions) {
    if (preferences.inversionsPreference === 'muchos_loopings') {
      score += 20;
      reasons.push(`${attraction.inversions} inversiones boca abajo`);
    } else if (preferences.inversionsPreference === 'sin_inversiones') {
      score -= 35;
    }
  } else if (attraction.category === 'Montaña Rusa' && preferences.inversionsPreference === 'curvas_sin_inversion') {
    score += 18;
    reasons.push('Gran coaster sin inversiones');
  }

  // 7. Preferred Areas
  if (preferences.preferredAreas && preferences.preferredAreas.includes(attraction.areaId)) {
    score += 12;
    reasons.push('En tu mundo favorito');
  }

  // 8. Group Type
  if (preferences.groupType === 'familia_ninos') {
    if (attraction.targetAudience === 'Niños' || attraction.targetAudience === 'Toda la familia') {
      score += 15;
      reasons.push('Apta para toda la familia');
    } else if (attraction.intensity === 'Extrema') {
      score -= 10;
    }
  } else if (preferences.groupType === 'amigos') {
    if (attraction.intensity === 'Extrema' || attraction.intensity === 'Fuerte') {
      score += 10;
      reasons.push('Diversión máxima en grupo');
    }
  }

  // 9. Community rating boost
  if (attraction.communityScore >= 9.0) {
    score += 6;
  }

  // Clamp score to 15 - 99%
  const clampedScore = Math.min(99, Math.max(15, Math.round(score)));

  return {
    score: clampedScore,
    reasons: reasons.slice(0, 3),
    heightCompatible,
  };
}

export function getRecommendedAttractions(
  preferences: UserPreferences,
  limit: number = 6
): ScoredAttraction[] {
  const scored = ATTRACTIONS.map((attr) => {
    const { score, reasons, heightCompatible } = calculateAttractionMatch(attr, preferences);
    return {
      attraction: attr,
      matchScore: score,
      matchReasons: reasons,
      heightCompatible,
    };
  });

  // Sort descending by matchScore, then by communityScore
  scored.sort((a, b) => b.matchScore - a.matchScore || b.attraction.communityScore - a.attraction.communityScore);

  return scored.slice(0, limit);
}

export function determineArchetype(preferences: Partial<UserPreferences>): {
  name: string;
  badge: string;
  icon: string;
  description: string;
  adventureMotto: string;
  customTitle: string;
} {
  const role = preferences.personalityRole || 'valiente';
  const food = preferences.favoriteParkFood || 'gofres_y_churros';

  if (preferences.adrenalinePreference === 'extrema') {
    if (preferences.heightsPreference === 'alturas_totales') {
      return {
        name: 'Conquistador de Colosos',
        badge: 'Adrenalina Extrema & Alturas',
        icon: '⚡',
        description: 'No le temes a nada: Shambhala, Red Force y Hurakan Condor son tus templos sagrados.',
        adventureMotto: '«Cuanto más alto caigas, más fuerte ríes.»',
        customTitle: 'Gran Maestro de las Alturas de Shambhala',
      };
    }
    if (preferences.inversionsPreference === 'muchos_loopings') {
      return {
        name: 'Acróbata de Inversiones',
        badge: 'Loopings & Velocidad',
        icon: '🔄',
        description: 'Vivir boca abajo en Dragon Khan y acelerar al máximo en Furius Baco es tu pasión.',
        adventureMotto: '«El mundo se ve mejor con 8 loopings seguidos.»',
        customTitle: 'Domador Supremo de Dragones',
      };
    }
    return {
      name: 'Adicto a la Velocidad Pura',
      badge: 'Velocidad & Fuerza G',
      icon: '🏎️',
      description: 'Buscas la máxima aceleración y emociones intensas en cada rincón del parque.',
      adventureMotto: '«De 0 a 135 km/h en un parpadeo.»',
      customTitle: 'Piloto Legendario de Ferrari Land',
    };
  }

  if (preferences.waterPreference === 'empapado') {
    return {
      name: 'Capitán de las Aguas Salvajes',
      badge: 'Atracciones Acuáticas',
      icon: '🌊',
      description: 'Tu hábitat son las olas de Tutuki Splash, los troncos de Silver River y los Rápidos del Gran Cañón.',
      adventureMotto: '«Si no sales chorreando, no cuenta como victoria.»',
      customTitle: 'Comandante de las Aguas de Polinesia',
    };
  }

  if (role === 'estratega') {
    return {
      name: 'Estratega Maestro del Parque',
      badge: 'Optimización & Rutas VIP',
      icon: '🗺️',
      description: 'Calculas cada minuto de cola, aprovechas las horas punta y exprimes el parque como nadie.',
      adventureMotto: '«La mejor aventura empieza con un plan perfecto.»',
      customTitle: 'Guía Táctico de PortAventura',
    };
  }

  if (role === 'fotografo') {
    return {
      name: 'Cronista Visual del Imperio',
      badge: 'Tematización & Recuerdos',
      icon: '📸',
      description: 'Enamorado de la arquitectura de la Gran Muralla, las pirámides mayas y la puesta de sol en Mediterrània.',
      adventureMotto: '«Cada caída es una foto para la eternidad.»',
      customTitle: 'Gran Fotógrafo de Aventuras',
    };
  }

  if (role === 'foodie') {
    return {
      name: 'Sibarita de la Aventura',
      badge: 'Gastronomía & Placer',
      icon: '🌮',
      description: 'Sabes que una jornada épica se corona con los mejores tacos de La Cantina, gofres calientes y buena cerveza.',
      adventureMotto: '«Primero la coaster, luego el festín legendario.»',
      customTitle: 'Embajador Gastronómico del Parque',
    };
  }

  if (preferences.groupType === 'familia_ninos') {
    return {
      name: 'Explorador Familiar Mágico',
      badge: 'Diversión para Todas las Edades',
      icon: '👨‍👩‍👧‍👦',
      description: 'Disfrutas creando recuerdos mágicos en SésamoAventura, trenes panorámicos y paseos temáticos.',
      adventureMotto: '«La sonrisa de los pequeños es la mejor atracción.»',
      customTitle: 'Guardián de la Alegría Familiar',
    };
  }

  return {
    name: 'Aventurero Legendario Universal',
    badge: 'Experiencia Completa',
    icon: '🧭',
    description: 'Te gusta disfrutar de una mezcla perfecta entre tematización, emociones variadas y espectáculos.',
    adventureMotto: '«Vive la aventura sin límites ni reloj.»',
    customTitle: 'Aventurero Ilustre de PortAventura',
  };
}
