import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  Award,
  Star,
  Compass,
  Zap,
  RotateCcw,
  Share2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Copy,
  Check,
  Download,
  AlertCircle,
  ThumbsUp,
  Waves,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { Attraction, AttractionRating, SurveySession } from '../types';
import { ATTRACTIONS, AREAS } from '../data/attractions';
import { computeVisitorProfile } from '../utils/storage';
import { getSessionRecommendations } from '../utils/recommendations';
import { CarnivalBunting, StarSparkles, TicketStamp, FlyerCapsule } from './ParkDecorations';

interface SurveyResultsProps {
  session: SurveySession;
  onRestart: () => void;
  onViewCatalog: () => void;
  onOpenSurveyForAttraction?: (attractionId: string) => void;
}

export const SurveyResults: React.FC<SurveyResultsProps> = ({
  session,
  onRestart,
  onViewCatalog,
  onOpenSurveyForAttraction,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('all');

  const ratings = session.ratings || {};
  const profile = computeVisitorProfile(ratings);
  const recommendations = getSessionRecommendations(ratings);

  useEffect(() => {
    // Fire festive confetti on results screen load
    try {
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#E64A38', '#F7B731', '#2A1845', '#38A3A5', '#81B29A'],
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }
  }, []);

  // Filter and sort rated attractions
  const allRatings = (Object.values(ratings) || []) as AttractionRating[];
  const ratedList = allRatings
    .filter((r) => r.rodeIt && typeof r.score === 'number')
    .map((r) => {
      const att = ATTRACTIONS.find((a) => a.id === r.attractionId);
      return {
        ...r,
        attraction: att,
      };
    })
    .filter((item): item is AttractionRating & { attraction: Attraction } => !!item.attraction)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const skippedList = allRatings
    .filter((r) => !r.rodeIt && r.skipReason)
    .map((r) => ({
      ...r,
      attraction: ATTRACTIONS.find((a) => a.id === r.attractionId),
    }))
    .filter((item): item is AttractionRating & { attraction: Attraction } => !!item.attraction);

  // Area breakdown calculations
  const areaStats: Record<string, { totalScore: number; count: number; name: string; color: string }> = {};
  ratedList.forEach((item) => {
    const areaId = item.attraction.areaId;
    if (!areaStats[areaId]) {
      areaStats[areaId] = {
        totalScore: 0,
        count: 0,
        name: AREAS[areaId]?.name || areaId,
        color: AREAS[areaId]?.color || '#f59e0b',
      };
    }
    areaStats[areaId].totalScore += item.score || 0;
    areaStats[areaId].count += 1;
  });

  const filteredList =
    selectedAreaFilter === 'all'
      ? ratedList
      : ratedList.filter((item) => item.attraction.areaId === selectedAreaFilter);

  // Top 3 Podium
  const top1 = ratedList[0];
  const top2 = ratedList[1];
  const top3 = ratedList[2];

  const handleCopySummary = () => {
    const text = `🎢 Mi Valoración de PortAventura World (${session.visitDate || 'Reciente'})
👑 Mi Atracción Favorita: ${top1 ? `${top1.attraction.name} (${top1.score}/10)` : 'Ninguna'}
🥈 Segundo puesto: ${top2 ? `${top2.attraction.name} (${top2.score}/10)` : '-'}
🥉 Tercer puesto: ${top3 ? `${top3.attraction.name} (${top3.score}/10)` : '-'}
⭐ Puntuación Media: ${profile.averageScore}/10 (${ratedList.length} atracciones probadas)
🚀 Velocidad Máxima Alcanzada: ${profile.maxSpeedRode} km/h
🏷️ Perfil: ${profile.title} (${profile.archetype})`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#2A1845] pb-24">
      {/* Top Carnival Bunting Accent */}
      <CarnivalBunting />

      {/* Hero Header Poster */}
      <div className="bg-white border-b-2 border-[#F0E2D4] pt-8 pb-12 relative overflow-hidden">
        <StarSparkles className="top-4 left-8" />
        <StarSparkles className="top-8 right-12" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E64A38]/10 border border-[#E64A38]/30 text-[#E64A38] text-xs font-black uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>¡Pasaporte Sellado & Encuesta Completada!</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#2A1845] tracking-tight">
            Resumen Oficial de tu Visita a{' '}
            <span className="text-[#E64A38]">PortAventura</span>
          </h1>

          <p className="mt-2 text-[#2A1845]/70 text-sm sm:text-base max-w-xl mx-auto font-medium font-script text-xl">
            {session.visitorName || 'Aventurero'} • {session.visitDate || 'Visita Oficial'} • {ratedList.length} atracciones evaluadas
          </p>

          {/* Adventurer Passport Badge */}
          <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-5 p-6 rounded-3xl bg-[#FFF9F3] border-2 border-[#E64A38]/40 shadow-md max-w-2xl text-left relative ring-1 ring-[#E64A38]/20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E64A38] to-[#D63031] flex items-center justify-center text-white text-3xl shadow-md shrink-0 border border-white/50">
              {profile.icon === 'Flame' ? '🔥' : profile.icon === 'Waves' ? '🌊' : '🧭'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#E64A38] font-black uppercase tracking-widest">
                  Tu Perfil de Visitante
                </span>
                <span className="text-[10px] font-black px-3 py-0.5 rounded-full bg-[#2A1845] text-white">
                  {profile.archetype}
                </span>
              </div>
              <h3 className="text-xl font-serif font-black text-[#2A1845] mt-0.5">{profile.title}</h3>
              <p className="text-xs text-[#2A1845]/80 mt-1 font-normal leading-relaxed">{profile.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white border-2 border-[#F0E2D4] text-center shadow-xs">
            <div className="text-xs text-[#2A1845]/60 font-bold uppercase tracking-wider">Nota Media</div>
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#E64A38] flex items-center justify-center gap-1 mt-1">
              <Star className="w-5 h-5 fill-[#E64A38]" />
              {profile.averageScore}
              <span className="text-xs text-[#2A1845]/40 font-normal">/10</span>
            </div>
            <div className="text-[11px] text-[#2A1845]/60 mt-1">{ratedList.length} valoraciones</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border-2 border-[#F0E2D4] text-center shadow-xs">
            <div className="text-xs text-[#2A1845]/60 font-bold uppercase tracking-wider">Velocidad Máx.</div>
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#2A1845] flex items-center justify-center gap-1 mt-1">
              <Zap className="w-5 h-5 text-[#F7B731]" />
              {profile.maxSpeedRode}
              <span className="text-xs text-[#2A1845]/40 font-normal">km/h</span>
            </div>
            <div className="text-[11px] text-[#2A1845]/60 mt-1">Récord alcanzado</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border-2 border-[#F0E2D4] text-center shadow-xs">
            <div className="text-xs text-[#2A1845]/60 font-bold uppercase tracking-wider">Altura Máx.</div>
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#38A3A5] flex items-center justify-center gap-1 mt-1">
              <TrendingUp className="w-5 h-5" />
              {profile.maxHeightRode}
              <span className="text-xs text-[#2A1845]/40 font-normal">m</span>
            </div>
            <div className="text-[11px] text-[#2A1845]/60 mt-1">Caída libre / Vuelo</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border-2 border-[#F0E2D4] text-center shadow-xs">
            <div className="text-xs text-[#2A1845]/60 font-bold uppercase tracking-wider">Área Favorita</div>
            <div className="text-lg sm:text-xl font-serif font-black text-[#2A1845] truncate mt-1">
              {profile.topArea}
            </div>
            <div className="text-[11px] text-[#2A1845]/60 mt-1">Mayor satisfacción</div>
          </div>
        </div>

        {/* Podium: Top 3 Attractions */}
        {ratedList.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-black text-[#E64A38] uppercase tracking-widest flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-[#F7B731]" />
              Tu Podio de Honor
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1st Place (Center / Highlight) */}
              {top1 && (
                <div className="order-1 md:order-2 p-6 rounded-3xl bg-white border-2 border-[#E64A38] shadow-md relative flex flex-col justify-between ring-2 ring-[#E64A38]/20">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#E64A38] to-[#F7B731] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border border-white">
                    👑 1º Puesto • Oro
                  </div>
                  <div className="pt-2">
                    <span className="text-xs text-[#38A3A5] font-black uppercase tracking-wider">
                      {AREAS[top1.attraction.areaId]?.name}
                    </span>
                    <h3 className="text-2xl font-serif font-black text-[#2A1845] mt-0.5">
                      {top1.attraction.name}
                    </h3>
                    <p className="text-base text-[#E64A38] font-script font-bold mt-1">
                      "{top1.attraction.tagline}"
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#F0E2D4] flex items-center justify-between">
                    <div className="text-2xl font-serif font-black text-[#E64A38] flex items-center gap-1">
                      <Star className="w-5 h-5 fill-[#E64A38]" />
                      {top1.score}
                      <span className="text-xs text-[#2A1845]/40 font-normal">/10</span>
                    </div>
                    {top1.comment && (
                      <span className="text-[11px] text-[#2A1845]/70 truncate max-w-[140px] italic font-serif">
                        "{top1.comment}"
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 2nd Place */}
              {top2 && (
                <div className="order-2 md:order-1 p-5 rounded-3xl bg-white border-2 border-[#F0E2D4] shadow-xs relative flex flex-col justify-between">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-[#2A1845] text-[#FFF9F3] text-[10px] font-black uppercase tracking-wider shadow-2xs">
                    🥈 2º Puesto • Plata
                  </div>
                  <div className="pt-2">
                    <span className="text-xs text-[#2A1845]/60 font-bold uppercase tracking-wider">
                      {AREAS[top2.attraction.areaId]?.name}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#2A1845] mt-0.5">
                      {top2.attraction.name}
                    </h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F0E2D4] flex items-center justify-between">
                    <div className="text-xl font-serif font-bold text-[#2A1845] flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#2A1845] text-[#2A1845]" />
                      {top2.score}
                      <span className="text-xs text-[#2A1845]/40 font-normal">/10</span>
                    </div>
                    <span className="text-[11px] text-[#2A1845]/60 font-bold">{top2.attraction.category}</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {top3 && (
                <div className="order-3 p-5 rounded-3xl bg-white border-2 border-[#F0E2D4] shadow-xs relative flex flex-col justify-between">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-[#F7B731] text-[#2A1845] text-[10px] font-black uppercase tracking-wider shadow-2xs">
                    🥉 3º Puesto • Bronce
                  </div>
                  <div className="pt-2">
                    <span className="text-xs text-[#2A1845]/60 font-bold uppercase tracking-wider">
                      {AREAS[top3.attraction.areaId]?.name}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#2A1845] mt-0.5">
                      {top3.attraction.name}
                    </h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F0E2D4] flex items-center justify-between">
                    <div className="text-xl font-serif font-bold text-[#2A1845] flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#F7B731] text-[#F7B731]" />
                      {top3.score}
                      <span className="text-xs text-[#2A1845]/40 font-normal">/10</span>
                    </div>
                    <span className="text-[11px] text-[#2A1845]/60 font-bold">{top3.attraction.category}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Smart Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mb-10 bg-gradient-to-br from-white to-[#FFF0E5] border-2 border-[#E64A38]/50 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E64A38] text-white text-[10px] font-black uppercase tracking-wider">
                    ✨ Algoritmo del Parque
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-[#2A1845] mt-1">
                  Atracciones Recomendadas para tu Próxima Vuelta
                </h2>
                <p className="text-xs text-[#2A1845]/70 font-light mt-0.5">
                  Basado en lo que más has disfrutado hoy y las valoraciones que has registrado.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              {recommendations.map((rec) => {
                const area = AREAS[rec.attraction.areaId];
                return (
                  <div
                    key={rec.attraction.id}
                    className="rounded-3xl bg-white border border-[#F0E2D4] hover:border-[#E64A38] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo & Affinity badge */}
                      <div className="relative h-36 w-full bg-[#2A1845] overflow-hidden">
                        <img
                          src={rec.attraction.photoUrl}
                          alt={rec.attraction.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.src =
                              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E64A38] text-white text-[10px] font-black tracking-wider shadow-xs">
                            {rec.matchPercentage}% Afinidad
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 text-[#2A1845] text-[10px] font-black shadow-xs">
                          ★ {rec.attraction.communityScore}/10
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <div className="text-[10px] font-bold text-[#F7B731] uppercase tracking-wider">
                            {area?.name}
                          </div>
                          <div className="text-base font-serif font-black truncate">
                            {rec.attraction.name}
                          </div>
                        </div>
                      </div>

                      {/* Description & Location */}
                      <div className="p-4 space-y-2.5">
                        <div className="text-xs font-bold text-[#E64A38]">{rec.reasonTitle}</div>
                        <p className="text-[11px] text-[#2A1845]/75 leading-relaxed font-light">
                          {rec.reasonDescription}
                        </p>
                        <div className="flex items-start gap-1.5 p-2 bg-[#FFF9F3] rounded-xl text-[10px] text-[#2A1845]/80">
                          <MapPin className="w-3 h-3 text-[#E64A38] shrink-0 mt-0.5" />
                          <span className="truncate">{rec.attraction.locationDetail}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    {onOpenSurveyForAttraction && (
                      <div className="p-4 pt-0">
                        <button
                          onClick={() => onOpenSurveyForAttraction(rec.attraction.id)}
                          className="w-full py-2.5 px-3 rounded-2xl bg-[#FFF9F3] hover:bg-[#E64A38] text-[#2A1845] hover:text-white border border-[#F0E2D4] hover:border-[#E64A38] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>¡Subirme y Evaluar!</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Complete Ranking List & Area Filter */}
        <div className="bg-white border-2 border-[#F0E2D4] rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2A1845] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#E64A38]" />
                <span>Tu Clasificación Completa de Atracciones</span>
              </h2>
              <p className="text-xs text-[#2A1845]/60 mt-0.5 font-light">
                Comparativa con la media comunitaria de aventureros
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedAreaFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedAreaFilter === 'all'
                    ? 'bg-[#2A1845] text-white shadow-2xs'
                    : 'bg-[#FFF9F3] border border-[#F0E2D4] text-[#2A1845]/70 hover:border-[#E64A38]'
                }`}
              >
                Todas ({ratedList.length})
              </button>
              {Object.keys(areaStats).map((areaId) => (
                <button
                  key={areaId}
                  onClick={() => setSelectedAreaFilter(areaId)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedAreaFilter === areaId
                      ? 'bg-[#2A1845] text-white shadow-2xs'
                      : 'bg-[#FFF9F3] border border-[#F0E2D4] text-[#2A1845]/70 hover:border-[#E64A38]'
                  }`}
                >
                  {AREAS[areaId as keyof typeof AREAS]?.name || areaId}
                </button>
              ))}
            </div>
          </div>

          {/* Attraction items */}
          <div className="space-y-3">
            {filteredList.map((item, index) => {
              return (
                <div
                  key={item.attraction.id}
                  className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] hover:border-[#E64A38] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white border border-[#F0E2D4] text-[#2A1845] font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#2A1845] text-sm">{item.attraction.name}</h4>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white border border-[#F0E2D4] text-[#2A1845]/70 font-bold">
                          {AREAS[item.attraction.areaId]?.name}
                        </span>
                      </div>
                      {item.comment ? (
                        <p className="text-xs text-[#E64A38] italic mt-0.5 flex items-center gap-1 font-serif">
                          <MessageSquare className="w-3 h-3 text-[#E64A38] shrink-0" />
                          "{item.comment}"
                        </p>
                      ) : (
                        <p className="text-xs text-[#2A1845]/60 mt-0.5 font-light">
                          Adrenalina: {item.adrenalineScore || '-'}/5 • Tematización: {item.themingScore || '-'}/5
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0E2D4]">
                    <div className="text-right">
                      <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold">Media Parque</div>
                      <div className="text-xs font-black text-[#2A1845]/70">
                        {item.attraction.communityScore}/10
                      </div>
                    </div>

                    <div className="text-right pl-3 border-l border-[#F0E2D4]">
                      <div className="text-[10px] text-[#E64A38] font-black uppercase">Tu Nota</div>
                      <div className="text-lg font-serif font-black text-[#E64A38] flex items-center gap-1 justify-end">
                        <Star className="w-4 h-4 fill-[#E64A38]" />
                        <span>{item.score}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredList.length === 0 && (
              <div className="text-center py-8 text-[#2A1845]/50 text-xs font-light">
                No hay atracciones valoradas en esta categoría.
              </div>
            )}
          </div>
        </div>

        {/* Skipped attractions summary if any */}
        {skippedList.length > 0 && (
          <div className="bg-white border-2 border-[#F0E2D4] rounded-3xl p-6 mb-8 shadow-xs">
            <h3 className="text-sm font-serif font-bold text-[#2A1845] flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-[#E64A38]" />
              <span>Atracciones no realizadas en esta visita ({skippedList.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {skippedList.map((item) => (
                <div
                  key={item.attraction.id}
                  className="p-3.5 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-[#2A1845] truncate max-w-[160px]">
                    {item.attraction.name}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white border border-[#F0E2D4] text-[#2A1845]/70 font-semibold">
                    {item.skipReason === 'miedo'
                      ? 'Miedo / Vértigo'
                      : item.skipReason === 'mucha_cola'
                      ? 'Mucha cola'
                      : item.skipReason === 'cerrada'
                      ? 'Mantenimiento'
                      : 'Falta de tiempo'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F0E2D4]">
          <button
            id="btn-copy-summary"
            onClick={handleCopySummary}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border-2 border-[#F0E2D4] hover:border-[#E64A38] text-[#2A1845] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#38A3A5]" />
                <span className="text-[#38A3A5]">¡Copiado al portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#2A1845]/60" />
                <span>Copiar Resumen de Valoración</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="btn-view-catalog-end"
              onClick={onViewCatalog}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#FFF9F3] text-xs font-bold text-[#2A1845] transition-colors shadow-2xs"
            >
              Explorar Fichas del Parque
            </button>

            <button
              id="btn-restart-survey"
              onClick={onRestart}
              className="flex-1 sm:flex-initial px-8 py-3.5 bg-gradient-to-r from-[#E64A38] to-[#D63031] hover:from-[#D63031] hover:to-[#B31D1D] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#E64A38]/20 transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/40"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Hacer Otra Encuesta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
