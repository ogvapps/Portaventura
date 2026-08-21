import React, { useState } from 'react';
import { UserPreferences, AreaId } from '../types';
import { AREAS, ATTRACTIONS } from '../data/attractions';
import { CarnivalBunting, StarSparkles, TicketStamp } from './ParkDecorations';
import { AVATAR_OPTIONS, PERSONALITY_ROLES, PARK_FOOD_OPTIONS, VISIT_GOAL_OPTIONS } from './PreferenceSurveyModal';
import { AppLogo } from './AppLogo';
import {
  X,
  Sparkles,
  Edit3,
  Award,
  Compass,
  Ruler,
  Shield,
  Utensils,
  Target,
  Share2,
  Check,
  Zap,
  Droplets,
  Heart,
  RotateCcw,
  LogOut,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserProfilePassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPreferences: UserPreferences | null;
  onEditPreferences: () => void;
  onSelectAttraction?: (attractionId: string) => void;
  onLogout?: () => void;
}

export const UserProfilePassportModal: React.FC<UserProfilePassportModalProps> = ({
  isOpen,
  onClose,
  userPreferences,
  onEditPreferences,
  onSelectAttraction,
  onLogout,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showConfirmWipe, setShowConfirmWipe] = useState(false);

  if (!isOpen || !userPreferences) return null;

  const currentAvatar =
    AVATAR_OPTIONS.find((a) => a.id === userPreferences.avatar) || AVATAR_OPTIONS[0];
  const currentRole =
    PERSONALITY_ROLES.find((r) => r.id === userPreferences.personalityRole) ||
    PERSONALITY_ROLES[0];
  const currentFood =
    PARK_FOOD_OPTIONS.find((f) => f.id === userPreferences.favoriteParkFood) ||
    PARK_FOOD_OPTIONS[0];
  const currentGoal =
    VISIT_GOAL_OPTIONS.find((g) => g.id === userPreferences.visitGoal) ||
    VISIT_GOAL_OPTIONS[0];

  // Calculate statistics
  const userHeight = userPreferences.heightCm || 170;
  const eligibleAttractionsCount = ATTRACTIONS.filter(
    (a) => !a.minHeightCm || userHeight >= a.minHeightCm
  ).length;

  const handleSharePassport = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F7B731', '#E64A38', '#0284C7'],
      });
      navigator.clipboard?.writeText(
        `¡Mira mi Pasaporte de Aventurero PortAventura! Soy ${userPreferences.visitorName} (${userPreferences.archetypeName || 'Titán del Parque'}), con título: "${userPreferences.customTitle || 'Aventurero Ilustre'}". ¡Nos vemos en Shambhala!`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-[#F0E2D4] overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-[#2A1845] via-[#4A154B] to-[#2A1845] p-5 sm:p-6 text-white relative shrink-0">
          <CarnivalBunting className="h-3.5 absolute top-0 left-0 right-0 opacity-80" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-[#E64A38] text-white flex items-center justify-center transition-colors font-bold z-20 text-sm shadow-md"
            aria-label="Cerrar pasaporte"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between gap-3 mt-2 pr-10">
            <div className="flex items-center gap-3.5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/80 shrink-0"
                style={{ backgroundColor: userPreferences.customAvatarBg || '#E64A38' }}
              >
                {currentAvatar.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-[#F7B731] text-[#2A1845] px-2.5 py-0.5 rounded-full shadow-xs">
                    Pasaporte Oficial
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
                    {userPreferences.ageGroup ? `Rango: ${userPreferences.ageGroup}` : 'Aventurero'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">
                  {userPreferences.visitorName}
                </h2>
                {userPreferences.nickname && (
                  <p className="text-xs text-[#F7B731] font-semibold">
                    alias «{userPreferences.nickname}»
                  </p>
                )}
              </div>
            </div>

            <div className="hidden sm:block w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white/40 shrink-0">
              <AppLogo className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Scrollable Passport Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#FBF8F3]">
          {/* Main Passport Card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#FFF9F3] via-white to-[#FFF0E5] p-5 sm:p-6 border-2 border-[#E64A38]/30 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F0E2D4] pb-4">
              <div>
                <div className="text-[11px] font-black text-[#E64A38] uppercase tracking-widest">
                  Título Honorífico PortAventura
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-black text-[#2A1845] mt-0.5">
                  {userPreferences.customTitle || userPreferences.archetypeName}
                </h3>
                {userPreferences.adventureMotto && (
                  <p className="text-xs text-[#2A1845]/70 italic mt-1 font-serif">
                    {userPreferences.adventureMotto}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-full bg-[#2A1845] text-[#F7B731] text-xs font-serif font-black flex items-center gap-1.5 shadow-xs">
                  <span>{userPreferences.archetypeIcon || '⭐'}</span>
                  <span>{userPreferences.archetypeName}</span>
                </span>
              </div>
            </div>

            {/* Quick Passport Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-white p-3 rounded-2xl border border-[#F0E2D4] shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-[#2A1845]/60 font-semibold mb-1">
                  <Ruler className="w-3.5 h-3.5 text-[#E64A38]" />
                  <span>Tu Altura</span>
                </div>
                <div className="text-base font-black text-[#2A1845]">
                  {userPreferences.heightCm} cm
                </div>
                <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                  {eligibleAttractionsCount} de {ATTRACTIONS.length} aptas
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-[#F0E2D4] shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-[#2A1845]/60 font-semibold mb-1">
                  <Shield className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Personalidad</span>
                </div>
                <div className="text-xs font-black text-[#2A1845] truncate">
                  {currentRole.emoji} {currentRole.name}
                </div>
                <div className="text-[10px] text-[#2A1845]/60 mt-0.5">
                  {currentRole.badge}
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-[#F0E2D4] shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-[#2A1845]/60 font-semibold mb-1">
                  <Utensils className="w-3.5 h-3.5 text-amber-500" />
                  <span>Snack Fav</span>
                </div>
                <div className="text-xs font-black text-[#2A1845] truncate">
                  {currentFood.emoji} {currentFood?.name ? currentFood.name.split('&')[0].trim() : 'Snack'}
                </div>
                <div className="text-[10px] text-amber-600 font-bold mt-0.5">
                  ¡Imprescindible!
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-[#F0E2D4] shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-[#2A1845]/60 font-semibold mb-1">
                  <Zap className="w-3.5 h-3.5 text-purple-500" />
                  <span>Adrenalina</span>
                </div>
                <div className="text-xs font-black text-[#2A1845] capitalize">
                  {userPreferences.adrenalinePreference}
                </div>
                <div className="text-[10px] text-purple-600 font-bold mt-0.5 capitalize">
                  Agua: {userPreferences.waterPreference}
                </div>
              </div>
            </div>
          </div>

          {/* Personality Description & Hobbies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
              <h4 className="font-serif font-black text-[#2A1845] text-sm flex items-center gap-2 mb-2">
                <span>{currentRole.emoji}</span>
                <span>Tu Estilo de Aventurero</span>
              </h4>
              <p className="text-xs text-[#2A1845]/80 leading-relaxed font-light">
                {currentRole.desc}
              </p>
              <div className="mt-3 pt-3 border-t border-[#F0E2D4] flex items-center justify-between text-xs">
                <span className="text-[#2A1845]/60 font-medium">Tolerancia al mareo:</span>
                <span className="font-bold text-[#2A1845] capitalize">
                  {userPreferences.motionTolerance === 'acero'
                    ? '🛡️ Estómago de acero'
                    : userPreferences.motionTolerance === 'sensible'
                    ? '🌿 Caídas limpias'
                    : '⚡ Normal'}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
              <h4 className="font-serif font-black text-[#2A1845] text-sm flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#E64A38]" />
                <span>Tu Gran Meta en el Parque</span>
              </h4>
              <p className="text-xs text-[#2A1845]/80 leading-relaxed font-light">
                <span className="font-bold text-[#2A1845]">{currentGoal.emoji} {currentGoal.name}:</span>{' '}
                {currentGoal.desc}
              </p>
              <div className="mt-3 pt-3 border-t border-[#F0E2D4] flex items-center justify-between text-xs">
                <span className="text-[#2A1845]/60 font-medium">Compañía habitual:</span>
                <span className="font-bold text-[#2A1845] capitalize">
                  {userPreferences.groupType === 'amigos'
                    ? '👥 Con amigos'
                    : userPreferences.groupType === 'familia_ninos'
                    ? '👨‍👩‍👧‍👦 Con niños'
                    : userPreferences.groupType === 'pareja'
                    ? '❤️ En pareja'
                    : '🎒 Modo explorador solo'}
                </span>
              </div>
            </div>
          </div>

          {/* Preferred Areas Tags */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0E2D4] shadow-xs">
            <h4 className="font-serif font-black text-[#2A1845] text-sm flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-[#0284C7]" />
              <span>Tus Mundos Favoritos de PortAventura</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {userPreferences.preferredAreas?.map((areaId) => {
                const area = (AREAS as Record<string, any>)[areaId];
                if (!area) return null;
                return (
                  <span
                    key={areaId}
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-xs flex items-center gap-1.5"
                    style={{ backgroundColor: area.color }}
                  >
                    <span>{area.icon}</span>
                    <span>{area.name}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Privacy & Account Reset Section */}
          {showConfirmWipe ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-4 sm:p-5 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-red-900 text-sm">
                    ¿Cerrar sesión y borrar todos tus datos?
                  </h4>
                  <p className="text-xs text-red-700/80 mt-1 leading-relaxed">
                    Se eliminará permanentemente tu pasaporte de aventurero, tu perfil, tus gustos y el historial de encuestas tanto de este dispositivo como de la base de datos de Firebase.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-3.5">
                    <button
                      id="btn-confirm-wipe-logout"
                      onClick={() => {
                        setShowConfirmWipe(false);
                        if (onLogout) onLogout();
                      }}
                      className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Sí, borrar todo y cerrar sesión</span>
                    </button>
                    <button
                      onClick={() => setShowConfirmWipe(false)}
                      className="px-4 py-2 rounded-full bg-white hover:bg-red-100 text-red-800 font-bold text-xs uppercase tracking-wider border border-red-200 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-slate-200/70 flex items-center justify-center text-slate-600">
                  <LogOut className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2A1845]">Privacidad y Cuenta</div>
                  <div className="text-[11px] text-slate-500">¿Quieres resetear la app y empezar de cero?</div>
                </div>
              </div>
              <button
                id="btn-trigger-wipe-logout"
                onClick={() => setShowConfirmWipe(true)}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cerrar sesión & Borrar datos</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#F0E2D4] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={onEditPreferences}
            className="px-4 py-2.5 rounded-full bg-[#FFF0E5] hover:bg-[#FFE0D0] text-[#E64A38] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Mi Perfil & Gustos</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSharePassport}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-[#F0E2D4] text-[#2A1845] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-2xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#0284C7]" />
                  <span>Compartir</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E64A38] to-[#D63031] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              Cerrar Pasaporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
