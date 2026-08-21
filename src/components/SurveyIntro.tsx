import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Droplets,
  Smile,
  Sparkles,
  Play,
  SlidersHorizontal,
  Calendar,
  User,
  Clock,
  ArrowRight,
  RotateCcw,
  Zap,
  CheckCircle2,
  ChevronRight,
  Star,
  Award,
  Ticket,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { SURVEY_PRESETS } from '../data/presets';
import { AttractionRating, SurveyPreset, SurveySession, UserPreferences } from '../types';
import { ATTRACTIONS, AREAS } from '../data/attractions';
import { CarnivalBunting, ParkSkylineBanner, StarSparkles, TicketStamp, FlyerCapsule } from './ParkDecorations';
import { RecommendedAttractionsSection } from './RecommendedAttractionsSection';
import { AppLogo } from './AppLogo';

interface SurveyIntroProps {
  onStartPreset: (preset: SurveyPreset, visitorName: string, visitDate: string) => void;
  onStartCustom: (visitorName: string, visitDate: string) => void;
  onResumeActive: () => void;
  activeSession: SurveySession | null;
  savedSessions: SurveySession[];
  onOpenSession: (session: SurveySession) => void;
  onStartSingleSurvey?: (attractionId: string, visitorName: string, visitDate: string) => void;
  onOpenWaitTimes?: () => void;
  onOpenGames?: () => void;
  userPreferences?: UserPreferences | null;
  onOpenPreferenceSurvey?: () => void;
  onOpenPassport?: () => void;
  onOpenAIChat?: () => void;
}

export const SurveyIntro: React.FC<SurveyIntroProps> = ({
  onStartPreset,
  onStartCustom,
  onResumeActive,
  activeSession,
  savedSessions,
  onOpenSession,
  onStartSingleSurvey,
  onOpenWaitTimes,
  onOpenGames,
  userPreferences,
  onOpenPreferenceSurvey,
  onOpenPassport,
  onOpenAIChat,
}) => {
  const [visitorName, setVisitorName] = useState('Aventurero PortAventura');
  const [visitDate, setVisitDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('top-10');
  const [selectedSingleAttractionId, setSelectedSingleAttractionId] = useState<string>('shambhala');

  const selectedPreset = SURVEY_PRESETS.find((p) => p.id === selectedPresetId) || SURVEY_PRESETS[0];

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-[#E64A38]" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-[#E64A38]" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-[#38A3A5]" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-[#81B29A]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#F7B731]" />;
    }
  };

  const activeRatedCount = activeSession && activeSession.ratings
    ? (Object.values(activeSession.ratings) as AttractionRating[]).filter((r) => r.rodeIt || r.skipReason).length
    : 0;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#FFF9F3] text-[#2A1845] pb-24">
      {/* Hero Poster Section (Inspired by Borcelle & Wonderland Flyers) */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF0E5] via-[#FFF9F3] to-[#FFF9F3] border-b border-[#F0E2D4] pt-4 pb-14">
        {/* Carnival Bunting at top of poster */}
        <CarnivalBunting className="mb-2" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Outer Flyer Frame Container */}
          <div className="flyer-frame max-w-5xl mx-auto shadow-xl bg-white/40">
            <div className="flyer-inner p-6 sm:p-10 text-center relative overflow-hidden bg-gradient-to-b from-white via-[#FFFBF7] to-[#FFF5EC]">
              {/* Flyer Badges / Pills (Borcelle & Wonderland Style) */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <FlyerCapsule variant="peach">
                  <span className="font-script text-base text-[#E64A38] font-bold">¡Vive la magia!</span>
                  <span>Gran Encuesta del Parque</span>
                </FlyerCapsule>

                <FlyerCapsule variant="coral">
                  <span>Con toda la familia & amigos</span>
                </FlyerCapsule>
              </div>

              {/* Main Headline with script typography & App Badge */}
              <div className="my-3 flex flex-col items-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mb-3 shadow-2xl rounded-3xl overflow-hidden ring-4 ring-[#E64A38]/20 hover:scale-105 hover:rotate-1 transition-all duration-300">
                  <AppLogo className="w-full h-full" />
                </div>
                <p className="font-script text-2xl sm:text-3xl text-[#E64A38] font-bold tracking-wide">
                  Tu Gran Experiencia en
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-[#2A1845] tracking-tight leading-tight uppercase">
                  PortAventura <span className="text-[#E64A38]">World</span>
                </h1>
                <p className="font-script text-xl sm:text-2xl text-[#2A1845]/80 font-bold mt-1">
                  Valora cada atracción, montaña rusa y rincón del parque
                </p>
              </div>

              <p className="mt-3 text-sm sm:text-base text-[#2A1845]/75 max-w-2xl mx-auto leading-relaxed font-light">
                Crea tu ranking personal de adrenalina, velocidad y tematización. Compara tus notas con la media comunitaria de visitantes y descubre tu pasaporte de aventurero.
              </p>

              {/* Skyline Banner Graphic */}
              <div className="my-6">
                <ParkSkylineBanner className="opacity-90" />
              </div>

              {/* Primary Call to Action buttons in the Hero */}
              <div className="my-6 flex flex-wrap items-center justify-center gap-3.5">
                <button
                  id="btn-hero-start-survey"
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('section-survey-presets');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      onStartPreset(selectedPreset, visitorName, visitDate);
                    }
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#E64A38] to-[#D63031] hover:from-[#D63031] hover:to-[#B31D1D] text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#E64A38]/30 transition-all flex items-center gap-2.5 active:scale-95 border-2 border-white/60 group"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Comenzar Nueva Encuesta</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="btn-hero-custom-survey"
                  type="button"
                  onClick={() => onStartCustom(visitorName, visitDate)}
                  className="px-6 py-3.5 bg-white/90 hover:bg-white text-[#2A1845] border-2 border-[#38A3A5] hover:border-[#2b8385] rounded-full font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#38A3A5]" />
                  <span>Crear a Medida</span>
                </button>
              </div>

              {/* Quick Feature Badges (Wonderland Inspired) */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#2A1845] font-semibold">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF9F3] border border-[#E64A38]/30 shadow-2xs">
                  <span>🎢</span>
                  <strong>6 Mundos Temáticos</strong>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF9F3] border border-[#38A3A5]/30 shadow-2xs">
                  <span>🌊</span>
                  <strong>Acuáticas & Coasters</strong>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF9F3] border border-[#F7B731]/40 shadow-2xs">
                  <span>🏎️</span>
                  <strong>Ferrari Land (180 km/h)</strong>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF9F3] border border-[#8E7CC3]/40 shadow-2xs">
                  <StarSparkles />
                  <span>Pasaporte de Honor</span>
                </div>
              </div>

              {/* Resume In-Progress Banner if active */}
              {activeSession && !activeSession.completed && (
                <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-[#2A1845] text-[#FFF9F3] border-2 border-[#F7B731] shadow-xl max-w-xl mx-auto text-left relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-[#F7B731] font-bold uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4 text-[#F7B731]" />
                      <span>Encuesta en Curso</span>
                    </span>
                    <span className="bg-[#E64A38] text-white px-2.5 py-0.5 rounded-full text-[10px]">
                      {activeRatedCount} evaluadas
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-white text-lg truncate">{activeSession.title}</h3>
                  <p className="text-xs text-[#FFF9F3]/70 mt-0.5">
                    Visitante: {activeSession.visitorName || 'Aventurero'} • {activeSession.visitDate || 'Hoy'}
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-2.5 mt-3 overflow-hidden border border-white/20">
                    <div
                      className="bg-gradient-to-r from-[#F7B731] to-[#E64A38] h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(10, (activeRatedCount / 10) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row items-center gap-2.5">
                    <button
                      id="btn-resume-survey"
                      onClick={onResumeActive}
                      className="flex-1 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#F7B731] to-[#FFA801] hover:from-[#FFA801] hover:to-[#F7B731] text-[#2A1845] rounded-full font-bold uppercase tracking-widest text-xs shadow-md transition-all active:scale-[0.98]"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Continuar Encuesta Activa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('section-survey-presets');
                        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="w-full sm:w-auto px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/30 transition-all text-center"
                    >
                      Nueva Encuesta ↓
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Body: Configuration & Survey Selection */}
      <div id="survey-config-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Step 1: Visitor details (Ticket Booth Style from Flyer 3) */}
        <div className="bg-white border-2 border-[#E64A38]/30 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-[#E64A38] uppercase tracking-[0.2em] flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E64A38] text-white text-xs font-bold shadow-2xs">
                1
              </span>
              <span>Datos del Visitante & Entrada</span>
            </h2>
            <TicketStamp text="Pase Oficial" sub="PortAventura" className="hidden sm:inline-flex" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="input-visitor-name" className="block text-xs font-bold uppercase tracking-wider text-[#2A1845]/80 mb-2">
                Nombre o apodo aventurero
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#E64A38] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="input-visitor-name"
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Ej. Marc, Familia Gómez, Fan Coasters..."
                  className="w-full pl-11 pr-4 py-3 bg-[#FFF9F3] border border-[#F0E2D4] rounded-2xl text-sm font-medium text-[#2A1845] placeholder-[#2A1845]/40 focus:outline-none focus:border-[#E64A38] focus:ring-2 focus:ring-[#E64A38]/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label htmlFor="input-visit-date" className="block text-xs font-bold uppercase tracking-wider text-[#2A1845]/80 mb-2">
                Fecha de la visita al parque
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#E64A38] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="input-visit-date"
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#FFF9F3] border border-[#F0E2D4] rounded-2xl text-sm font-medium text-[#2A1845] placeholder-[#2A1845]/40 focus:outline-none focus:border-[#E64A38] focus:ring-2 focus:ring-[#E64A38]/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* On-The-Spot Ride Reviewer (Instant Evaluation + Next Ride Recommendation) */}
        {onStartSingleSurvey && (
          <div className="bg-gradient-to-br from-[#2A1845] to-[#3B2260] text-white border-2 border-[#F7B731] rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
            <StarSparkles className="top-3 right-6 text-[#F7B731]" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-[#E64A38] text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-xs">
                    <Zap className="w-3 h-3 fill-current" />
                    <span>En Directo en el Parque</span>
                  </span>
                  <span className="text-xs text-[#F7B731] font-bold">
                    ¡Recomendación al instante!
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
                  ¿Te acabas de bajar de una atracción?
                </h2>
                <p className="text-xs text-white/80 mt-1 font-light leading-relaxed">
                  Abre su encuesta rápida en 30 segundos y la app te dirá cuál es la siguiente atracción parecida o ideal para continuar tu aventura.
                </p>

                {/* Popular Quick-Tap Icons */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-white/60 font-semibold">Populares hoy:</span>
                  {[
                    { id: 'shambhala', name: 'Shambhala' },
                    { id: 'dragon-khan', name: 'Dragon Khan' },
                    { id: 'furius-baco', name: 'Furius Baco' },
                    { id: 'red-force', name: 'Red Force' },
                    { id: 'tutuki-splash', name: 'Tutuki Splash' },
                    { id: 'uncharted', name: 'Uncharted' },
                  ].map((att) => (
                    <button
                      key={att.id}
                      onClick={() => onStartSingleSurvey(att.id, visitorName, visitDate)}
                      className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#E64A38] text-white text-[11px] font-bold border border-white/20 hover:border-transparent transition-colors shadow-2xs"
                    >
                      {att.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector & Action */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl flex flex-col gap-3 min-w-[280px]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#F7B731]">
                  Elige entre las 49 atracciones:
                </label>
                <select
                  value={selectedSingleAttractionId}
                  onChange={(e) => setSelectedSingleAttractionId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F3] text-[#2A1845] text-xs font-bold rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#F7B731]"
                >
                  {ATTRACTIONS.map((att) => (
                    <option key={att.id} value={att.id}>
                      {att.name} ({AREAS[att.areaId]?.name})
                    </option>
                  ))}
                </select>

                <button
                  id="btn-start-single-survey-hero"
                  onClick={() => onStartSingleSurvey(selectedSingleAttractionId, visitorName, visitDate)}
                  className="w-full py-3 bg-gradient-to-r from-[#F7B731] to-[#FFA801] hover:from-[#FFA801] hover:to-[#F7B731] text-[#2A1845] rounded-full font-bold uppercase tracking-widest text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Abrir Encuesta & Recibir Recomendación</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Park Experience Shortcuts: Wait Times, Queue Games & AI Companion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {onOpenWaitTimes && (
            <div
              onClick={onOpenWaitTimes}
              className="bg-white border-2 border-[#F0E2D4] hover:border-[#E64A38] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF0E5] text-[#E64A38] flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
                  ⏱️
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase text-[#E64A38] tracking-widest">En Vivo</span>
                  </div>
                  <h3 className="text-sm font-serif font-black text-[#2A1845] group-hover:text-[#E64A38] transition-colors leading-tight">
                    Tiempos de Espera
                  </h3>
                  <p className="text-[11px] text-[#2A1845]/70 font-light mt-0.5">
                    49 atracciones con colas en directo
                  </p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-[#FFF9F3] group-hover:bg-[#E64A38] group-hover:text-white text-[11px] font-bold text-[#2A1845] border border-[#F0E2D4] transition-colors shrink-0">
                Ver →
              </div>
            </div>
          )}

          {onOpenGames && (
            <div
              onClick={onOpenGames}
              className="bg-white border-2 border-[#F0E2D4] hover:border-[#0284C7] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
                  🎮
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-[#0284C7] tracking-widest">
                    Anti-Aburrimiento
                  </div>
                  <h3 className="text-sm font-serif font-black text-[#2A1845] group-hover:text-[#0284C7] transition-colors leading-tight">
                    Juegos de Cola
                  </h3>
                  <p className="text-[11px] text-[#2A1845]/70 font-light mt-0.5">
                    Trivia, duelos y retos de reflejos
                  </p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-[#FFF9F3] group-hover:bg-[#0284C7] group-hover:text-white text-[11px] font-bold text-[#2A1845] border border-[#F0E2D4] transition-colors shrink-0">
                Jugar →
              </div>
            </div>
          )}

          {onOpenAIChat && (
            <div
              onClick={onOpenAIChat}
              className="bg-white border-2 border-[#F0E2D4] hover:border-[#9333EA] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 text-[#9333EA] flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
                  🤖
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-[#9333EA] tracking-widest">
                    IA Personalizable
                  </div>
                  <h3 className="text-sm font-serif font-black text-[#2A1845] group-hover:text-[#9333EA] transition-colors leading-tight">
                    Chat con Asistente
                  </h3>
                  <p className="text-[11px] text-[#2A1845]/70 font-light mt-0.5">
                    Habla con Woody o guías del parque
                  </p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-[#FFF9F3] group-hover:bg-[#9333EA] group-hover:text-white text-[11px] font-bold text-[#2A1845] border border-[#F0E2D4] transition-colors shrink-0">
                Hablar →
              </div>
            </div>
          )}
        </div>

        {/* Personalized Recommendations Section or Preference Survey CTA */}
        {userPreferences ? (
          <RecommendedAttractionsSection
            userPreferences={userPreferences}
            onOpenSurveyModal={onOpenPreferenceSurvey || (() => {})}
            onOpenPassport={onOpenPassport}
            onSelectAttraction={(attractionId) => {
              if (onStartSingleSurvey) {
                onStartSingleSurvey(attractionId, visitorName, visitDate);
              }
            }}
            onViewWaitTimes={onOpenWaitTimes}
          />
        ) : (
          <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#2A1845] via-[#3B2260] to-[#2A1845] p-6 sm:p-7 text-white shadow-xl border border-white/20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#F7B731] text-[#2A1845] flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
                  ✨
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#E64A38] text-white px-2.5 py-0.5 rounded-full">
                      ¡Personaliza tu visita!
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-black text-white mt-0.5">
                    ¿Cómo te gustan las atracciones?
                  </h3>
                  <p className="text-xs text-white/80 max-w-xl font-light">
                    Completa nuestro test rápido de gustos (altura, agua, adrenalina) y te recomendaremos tus aventuras perfectas en el parque.
                  </p>
                </div>
              </div>

              {onOpenPreferenceSurvey && (
                <button
                  type="button"
                  onClick={onOpenPreferenceSurvey}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#F7B731] to-[#FFA801] hover:from-[#FFA801] hover:to-[#F7B731] text-[#2A1845] font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 shrink-0 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#2A1845]" />
                  <span>Hacer Encuesta Inicial</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Choose Survey Mode (Flyer Card Presets) */}
        <div id="section-survey-presets" className="mb-10 scroll-mt-24">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold text-[#E64A38] uppercase tracking-[0.2em] flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E64A38] text-white text-xs font-bold shadow-2xs">
                2
              </span>
              <span>Elige el itinerario de tu encuesta</span>
            </h2>
            <span className="font-script text-lg text-[#E64A38] font-bold">¡Selecciona y comienza!</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SURVEY_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  id={`card-preset-${preset.id}`}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`relative cursor-pointer rounded-3xl p-6 transition-all text-left flex flex-col justify-between border-2 ${
                    isSelected
                      ? 'bg-white border-[#E64A38] shadow-lg ring-2 ring-[#E64A38]/20 scale-[1.01]'
                      : 'bg-white/80 border-[#F0E2D4] hover:border-[#E64A38]/50 hover:bg-white shadow-xs'
                  }`}
                >
                  {preset.badge && (
                    <span
                      className={`absolute top-5 right-5 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                        isSelected
                          ? 'bg-[#E64A38] text-white border-transparent shadow-xs'
                          : 'bg-[#FFF9F3] text-[#2A1845]/70 border-[#F0E2D4]'
                      }`}
                    >
                      {preset.badge}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="p-3 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] shadow-2xs">
                        {getPresetIcon(preset.icon)}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-[#2A1845] text-lg">{preset.title}</h3>
                        <p className="font-script text-base text-[#E64A38] font-bold leading-none">{preset.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#2A1845]/75 leading-relaxed mb-5 font-light">
                      {preset.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F0E2D4] flex items-center justify-between text-xs text-[#2A1845]/70 font-medium">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#E64A38]" />
                      ~{preset.estimatedMinutes} min
                    </span>
                    <span className="font-bold text-[#2A1845] bg-[#FCE8DD] px-2.5 py-0.5 rounded-full text-[11px] text-[#E64A38]">
                      {preset.attractionIds.length} atracciones
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Custom Builder Card */}
            <div
              id="card-preset-custom"
              onClick={() => onStartCustom(visitorName, visitDate)}
              className="cursor-pointer rounded-3xl p-6 bg-gradient-to-br from-white to-[#FFF0E5] border-2 border-[#38A3A5]/40 hover:border-[#38A3A5] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="p-3 rounded-2xl bg-[#38A3A5]/15 border border-[#38A3A5]/30 text-[#38A3A5] group-hover:bg-[#38A3A5] group-hover:text-white transition-colors">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#2A1845] text-lg">Crear a Medida</h3>
                    <p className="font-script text-base text-[#38A3A5] font-bold leading-none">100% Personalizado</p>
                  </div>
                </div>
                <p className="text-xs text-[#2A1845]/75 leading-relaxed mb-5 font-light">
                  Marca solo las atracciones exactas en las que te subiste hoy para una valoración a medida.
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0E2D4] flex items-center justify-between text-xs text-[#38A3A5] font-bold uppercase tracking-wider">
                <span>Personalizar Lista</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Start Action Bar (Amusement Summer Park Style with Coral & Gold Glow) */}
        <div className="bg-white border-2 border-[#E64A38] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FCE8DD] border border-[#E64A38]/40 flex items-center justify-center text-[#E64A38] shrink-0 text-2xl shadow-sm">
              🎡
            </div>
            <div>
              <div className="text-xs text-[#E64A38] font-bold uppercase tracking-wider">Modalidad Lista</div>
              <div className="text-xl font-serif font-bold text-[#2A1845]">{selectedPreset.title}</div>
              <div className="text-xs text-[#2A1845]/70">
                {selectedPreset.attractionIds.length} preguntas interactivas con ranking al finalizar
              </div>
            </div>
          </div>

          <button
            id="btn-start-selected-survey"
            onClick={() => onStartPreset(selectedPreset, visitorName, visitDate)}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#E64A38] to-[#D63031] hover:from-[#D63031] hover:to-[#B31D1D] text-white font-bold uppercase tracking-widest rounded-full shadow-lg shadow-[#E64A38]/25 transition-all flex items-center justify-center gap-3 text-xs active:scale-95 border-2 border-white/60"
          >
            <span>Comenzar Encuesta</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Saved Sessions History Section */}
        {savedSessions.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-bold text-[#E64A38] uppercase tracking-[0.2em] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#E64A38]" />
                <span>Tus Visitas Anteriores Guardadas ({savedSessions.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedSessions.slice(0, 3).map((session) => {
                const sessionRatings = (Object.values(session.ratings || {}) as AttractionRating[]);
                const ratedTotal = sessionRatings.filter((r) => r.rodeIt).length;
                const scores = sessionRatings
                  .map((r) => r.score)
                  .filter((s): s is number => typeof s === 'number');
                const avg = scores.length
                  ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
                  : '-';

                return (
                  <div
                    key={session.id}
                    onClick={() => onOpenSession(session)}
                    className="p-5 rounded-3xl bg-white border border-[#F0E2D4] hover:border-[#E64A38] hover:shadow-md cursor-pointer transition-all flex items-center justify-between group shadow-xs"
                  >
                    <div>
                      <div className="text-sm font-serif font-bold text-[#2A1845] truncate max-w-[180px]">
                        {session.title}
                      </div>
                      <div className="text-xs text-[#2A1845]/60 mt-1 font-light">
                        {session.visitDate} • {ratedTotal} atracciones
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-[#2A1845]/40">Media</div>
                        <div className="text-sm font-bold text-[#E64A38] flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#E64A38]" />
                          {avg}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#2A1845]/40 group-hover:text-[#E64A38] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

