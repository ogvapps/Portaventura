export type AreaId =
  | 'mediterrania'
  | 'polynesia'
  | 'china'
  | 'mexico'
  | 'far-west'
  | 'sesamo'
  | 'ferrari-land';

export type IntensityLevel = 'Suave' | 'Moderada' | 'Fuerte' | 'Extrema' | 'Familiar' | 'Infantil';

export type AttractionCategory =
  | 'Montaña Rusa'
  | 'Acuática'
  | 'Caída Libre'
  | 'Familiar'
  | 'Infantil'
  | 'Dark Ride / Simulador';

export interface Attraction {
  id: string;
  name: string;
  areaId: AreaId;
  locationDetail: string;
  targetAudience: 'Niños' | 'Adultos' | 'Toda la familia' | 'Amantes de emociones fuertes';
  photoUrl: string;
  category: AttractionCategory;
  intensity: IntensityLevel;
  minHeightCm?: number;
  maxSpeedKmh?: number;
  heightM?: number;
  inversions?: number;
  dropDegrees?: number;
  durationSeconds?: number;
  openingYear: number;
  tagline: string;
  description: string;
  funFact: string;
  communityScore: number;
  communityReviewsCount: number;
  color: {
    primary: string;
    secondary: string;
    bgGradient: string;
    badgeBg: string;
    badgeText: string;
  };
  imageKeywords: string;
  iconName: string;
}

export interface AreaInfo {
  id: AreaId;
  name: string;
  theme: string;
  color: string;
  accentColor: string;
  icon: string;
  description: string;
  totalAttractions: number;
}

export type QueueExperience = 'express' | 'corta' | 'moderada' | 'larga' | 'extrema';
export type RepeatWillingness = 'siempre' | 'si' | 'quizas' | 'no';

export type SkipReason =
  | 'miedo'
  | 'mucha_cola'
  | 'cerrada'
  | 'falta_tiempo'
  | 'no_mi_estilo'
  | 'no_cumplo_altura';

export interface AttractionRating {
  attractionId: string;
  rodeIt: boolean;
  score?: number; // 1 to 10
  adrenalineScore?: number; // 1 to 5
  themingScore?: number; // 1 to 5
  queueExperience?: QueueExperience;
  queueTimeMinutes?: number;
  repeatWillingness?: RepeatWillingness;
  comment?: string;
  skipReason?: SkipReason;
  tags?: string[];
  ratedAt?: string;
}

export interface SurveyPreset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: string;
  estimatedMinutes: number;
  attractionIds: string[];
}

export interface SurveySession {
  id: string;
  title: string;
  visitDate: string;
  presetId?: string;
  ratings: Record<string, AttractionRating>;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  visitorName?: string;
}

export interface VisitorProfile {
  title: string;
  archetype: string;
  description: string;
  icon: string;
  badgeColor: string;
  topArea: string;
  maxSpeedRode: number;
  maxHeightRode: number;
  averageScore: number;
}

export interface UserPreferences {
  // Identity & Personal Profile
  visitorName: string;
  nickname?: string;
  avatar: string; // avatar id (e.g. 'woody', 'dragon', 'sheriff', 'explorer', 'ferrari', 'elmo', 'pirate', 'queen', 'rocker')
  customAvatarBg: string;
  heightCm: number;
  ageGroup: 'nino' | 'adolescente' | 'adulto' | 'veterano';

  // Personality ("Cómo eres tú")
  personalityRole: 'valiente' | 'estratega' | 'fotografo' | 'foodie' | 'alma_fiesta' | 'tranquilo';
  motionTolerance: 'acero' | 'normal' | 'sensible';

  // Hobbies & What you love in the park ("Algo que te guste")
  favoriteParkFood: 'gofres_y_churros' | 'tacos_y_nachos' | 'hamburguesas_bbq' | 'helados_artesanos' | 'comida_mediterranea';
  visitGoal: 'montar_en_todo' | 'superar_mis_miedos' | 'pasar_dia_inolvidable' | 'ver_shows_y_fotos';
  favoriteSoundtrack: 'aventura_epica' | 'fiesta_caribena' | 'western_salvaje' | 'magia_familiar';
  adventureMotto?: string;
  customTitle?: string;

  // Attraction Preferences
  adrenalinePreference: 'extrema' | 'fuerte' | 'moderada' | 'suave';
  waterPreference: 'empapado' | 'moderado' | 'seco';
  heightsPreference: 'alturas_totales' | 'medio' | 'sin_alturas';
  inversionsPreference: 'muchos_loopings' | 'curvas_sin_inversion' | 'sin_inversiones';
  groupType: 'amigos' | 'familia_ninos' | 'pareja' | 'solo';
  preferredAreas: AreaId[];

  // Generated Archetype & Passport info
  archetypeName: string;
  archetypeBadge: string;
  archetypeIcon: string;
  archetypeDescription: string;
  completedAt: string;
}

export type CompanionPersonaId = 'woody' | 'aventurero' | 'dragon' | 'sheriff' | 'custom';

export interface CompanionPersona {
  id: CompanionPersonaId;
  name: string;
  title: string;
  avatar: string;
  greeting: string;
  systemPrompt: string;
  suggestedPrompts: string[];
  voiceTone: string;
  themeColor: string;
  bgGradient: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  attractionSuggestionId?: string;
}
