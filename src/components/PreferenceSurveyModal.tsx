import React, { useState } from 'react';
import { UserPreferences, AreaId } from '../types';
import { AREAS, ATTRACTIONS } from '../data/attractions';
import { determineArchetype } from '../utils/recommendationEngine';
import confetti from 'canvas-confetti';
import { CarnivalBunting, StarSparkles, TicketStamp } from './ParkDecorations';
import {
  Sparkles,
  Zap,
  Flame,
  Droplets,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  Users,
  Smile,
  X,
  RefreshCw,
  Trophy,
  Ruler,
  Shield,
  Utensils,
  Target,
  Music,
  Heart,
  Camera,
  Award,
} from 'lucide-react';

export const AVATAR_OPTIONS = [
  { id: 'woody', name: 'Woody Woodpecker', emoji: '🦜', area: 'Mediterrània / Mascota', desc: 'Alegre, travieso y siempre listo para la acción' },
  { id: 'dragon', name: 'Dragón Imperial', emoji: '🐉', area: 'China', desc: 'Poderoso guardián de Shambhala y Dragon Khan' },
  { id: 'sheriff', name: 'Sheriff del Oeste', emoji: '🤠', area: 'Far West', desc: 'Valiente forajido de Stampida y Penitence' },
  { id: 'ferrari', name: 'Piloto Ferrari', emoji: '🏎️', area: 'Ferrari Land', desc: 'Fanático de la velocidad pura y Red Force' },
  { id: 'explorer', name: 'Explorador Maya', emoji: '🗿', area: 'México', desc: 'Buscador de tesoros y templos de Hurakan Condor' },
  { id: 'polynesian', name: 'Tiburón de Arrecife', emoji: '🦈', area: 'Polinesia', desc: 'Amo de las aguas bravas y Tutuki Splash' },
  { id: 'elmo', name: 'Monstruo de Galletas', emoji: '🍪', area: 'SésamoAventura', desc: 'Dulce, divertido y el rey de las sonrisas' },
  { id: 'pirate', name: 'Capitán Corsario', emoji: '⚓', area: 'Mediterrània', desc: 'Lobo de mar y maestro de la aventura' },
  { id: 'empress', name: 'Guerrera de la Seda', emoji: '👑', area: 'China', desc: 'Noble conquistadora de las cumbres del Himalaya' },
  { id: 'rocker', name: 'Acróbata del Fuego', emoji: '🔥', area: 'México', desc: 'Amante del peligro, shows y giros imposibles' },
];

export const AVATAR_COLORS = [
  { id: '#E64A38', name: 'Rojo PortAventura', bg: 'bg-[#E64A38]' },
  { id: '#F7B731', name: 'Dorado Shambhala', bg: 'bg-[#F7B731]' },
  { id: '#0284C7', name: 'Azul Mediterráneo', bg: 'bg-[#0284C7]' },
  { id: '#9333EA', name: 'Púrpura Dragón', bg: 'bg-[#9333EA]' },
  { id: '#059669', name: 'Verde Polinesia', bg: 'bg-[#059669]' },
  { id: '#2A1845', name: 'Noche Mágica', bg: 'bg-[#2A1845]' },
];

export const PERSONALITY_ROLES = [
  {
    id: 'valiente',
    name: 'Valiente & Temerario',
    emoji: '🔥',
    desc: 'Sin miedo a nada. Voy directo a primera fila en Shambhala, Dragon Khan y Hurakan Condor.',
    badge: 'Pura Adrenalina',
    color: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    id: 'estratega',
    name: 'Estratega Meticuloso',
    emoji: '🗺️',
    desc: 'Planifico la ruta perfecta, vigilo los tiempos de cola en directo y optimizo el día al milímetro.',
    badge: 'Táctico Experto',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'fotografo',
    name: 'Fotógrafo & Creador',
    emoji: '📸',
    desc: 'Busco las mejores panorámicas, tematización inmersiva, recuerdos épicos y momentos mágicos.',
    badge: 'Ojo Artístico',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'foodie',
    name: 'Foodie & Disfrutón',
    emoji: '🌮',
    desc: 'Un gran día en el parque necesita gofres con chocolate, tacos en La Cantina y buena comida.',
    badge: 'Rey del Sabor',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'alma_fiesta',
    name: 'El Alma de la Fiesta',
    emoji: '🎉',
    desc: 'Cantando en las colas, animando a todo el grupo, viviendo los shows y riendo sin parar.',
    badge: 'Espíritu Alegre',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'tranquilo',
    name: 'Tranquilo & Relax',
    emoji: '🌿',
    desc: 'Prefiero un ritmo calmado: pasear por la vegetación de Polinesia, trenes y disfrutar sin estrés.',
    badge: 'Paz & Bienestar',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
  },
];

export const PARK_FOOD_OPTIONS = [
  { id: 'gofres_y_churros', name: 'Gofres con Chocolate & Churros', emoji: '🧇', desc: 'El snack dulce más icónico y crujiente de PortAventura' },
  { id: 'tacos_y_nachos', name: 'Tacos Mexicanos, Nachos & Guacamole', emoji: '🌮', desc: 'Sabor auténtico con mariachis en La Cantina' },
  { id: 'hamburguesas_bbq', name: 'Hamburguesas BBQ & Costillas', emoji: '🍔', desc: 'Banquete legendario al estilo Far West en The Iron Horse' },
  { id: 'helados_artesanos', name: 'Helados Artesanos & Granizados', emoji: '🍦', desc: 'Refresco perfecto entre atracción y atracción' },
  { id: 'comida_mediterranea', name: 'Paella & Cocina Mediterránea', emoji: '🥘', desc: 'Platos deliciosos con vistas al lago de Mediterrània' },
];

export const VISIT_GOAL_OPTIONS = [
  { id: 'montar_en_todo', name: 'Conquistar todas las montañas rusas', emoji: '🎢', desc: 'Completar el circuito completo de emociones y récords' },
  { id: 'superar_mis_miedos', name: 'Superar mis miedos y atreverme', emoji: '🦁', desc: 'Dar el gran paso en Shambhala, Dragon Khan o caída libre' },
  { id: 'pasar_dia_inolvidable', name: 'Risas y diversión en compañía', emoji: '✨', desc: 'Crear anécdotas inolvidables con amigos o familiares' },
  { id: 'ver_shows_y_fotos', name: 'Espectáculos, fotos y tematización', emoji: '🎭', desc: 'Disfrutar de las acrobacias, danzas y ambientación' },
];

interface PreferenceSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences: (prefs: UserPreferences) => void;
  initialPreferences?: UserPreferences | null;
}

export const PreferenceSurveyModal: React.FC<PreferenceSurveyModalProps> = ({
  isOpen,
  onClose,
  onSavePreferences,
  initialPreferences,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Identity & Profile State
  const [visitorName, setVisitorName] = useState<string>(
    initialPreferences?.visitorName || 'Aventurero PortAventura'
  );
  const [nickname, setNickname] = useState<string>(
    initialPreferences?.nickname || 'Cazador de Dragones'
  );
  const [avatar, setAvatar] = useState<string>(
    initialPreferences?.avatar || 'woody'
  );
  const [customAvatarBg, setCustomAvatarBg] = useState<string>(
    initialPreferences?.customAvatarBg || '#E64A38'
  );
  const [heightCm, setHeightCm] = useState<number>(
    initialPreferences?.heightCm || 170
  );
  const [ageGroup, setAgeGroup] = useState<UserPreferences['ageGroup']>(
    initialPreferences?.ageGroup || 'adulto'
  );

  // Personality State ("Cómo eres tú")
  const [personalityRole, setPersonalityRole] = useState<UserPreferences['personalityRole']>(
    initialPreferences?.personalityRole || 'valiente'
  );
  const [motionTolerance, setMotionTolerance] = useState<UserPreferences['motionTolerance']>(
    initialPreferences?.motionTolerance || 'normal'
  );

  // Hobbies & What you love in the park ("Algo que te guste")
  const [favoriteParkFood, setFavoriteParkFood] = useState<UserPreferences['favoriteParkFood']>(
    initialPreferences?.favoriteParkFood || 'gofres_y_churros'
  );
  const [visitGoal, setVisitGoal] = useState<UserPreferences['visitGoal']>(
    initialPreferences?.visitGoal || 'montar_en_todo'
  );
  const [favoriteSoundtrack, setFavoriteSoundtrack] = useState<UserPreferences['favoriteSoundtrack']>(
    initialPreferences?.favoriteSoundtrack || 'aventura_epica'
  );

  // Attraction Preferences
  const [adrenaline, setAdrenaline] = useState<UserPreferences['adrenalinePreference']>(
    initialPreferences?.adrenalinePreference || 'extrema'
  );
  const [water, setWater] = useState<UserPreferences['waterPreference']>(
    initialPreferences?.waterPreference || 'moderado'
  );
  const [heights, setHeights] = useState<UserPreferences['heightsPreference']>(
    initialPreferences?.heightsPreference || 'alturas_totales'
  );
  const [inversions, setInversions] = useState<UserPreferences['inversionsPreference']>(
    initialPreferences?.inversionsPreference || 'muchos_loopings'
  );
  const [group, setGroup] = useState<UserPreferences['groupType']>(
    initialPreferences?.groupType || 'amigos'
  );
  const [selectedAreas, setSelectedAreas] = useState<AreaId[]>(
    initialPreferences?.preferredAreas || ['china', 'far-west', 'mexico']
  );

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [generatedArchetype, setGeneratedArchetype] = useState<{
    name: string;
    badge: string;
    icon: string;
    description: string;
    adventureMotto: string;
    customTitle: string;
  } | null>(null);

  if (!isOpen) return null;

  const toggleArea = (areaId: AreaId) => {
    if (selectedAreas.includes(areaId)) {
      if (selectedAreas.length > 1) {
        setSelectedAreas(selectedAreas.filter((a) => a !== areaId));
      }
    } else {
      setSelectedAreas([...selectedAreas, areaId]);
    }
  };

  const handleFinish = () => {
    const archetype = determineArchetype({
      visitorName,
      personalityRole,
      favoriteParkFood,
      visitGoal,
      adrenalinePreference: adrenaline,
      waterPreference: water,
      heightsPreference: heights,
      inversionsPreference: inversions,
      groupType: group,
      preferredAreas: selectedAreas,
      heightCm,
    });

    const finalPreferences: UserPreferences = {
      visitorName: visitorName.trim() || 'Aventurero PortAventura',
      nickname: nickname.trim() || undefined,
      avatar,
      customAvatarBg,
      heightCm,
      ageGroup,
      personalityRole,
      motionTolerance,
      favoriteParkFood,
      visitGoal,
      favoriteSoundtrack,
      adventureMotto: archetype.adventureMotto,
      customTitle: archetype.customTitle,
      adrenalinePreference: adrenaline,
      waterPreference: water,
      heightsPreference: heights,
      inversionsPreference: inversions,
      groupType: group,
      preferredAreas: selectedAreas,
      archetypeName: archetype.name,
      archetypeBadge: archetype.badge,
      archetypeIcon: archetype.icon,
      archetypeDescription: archetype.description,
      completedAt: new Date().toISOString(),
    };

    setGeneratedArchetype(archetype);
    setIsCompleted(true);

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#E64A38', '#F7B731', '#0284C7', '#059669', '#9333EA'],
      });
    } catch {
      // ignore
    }

    onSavePreferences(finalPreferences);
  };

  const currentSelectedAvatarObj = AVATAR_OPTIONS.find((a) => a.id === avatar) || AVATAR_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#2A1845] via-[#E64A38] to-[#F7B731] p-5 sm:p-6 text-white relative shrink-0">
          <CarnivalBunting className="h-3.5 absolute top-0 left-0 right-0 opacity-80" />

          {initialPreferences && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-20"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3 mt-1">
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 border-white/80 shrink-0"
              style={{ backgroundColor: customAvatarBg }}
            >
              {currentSelectedAvatarObj.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black tracking-widest uppercase bg-white/25 px-2.5 py-0.5 rounded-full text-white">
                  PortAventura Passport & Matcher
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight mt-0.5 text-white">
                {isCompleted
                  ? '¡Pasaporte Aventurero Creado!'
                  : 'Crea tu Perfil & Gustos de Parque'}
              </h2>
            </div>
          </div>

          <p className="text-white/90 text-xs sm:text-sm mt-2 max-w-lg font-light">
            {isCompleted
              ? 'Tu carné oficial ya está listo para personalizar al máximo tus recomendaciones y chat.'
              : 'Cuéntanos cómo eres tú y qué te apasiona para personalizar tu experiencia única en PortAventura.'}
          </p>

          {/* Step Progress Bar */}
          {!isCompleted && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-bold text-white/90 mb-1.5">
                <span>
                  Paso {step} de {totalSteps}:{' '}
                  {step === 1 && 'Tu Identidad & Avatar'}
                  {step === 2 && '¿Cómo eres tú? (Personalidad)'}
                  {step === 3 && 'Tus Snacks & Metas Favoritas'}
                  {step === 4 && 'Adrenalina & Alturas'}
                  {step === 5 && 'Agua & Loopings'}
                  {step === 6 && 'Compañía & Mundos'}
                </span>
                <span>{Math.round((step / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F7B731] transition-all duration-300 rounded-full"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Form Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#FBF8F3]">
          {/* STEP 1: IDENTITY, AVATAR & HEIGHT */}
          {!isCompleted && step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <h3 className="text-base sm:text-lg font-serif font-black text-[#2A1845] flex items-center gap-2 mb-1">
                  <Smile className="w-5 h-5 text-[#E64A38]" />
                  <span>¿Cómo te llamas y cómo te gusta que te llamen?</span>
                </h3>
                <p className="text-xs text-[#2A1845]/70 mb-4 font-light">
                  Aparecerá en tu Pasaporte Aventurero, en tus valoraciones y el asistente IA te llamará por este nombre.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#2A1845] uppercase tracking-wider mb-1.5">
                      Nombre / Nombre de pila
                    </label>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Ej. Lucas, María, Carlos..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] text-sm text-[#2A1845] font-semibold focus:outline-none focus:border-[#E64A38]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2A1845] uppercase tracking-wider mb-1.5">
                      Apodo / Alias de Aventurero (Opcional)
                    </label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Ej. El Domador de Shambhala"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] text-sm text-[#2A1845] font-semibold focus:outline-none focus:border-[#E64A38]"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-sm font-serif font-black text-[#2A1845]">
                      Elige tu Avatar o Personaje Temático
                    </h4>
                    <p className="text-xs text-[#2A1845]/70 font-light">
                      Selecciona la figura de PortAventura que más te representa
                    </p>
                  </div>

                  {/* Avatar Background Color Dots */}
                  <div className="flex items-center gap-1.5">
                    {AVATAR_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCustomAvatarBg(c.id)}
                        className={`w-6 h-6 rounded-full ${c.bg} transition-transform ${
                          customAvatarBg === c.id ? 'ring-2 ring-offset-2 ring-[#2A1845] scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {AVATAR_OPTIONS.map((av) => {
                    const isSelected = avatar === av.id;
                    return (
                      <div
                        key={av.id}
                        onClick={() => setAvatar(av.id)}
                        className={`cursor-pointer rounded-2xl p-2.5 text-center transition-all border-2 flex flex-col items-center justify-between ${
                          isSelected
                            ? 'border-[#E64A38] bg-[#FFF0E5] shadow-xs scale-102'
                            : 'border-[#F0E2D4] bg-white hover:border-slate-300'
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-1.5 shadow-2xs"
                          style={{ backgroundColor: isSelected ? customAvatarBg : '#F4ECE4' }}
                        >
                          {av.emoji}
                        </div>
                        <div className="text-xs font-bold text-[#2A1845] leading-tight truncate w-full">
                          {av.name}
                        </div>
                        <div className="text-[9px] text-[#2A1845]/60 mt-0.5 truncate w-full">
                          {av.area}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Height & Age */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-[#0284C7]" />
                    <span className="text-sm font-serif font-black text-[#2A1845]">
                      Tu Altura en centímetros ({heightCm} cm)
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] text-xs font-black">
                    {heightCm >= 140
                      ? '✅ Apto para 100% de atracciones'
                      : heightCm >= 130
                      ? '⚡ Apto para Dragon Khan & Stampida'
                      : heightCm >= 110
                      ? '🎢 Apto para coasters familiares'
                      : '👶 Especial SésamoAventura'}
                  </span>
                </div>

                <p className="text-xs text-[#2A1845]/70 mb-3 font-light">
                  Usamos tu altura para indicarte si puedes subirte a los colosos como Shambhala (mín. 140 cm) o Furius Baco.
                </p>

                <input
                  type="range"
                  min={90}
                  max={215}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-[#E64A38] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-[#2A1845]/60 font-bold mt-1.5">
                  <span>90 cm (Peques)</span>
                  <span>120 cm (Familiar)</span>
                  <span>140 cm (Shambhala VIP)</span>
                  <span>210+ cm (Altos)</span>
                </div>

                {/* Age Group */}
                <div className="mt-4 pt-3 border-t border-[#F0E2D4]">
                  <label className="block text-xs font-bold text-[#2A1845] uppercase tracking-wider mb-2">
                    Grupo de edad
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'nino', label: 'Niño/a', icon: '🧒' },
                      { id: 'adolescente', label: 'Joven', icon: '🎒' },
                      { id: 'adulto', label: 'Adulto', icon: '🧑' },
                      { id: 'veterano', label: 'Senior', icon: '⭐' },
                    ].map((ag) => (
                      <button
                        key={ag.id}
                        type="button"
                        onClick={() => setAgeGroup(ag.id as any)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          ageGroup === ag.id
                            ? 'bg-[#2A1845] text-[#F7B731] border-[#2A1845]'
                            : 'bg-[#FFF9F3] text-[#2A1845] border-[#F0E2D4] hover:bg-white'
                        }`}
                      >
                        <span className="mr-1">{ag.icon}</span>
                        <span>{ag.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONALITY & MOTION TOLERANCE */}
          {!isCompleted && step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <h3 className="text-base sm:text-lg font-serif font-black text-[#2A1845] flex items-center gap-2 mb-1">
                  <Shield className="w-5 h-5 text-[#E64A38]" />
                  <span>¿Cómo eres tú en un parque temático?</span>
                </h3>
                <p className="text-xs text-[#2A1845]/70 mb-4 font-light">
                  Elige el rol que mejor describe tu espíritu y actitud cuando cruzas las puertas del parque:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PERSONALITY_ROLES.map((role) => {
                    const isSelected = personalityRole === role.id;
                    return (
                      <div
                        key={role.id}
                        onClick={() => setPersonalityRole(role.id as any)}
                        className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-[#E64A38] bg-[#FFF9F3] shadow-xs scale-101'
                            : 'border-[#F0E2D4] bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                          {role.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-sm font-bold text-[#2A1845]">
                              {role.name}
                            </span>
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-[#2A1845]">
                              {role.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#2A1845]/75 mt-1 font-light leading-relaxed">
                            {role.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Motion sickness tolerance */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <h4 className="text-sm font-serif font-black text-[#2A1845] mb-1">
                  ¿Cómo llevas los giros y mareos?
                </h4>
                <p className="text-xs text-[#2A1845]/70 mb-3 font-light">
                  Ajustaremos si te sugerimos atracciones giratorias tipo Tea Cups o coasters directas de aceleración.
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'acero',
                      name: 'Estómago de Acero',
                      icon: '🛡️',
                      desc: 'Giros, loopings y gravedad sin problema',
                    },
                    {
                      id: 'normal',
                      name: 'Tolerancia Normal',
                      icon: '⚡',
                      desc: 'Aguanto bien la mayoría de atracciones',
                    },
                    {
                      id: 'sensible',
                      name: 'Sensible a giros',
                      icon: '🌿',
                      desc: 'Prefiero caídas limpias sin giros continuos',
                    },
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setMotionTolerance(m.id as any)}
                      className={`cursor-pointer rounded-2xl p-3 border-2 text-center transition-all flex flex-col items-center justify-between ${
                        motionTolerance === m.id
                          ? 'border-[#0284C7] bg-[#F0F9FF] shadow-xs'
                          : 'border-[#F0E2D4] bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{m.icon}</span>
                      <span className="text-xs font-bold text-[#2A1845] leading-tight">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-[#2A1845]/60 mt-0.5 leading-tight">
                        {m.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SNACKS & GOALS */}
          {!isCompleted && step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <h3 className="text-base sm:text-lg font-serif font-black text-[#2A1845] flex items-center gap-2 mb-1">
                  <Utensils className="w-5 h-5 text-amber-500" />
                  <span>¿Cuál es tu comida o snack favorito del parque?</span>
                </h3>
                <p className="text-xs text-[#2A1845]/70 mb-3 font-light">
                  ¡Porque no hay visita perfecta sin tu capricho gastronómico predilecto!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PARK_FOOD_OPTIONS.map((f) => {
                    const isSelected = favoriteParkFood === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setFavoriteParkFood(f.id as any)}
                        className={`cursor-pointer rounded-2xl p-3.5 border-2 transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                            : 'border-[#F0E2D4] bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{f.emoji}</span>
                        <div>
                          <div className="text-xs font-bold text-[#2A1845]">
                            {f.name}
                          </div>
                          <div className="text-[10px] text-[#2A1845]/70 font-light">
                            {f.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visit Goal */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <h4 className="text-sm font-serif font-black text-[#2A1845] flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-[#E64A38]" />
                  <span>¿Cuál es tu gran objetivo en esta visita?</span>
                </h4>
                <p className="text-xs text-[#2A1845]/70 mb-3 font-light">
                  Te daremos recomendaciones orientadas a cumplir este objetivo:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {VISIT_GOAL_OPTIONS.map((g) => {
                    const isSelected = visitGoal === g.id;
                    return (
                      <div
                        key={g.id}
                        onClick={() => setVisitGoal(g.id as any)}
                        className={`cursor-pointer rounded-2xl p-3.5 border-2 transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'border-[#E64A38] bg-[#FFF0E5] shadow-xs'
                            : 'border-[#F0E2D4] bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{g.emoji}</span>
                        <div>
                          <div className="text-xs font-bold text-[#2A1845]">
                            {g.name}
                          </div>
                          <div className="text-[10px] text-[#2A1845]/70 font-light">
                            {g.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ADRENALINE & HEIGHTS */}
          {!isCompleted && step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <h3 className="text-base sm:text-lg font-serif font-black text-[#2A1845] flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-[#E64A38]" />
                  <span>Nivel de Adrenalina y Emoción Deseado</span>
                </h3>
                <p className="text-xs text-[#2A1845]/70 mb-4 font-light">
                  ¿Qué nivel de intensidad te hace disfrutar más en una atracción?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'extrema',
                      name: 'Adrenalina Extrema',
                      icon: '⚡',
                      badge: 'Shambhala & Hurakan',
                      desc: 'Máxima aceleración, fuerza G y caídas libres sin concesiones.',
                    },
                    {
                      id: 'fuerte',
                      name: 'Fuerte & Emocionante',
                      icon: '🔥',
                      badge: 'Stampida & Baco',
                      desc: 'Emociones intensas pero con control, coasters clásicas y velocidad.',
                    },
                    {
                      id: 'moderada',
                      name: 'Moderada / Familiar',
                      icon: '🎢',
                      badge: 'El Diablo & Tomahawk',
                      desc: 'Diversión para reírse en grupo sin pasar miedo extremo.',
                    },
                    {
                      id: 'suave',
                      name: 'Suave & Paisajística',
                      icon: '🌸',
                      badge: 'Paseos & Tren',
                      desc: 'Tranquilidad, inmersión visual y tematización relajada.',
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setAdrenaline(item.id as any)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-start gap-3.5 ${
                        adrenaline === item.id
                          ? 'border-[#E64A38] bg-[#FFF0E5] shadow-xs scale-101'
                          : 'border-[#F0E2D4] bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{item.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#2A1845]">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[9px] font-black uppercase text-[#E64A38] tracking-wider block mt-0.5">
                          {item.badge}
                        </span>
                        <p className="text-xs text-[#2A1845]/75 mt-1 font-light">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Heights / Drops */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <h4 className="text-sm font-serif font-black text-[#2A1845] mb-1">
                  ¿Cómo te llevas con las grandes alturas y caídas libres?
                </h4>
                <div className="grid grid-cols-3 gap-2.5 mt-3">
                  {[
                    {
                      id: 'alturas_totales',
                      name: '¡Me encantan las alturas!',
                      icon: '🦅',
                      desc: '76m de Shambhala o 100m de Hurakan',
                    },
                    {
                      id: 'medio',
                      name: 'Alturas moderadas',
                      icon: '🏔️',
                      desc: 'Hasta 30-40 metros es perfecto',
                    },
                    {
                      id: 'sin_alturas',
                      name: 'Prefiero no subir tan alto',
                      icon: '🌳',
                      desc: 'A ras de suelo o recorridos bajos',
                    },
                  ].map((h) => (
                    <div
                      key={h.id}
                      onClick={() => setHeights(h.id as any)}
                      className={`cursor-pointer rounded-2xl p-3 border-2 text-center transition-all flex flex-col items-center justify-between ${
                        heights === h.id
                          ? 'border-[#E64A38] bg-[#FFF0E5] shadow-xs'
                          : 'border-[#F0E2D4] bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{h.icon}</span>
                      <span className="text-xs font-bold text-[#2A1845] leading-tight">
                        {h.name}
                      </span>
                      <span className="text-[10px] text-[#2A1845]/60 mt-0.5 leading-tight">
                        {h.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: WATER & INVERSIONS */}
          {!isCompleted && step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <h3 className="text-base sm:text-lg font-serif font-black text-[#2A1845] flex items-center gap-2 mb-1">
                  <Droplets className="w-5 h-5 text-[#0284C7]" />
                  <span>¿Qué relación tienes con las atracciones acuáticas?</span>
                </h3>
                <p className="text-xs text-[#2A1845]/70 mb-4 font-light">
                  Tutuki Splash, Silver River Flume y Grand Canyon Rapids te esperan:
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'empapado',
                      name: '¡Empapado a tope!',
                      icon: '🌊',
                      desc: 'Chubasquero fuera, ¡vengo a mojarme!',
                    },
                    {
                      id: 'moderado',
                      name: 'Salpicaduras moderadas',
                      icon: '💦',
                      desc: 'Un poco de agua para refrescar está bien',
                    },
                    {
                      id: 'seco',
                      name: 'Prefiero salir seco',
                      icon: '☀️',
                      desc: 'Evitar mojarme ropa o calzado',
                    },
                  ].map((w) => (
                    <div
                      key={w.id}
                      onClick={() => setWater(w.id as any)}
                      className={`cursor-pointer rounded-2xl p-3.5 border-2 text-center transition-all flex flex-col items-center justify-between ${
                        water === w.id
                          ? 'border-[#0284C7] bg-[#F0F9FF] shadow-xs'
                          : 'border-[#F0E2D4] bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{w.icon}</span>
                      <span className="text-xs font-bold text-[#2A1845] leading-tight">
                        {w.name}
                      </span>
                      <span className="text-[10px] text-[#2A1845]/60 mt-0.5 leading-tight">
                        {w.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inversions / Loopings */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <h4 className="text-sm font-serif font-black text-[#2A1845] mb-1">
                  ¿Te gusta ponerte cabeza abajo (Inversiones & Loopings)?
                </h4>
                <div className="grid grid-cols-3 gap-2.5 mt-3">
                  {[
                    {
                      id: 'muchos_loopings',
                      name: '¡8 loopings o más!',
                      icon: '🔄',
                      desc: 'Dragon Khan y giros boca abajo',
                    },
                    {
                      id: 'curvas_sin_inversion',
                      name: 'Curvas rápidas sin looping',
                      icon: '🏎️',
                      desc: 'Shambhala y Stampida pura velocidad',
                    },
                    {
                      id: 'sin_inversiones',
                      name: 'Siempre de pie',
                      icon: '🚊',
                      desc: 'Cero giros invertidos',
                    },
                  ].map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => setInversions(inv.id as any)}
                      className={`cursor-pointer rounded-2xl p-3.5 border-2 text-center transition-all flex flex-col items-center justify-between ${
                        inversions === inv.id
                          ? 'border-[#9333EA] bg-purple-50 shadow-xs'
                          : 'border-[#F0E2D4] bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{inv.icon}</span>
                      <span className="text-xs font-bold text-[#2A1845] leading-tight">
                        {inv.name}
                      </span>
                      <span className="text-[10px] text-[#2A1845]/60 mt-0.5 leading-tight">
                        {inv.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: GROUP & PREFERRED AREAS */}
          {!isCompleted && step === 6 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <h3 className="text-base sm:text-lg font-serif font-black text-[#2A1845] flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-[#E64A38]" />
                  <span>¿Con quién estás disfrutando del parque?</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                  {[
                    { id: 'amigos', name: 'Grupo de Amigos', icon: '👥' },
                    { id: 'familia_ninos', name: 'Familia con Niños', icon: '👨‍👩‍👧‍👦' },
                    { id: 'pareja', name: 'En Pareja', icon: '❤️' },
                    { id: 'solo', name: 'Aventurero Solitario', icon: '🎒' },
                  ].map((g) => (
                    <div
                      key={g.id}
                      onClick={() => setGroup(g.id as any)}
                      className={`cursor-pointer rounded-2xl p-3 border-2 text-center transition-all flex flex-col items-center justify-center ${
                        group === g.id
                          ? 'border-[#E64A38] bg-[#FFF0E5] shadow-xs'
                          : 'border-[#F0E2D4] bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{g.icon}</span>
                      <span className="text-xs font-bold text-[#2A1845]">{g.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferred Areas */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-sm font-serif font-black text-[#2A1845] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#0284C7]" />
                    <span>Tus Mundos Temáticos Favoritos (Elige 1 o varios)</span>
                  </h4>
                  <span className="text-[10px] text-[#2A1845]/60 font-bold">
                    {selectedAreas.length} seleccionados
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.values(AREAS).map((area) => {
                    const isSelected = selectedAreas.includes(area.id);
                    return (
                      <div
                        key={area.id}
                        onClick={() => toggleArea(area.id)}
                        className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'border-[#E64A38] bg-[#FFF0E5] shadow-xs'
                            : 'border-[#F0E2D4] bg-white hover:border-slate-300 opacity-75'
                        }`}
                      >
                        <span
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm shadow-2xs shrink-0"
                          style={{ backgroundColor: area.color }}
                        >
                          {area.icon}
                        </span>
                        <div className="flex-1 truncate">
                          <div className="text-xs font-bold text-[#2A1845] truncate">
                            {area.name}
                          </div>
                          <div className="text-[9px] text-[#2A1845]/60 truncate">
                            {area.totalAttractions} atracciones
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#E64A38] shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* COMPLETED: OFFICIAL PASSPORT DISPLAY */}
          {isCompleted && generatedArchetype && (
            <div className="space-y-6 text-center py-2 animate-fade-in">
              <div className="rounded-3xl bg-gradient-to-br from-[#FFF9F3] via-white to-[#FFF0E5] p-6 border-2 border-[#E64A38]/40 shadow-xl relative overflow-hidden text-left">
                <TicketStamp className="absolute -top-3 -right-3 rotate-12 opacity-80" text="VIP PASSPORT" />

                <div className="flex items-center gap-4 border-b border-[#F0E2D4] pb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/80 shrink-0"
                    style={{ backgroundColor: customAvatarBg }}
                  >
                    {currentSelectedAvatarObj.emoji}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#E64A38]">
                      Pasaporte Aventurero Oficial • PortAventura World
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A1845]">
                      {visitorName} {nickname ? `«${nickname}»` : ''}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#2A1845] text-[#F7B731] text-xs font-serif font-bold flex items-center gap-1 shadow-xs">
                        <span>{generatedArchetype.icon}</span>
                        <span>{generatedArchetype.name}</span>
                      </span>
                      <span className="text-xs text-[#2A1845]/70 font-semibold">
                        • {heightCm} cm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="my-4">
                  <div className="text-xs font-black text-[#E64A38] uppercase tracking-wider mb-1">
                    Título Honorífico & Lema:
                  </div>
                  <p className="text-base font-serif font-bold text-[#2A1845]">
                    «{generatedArchetype.customTitle}»
                  </p>
                  <p className="text-xs text-[#2A1845]/80 italic mt-1 font-serif">
                    {generatedArchetype.adventureMotto}
                  </p>
                </div>

                <p className="text-xs text-[#2A1845]/80 leading-relaxed font-light bg-white p-3.5 rounded-2xl border border-[#F0E2D4]">
                  {generatedArchetype.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-white p-2 rounded-xl border border-[#F0E2D4]">
                    <div className="text-[10px] text-[#2A1845]/60">Rol</div>
                    <div className="text-xs font-black text-[#2A1845] capitalize">{personalityRole}</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-[#F0E2D4]">
                    <div className="text-[10px] text-[#2A1845]/60">Snack Fav</div>
                    <div className="text-xs font-black text-amber-600 truncate">{PARK_FOOD_OPTIONS.find(f => f.id === favoriteParkFood)?.name?.split(' ')[0] || 'Snack'}</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-[#F0E2D4]">
                    <div className="text-[10px] text-[#2A1845]/60">Adrenalina</div>
                    <div className="text-xs font-black text-[#E64A38] capitalize">{adrenaline}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#F0E2D4] flex items-center justify-between gap-3 shrink-0">
          {!isCompleted ? (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-full border border-[#F0E2D4] hover:bg-slate-50 text-[#2A1845] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 rounded-full bg-[#E64A38] hover:bg-[#D63031] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F7B731] to-[#FFA801] hover:from-[#FFA801] hover:to-[#F7B731] text-[#2A1845] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#2A1845]" />
                  <span>¡Generar Mi Pasaporte!</span>
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#E64A38] to-[#D63031] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                ¡Comenzar Mi Aventura Personalizada! →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
