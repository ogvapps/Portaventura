// Map of external API attraction names to internal IDs
export const QUEUE_TIMES_NAME_MAP: Record<string, string> = {
  'shambhala': 'shambhala',
  'dragon khan': 'dragon-khan',
  'furius baco': 'furius-baco',
  'uncharted': 'uncharted',
  'uncharted: el enigma de penitence': 'uncharted',
  'hurakan condor': 'hurakan-condor',
  'stampida': 'stampida',
  'tutuki splash': 'tutuki-splash',
  'silver river flume': 'silver_river_flume',
  'grand canyon rapids': 'grand-canyon-rapids',
  'angkor': 'angkor',
  'street mission': 'street-mission',
  'sesame street: street mission': 'street-mission',
  'templo del fuego': 'templo-del-fuego',
  'el diablo - tren de la mina': 'el-diablo',
  'el diablo': 'el-diablo',
  'tomahawk': 'tomahawk',
  'volpaiute': 'volpaiute',
  'serpiente emplumada': 'serpiente-emplumada',
  'crazy barrels': 'crazy-barrels',
  'wild buffalos': 'wild-buffalos',
  'canoes': 'canoes',
  'tea cups': 'tea-cups',
  'kontiki': 'kontiki',
  'cobracha': 'cobracha',
  'los potrillos': 'los-potrillos',
  'armadillos': 'armadillos',
  'carousel': 'carousel',
  'tami tami': 'tami-tami',
  'tami-tami': 'tami-tami',
  'coco piloto': 'coco-piloto',
  'la granja de elmo': 'la-granja-de-elmo',
  'mariposas saltarinas': 'mariposas-saltarinas',
  'magic fish': 'magic-fish',
  'el huerto encantado': 'el-huerto-encantado',
  'el salto de blas': 'el-salto-de-blas',
  'kiddi dragons': 'kiddi-dragons',
  'red force': 'red-force',
  'flying dreams': 'flying-dreams',
  'racing legends': 'racing-legends',
  'thrill towers caida libre': 'thrill-towers-caida',
  'thrill towers rebote': 'thrill-towers-rebote',
  'maranello grand race': 'maranello-grand-race',
  'junior championship': 'junior-championship',
  'flying race': 'flying-race',
  'crazy pistons': 'crazy-pistons',
  'champions race': 'champions-race',
  'pole position challenge': 'pole-position-challenge',
};

export function matchAttractionId(rawName: string): string | null {
  if (!rawName) return null;
  const normalized = rawName.toLowerCase().trim();
  
  if (QUEUE_TIMES_NAME_MAP[normalized]) {
    return QUEUE_TIMES_NAME_MAP[normalized];
  }

  // Partial search
  for (const [key, id] of Object.entries(QUEUE_TIMES_NAME_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return id;
    }
  }

  return null;
}
