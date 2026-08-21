import React from 'react';
import {
  Volume2,
  VolumeX,
  History,
  MapPin,
  Sparkles,
  PlusCircle,
  Clock,
  Gamepad2,
  Bot,
  User,
  LogOut,
  Home,
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled } from '../utils/audio';
import { CarnivalBunting } from './ParkDecorations';
import { UserPreferences } from '../types';
import { AVATAR_OPTIONS } from './PreferenceSurveyModal';
import { AppLogo } from './AppLogo';

interface NavbarProps {
  currentView: 'intro' | 'survey' | 'results' | 'catalog' | 'history' | 'waittimes' | 'games' | 'chat';
  onNavigate: (view: 'intro' | 'survey' | 'results' | 'catalog' | 'history' | 'waittimes' | 'games' | 'chat') => void;
  onNewSurvey: () => void;
  onOpenPreferenceSurvey?: () => void;
  onOpenPassport?: () => void;
  onLogout?: () => void;
  userPreferences?: UserPreferences | null;
  activeProgress?: { current: number; total: number; title: string };
  hasActiveSession?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onNewSurvey,
  onOpenPreferenceSurvey,
  onOpenPassport,
  onLogout,
  userPreferences,
  activeProgress,
  hasActiveSession,
}) => {
  const [sound, setSound] = React.useState(isSoundEnabled());

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
  };

  const userAvatarObj = userPreferences
    ? AVATAR_OPTIONS.find((a) => a.id === userPreferences.avatar) || AVATAR_OPTIONS[0]
    : null;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFF9F3]/95 backdrop-blur-md border-b border-[#F0E2D4] text-[#2A1845]">
        {/* Decorative top micro bunting */}
        <CarnivalBunting className="h-2.5 sm:h-3 opacity-90" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between pb-1">
          {/* Brand / Logo */}
          <button
            id="btn-nav-home"
            onClick={() => onNavigate('intro')}
            className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-none min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 group-hover:rotate-3 transition-transform border border-white/80 shrink-0">
              <AppLogo className="w-full h-full" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif font-black text-base sm:text-xl tracking-tight text-[#2A1845] truncate">
                  PortAventura
                </span>
                <span className="font-script text-base sm:text-xl text-[#E64A38] font-bold leading-none hidden xs:inline">
                  World
                </span>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#E64A38] text-white font-bold uppercase tracking-wider shadow-2xs shrink-0">
                  Encuestas
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#2A1845]/70 font-medium hidden sm:block truncate">
                <span className="font-script text-sm text-[#E64A38] font-bold mr-1">¡Vive la aventura!</span> • Valoración, Esperas, Juegos & IA
              </p>
            </div>
          </button>

          {/* Center: In-survey progress indicator if active (Desktop) */}
          {currentView === 'survey' && activeProgress && (
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-[#E64A38]/30 shadow-xs ring-1 ring-[#E64A38]/10">
              <span className="text-xs text-[#2A1845]/80 font-bold truncate max-w-[160px]">
                {activeProgress.title}
              </span>
              <div className="w-24 h-2.5 bg-[#FCE8DD] rounded-full overflow-hidden border border-[#E64A38]/20">
                <div
                  className="h-full bg-gradient-to-r from-[#E64A38] to-[#F7B731] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round((activeProgress.current / activeProgress.total) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-xs font-black text-[#E64A38]">
                {activeProgress.current}/{activeProgress.total}
              </span>
            </div>
          )}

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {/* Live Wait Times */}
            <button
              id="btn-nav-waittimes"
              onClick={() => onNavigate('waittimes')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                currentView === 'waittimes'
                  ? 'bg-[#E64A38] text-white shadow-sm'
                  : 'text-[#2A1845]/75 hover:text-[#E64A38] hover:bg-white border border-transparent hover:border-[#E64A38]/20'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Tiempos de Espera</span>
            </button>

            {/* Queue Games */}
            <button
              id="btn-nav-games"
              onClick={() => onNavigate('games')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                currentView === 'games'
                  ? 'bg-[#0284C7] text-white shadow-sm'
                  : 'text-[#2A1845]/75 hover:text-[#0284C7] hover:bg-white border border-transparent hover:border-[#0284C7]/20'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Juegos de Cola</span>
            </button>

            {/* AI Chat Companion */}
            <button
              id="btn-nav-chat"
              onClick={() => onNavigate('chat')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                currentView === 'chat'
                  ? 'bg-[#9333EA] text-white shadow-sm'
                  : 'text-[#2A1845]/75 hover:text-[#9333EA] hover:bg-white border border-transparent hover:border-[#9333EA]/20'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Chat con IA</span>
            </button>

            {/* Attractions Catalog */}
            <button
              id="btn-nav-catalog"
              onClick={() => onNavigate('catalog')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                currentView === 'catalog'
                  ? 'bg-[#E64A38] text-white shadow-sm'
                  : 'text-[#2A1845]/75 hover:text-[#E64A38] hover:bg-white border border-transparent hover:border-[#E64A38]/20'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Atracciones</span>
            </button>

            {/* History */}
            <button
              id="btn-nav-history"
              onClick={() => onNavigate('history')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                currentView === 'history'
                  ? 'bg-[#E64A38] text-white shadow-sm'
                  : 'text-[#2A1845]/75 hover:text-[#E64A38] hover:bg-white border border-transparent hover:border-[#E64A38]/20'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Historial</span>
            </button>
          </div>

          {/* Right Tools (Sound, Profile, CTA) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* User Profile & Passport Button */}
            {userPreferences ? (
              <div className="flex items-center gap-1">
                <button
                  id="btn-nav-passport"
                  onClick={onOpenPassport || onOpenPreferenceSurvey}
                  title={`Pasaporte de ${userPreferences.visitorName || 'Aventurero'} • Clic para ver perfil`}
                  className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-1.5 pr-2 sm:pr-3 py-1 bg-white hover:bg-[#FFF0E5] border-2 border-[#F0E2D4] hover:border-[#E64A38] rounded-full transition-all shadow-xs group"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-2xs group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: userPreferences.customAvatarBg || '#E64A38' }}
                  >
                    {userAvatarObj?.emoji || '🧭'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-[11px] font-black text-[#2A1845] leading-tight truncate max-w-[85px]">
                      {(userPreferences.visitorName || 'Aventurero').split(' ')[0]}
                    </div>
                    <div className="text-[9px] text-[#E64A38] font-bold leading-none truncate max-w-[85px]">
                      {userPreferences.archetypeName || 'Explorador'}
                    </div>
                  </div>
                </button>

                {onLogout && (
                  <button
                    id="btn-nav-logout"
                    onClick={onLogout}
                    title="Cerrar sesión y borrar mis datos"
                    className="p-1.5 sm:p-2 rounded-full text-[#2A1845]/50 hover:text-red-600 hover:bg-red-50 border border-[#F0E2D4] hover:border-red-200 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              onOpenPreferenceSurvey && (
                <button
                  id="btn-nav-preferences"
                  onClick={onOpenPreferenceSurvey}
                  title="Crear mi Perfil de Aventurero & Preferencias"
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#F7B731] to-[#FFA801] text-[#2A1845] text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#2A1845]" />
                  <span className="hidden xs:inline">Mi Perfil</span>
                </button>
              )
            )}

            {/* Sound Toggle */}
            <button
              id="btn-sound-toggle"
              onClick={toggleSound}
              aria-label={sound ? 'Desactivar sonido' : 'Activar sonido'}
              title={sound ? 'Sonido activado' : 'Sonido desactivado'}
              className="p-2 rounded-full text-[#2A1845]/60 hover:text-[#E64A38] hover:bg-white border border-[#F0E2D4] transition-colors"
            >
              {sound ? <Volume2 className="w-4 h-4 text-[#81B29A]" /> : <VolumeX className="w-4 h-4 text-[#2A1845]/40" />}
            </button>

            {/* Start New Survey CTA */}
            <button
              id="btn-new-survey-top"
              onClick={onNewSurvey}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#E64A38] to-[#D63031] hover:from-[#D63031] hover:to-[#B31D1D] text-white rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-md shadow-[#E64A38]/20 transition-all active:scale-95 border border-white/40 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nueva Encuesta</span>
              <span className="sm:hidden">Nueva</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (App Experience on phones) */}
      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#F0E2D4] shadow-[0_-4px_20px_rgba(42,24,69,0.08)] px-1 py-1.5"
      >
        <div className="grid grid-cols-6 items-center gap-0.5 max-w-lg mx-auto">
          {/* Home / Encuestas */}
          <button
            onClick={() => onNavigate('intro')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentView === 'intro' || currentView === 'survey' || currentView === 'results'
                ? 'text-[#E64A38] font-black scale-105'
                : 'text-[#2A1845]/60 hover:text-[#2A1845]'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] uppercase tracking-tighter font-bold">Inicio</span>
          </button>

          {/* Live Wait Times */}
          <button
            onClick={() => onNavigate('waittimes')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentView === 'waittimes'
                ? 'text-[#E64A38] font-black scale-105'
                : 'text-[#2A1845]/60 hover:text-[#2A1845]'
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] uppercase tracking-tighter font-bold">Colas</span>
          </button>

          {/* Queue Games */}
          <button
            onClick={() => onNavigate('games')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentView === 'games'
                ? 'text-[#0284C7] font-black scale-105'
                : 'text-[#2A1845]/60 hover:text-[#2A1845]'
            }`}
          >
            <Gamepad2 className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] uppercase tracking-tighter font-bold">Juegos</span>
          </button>

          {/* AI Chat Companion */}
          <button
            onClick={() => onNavigate('chat')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentView === 'chat'
                ? 'text-[#9333EA] font-black scale-105'
                : 'text-[#2A1845]/60 hover:text-[#2A1845]'
            }`}
          >
            <Bot className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] uppercase tracking-tighter font-bold">Porty IA</span>
          </button>

          {/* Attractions Catalog */}
          <button
            onClick={() => onNavigate('catalog')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentView === 'catalog'
                ? 'text-[#E64A38] font-black scale-105'
                : 'text-[#2A1845]/60 hover:text-[#2A1845]'
            }`}
          >
            <MapPin className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] uppercase tracking-tighter font-bold">Parque</span>
          </button>

          {/* History */}
          <button
            onClick={() => onNavigate('history')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentView === 'history'
                ? 'text-[#E64A38] font-black scale-105'
                : 'text-[#2A1845]/60 hover:text-[#2A1845]'
            }`}
          >
            <History className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] uppercase tracking-tighter font-bold">Historial</span>
          </button>
        </div>
      </nav>
    </>
  );
};


