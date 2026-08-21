import React from 'react';
import {
  Sparkles,
  MapPin,
  Compass,
  ArrowRight,
  Star,
  CheckCircle2,
  ChevronRight,
  Flame,
  Droplets,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { Attraction, AttractionRating } from '../types';
import { AREAS } from '../data/attractions';
import { AttractionRecommendation } from '../utils/recommendations';
import { StarSparkles } from './ParkDecorations';
import { AttractionImage } from './AttractionImage';

interface RecommendationModalProps {
  evaluatedAttraction: Attraction;
  rating: AttractionRating;
  recommendations: AttractionRecommendation[];
  onOpenSurveyForAttraction: (attractionId: string) => void;
  onClose: () => void;
  onViewCatalog?: () => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  evaluatedAttraction,
  rating,
  recommendations,
  onOpenSurveyForAttraction,
  onClose,
  onViewCatalog,
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  const topRec = recommendations[0];
  const otherRecs = recommendations.slice(1);
  const topArea = AREAS[topRec.attraction.areaId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1845]/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white border-2 border-[#E64A38]/60 rounded-3xl max-w-2xl w-full shadow-2xl relative text-[#2A1845] overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner with Confetti-like amusement flair */}
        <div className="bg-gradient-to-r from-[#2A1845] via-[#3B2260] to-[#2A1845] text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <StarSparkles className="top-2 right-4 text-[#F7B731]" />
          <StarSparkles className="bottom-2 left-6 text-[#F7B731]" />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E64A38] text-white flex items-center justify-center text-lg shadow-md shrink-0">
                ✨
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#F7B731]">
                    Recomendador Inteligente
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/20 text-white font-bold">
                    {rating.rodeIt ? `Nota: ${rating.score ?? 8}/10` : 'No realizada'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white mt-0.5">
                  Tu Próxima Atracción Recomendada
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E64A38] text-white flex items-center justify-center text-sm font-bold transition-colors shrink-0"
              title="Cerrar"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-white/80 mt-2 font-light max-w-xl">
            Según tu experiencia y lo que te ha parecido <strong>{evaluatedAttraction.name}</strong>, el parque te sugiere esta aventura:
          </p>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Top Recommendation Hero Card */}
          <div className="rounded-3xl border-2 border-[#E64A38] bg-[#FFF9F3] overflow-hidden shadow-md relative group">
            {/* Image Header */}
            <div className="relative h-44 sm:h-52 w-full bg-[#2A1845] overflow-hidden">
              <AttractionImage
                attraction={topRec.attraction}
                className="h-44 sm:h-52 w-full"
                showBadge={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Match Percentage & Tag */}
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10">
                <span className="px-3 py-1 rounded-full bg-[#E64A38] text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{topRec.matchPercentage}% Afinidad</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-[#2A1845]/90 backdrop-blur-xs text-white text-xs font-bold border border-white/20">
                  {topRec.matchTag}
                </span>
              </div>

              {/* Area & Score */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-[#2A1845] text-xs font-serif font-black shadow-xs">
                <Star className="w-3.5 h-3.5 fill-[#F7B731] text-[#F7B731]" />
                <span>{topRec.attraction.communityScore}/10</span>
              </div>

              {/* Title on Photo */}
              <div className="absolute bottom-3 left-4 right-4 text-white z-10">
                <div className="text-xs font-bold text-[#F7B731] uppercase tracking-wider font-serif">
                  {topArea?.name} • {topRec.attraction.category}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-black drop-shadow-md">
                  {topRec.attraction.name}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 sm:p-6 space-y-4 bg-white">
              {/* Why we recommend it box */}
              <div className="p-3.5 rounded-2xl bg-[#FFF0E5] border border-[#E64A38]/30">
                <div className="text-xs font-black text-[#E64A38] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <span>💡</span>
                  <span>{topRec.reasonTitle}</span>
                </div>
                <p className="text-xs text-[#2A1845]/85 leading-relaxed font-light">
                  {topRec.reasonDescription}
                </p>
              </div>

              {/* Exact Location Guide in the park */}
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4]">
                <MapPin className="w-4 h-4 text-[#E64A38] shrink-0 mt-0.5" />
                <div className="text-xs text-[#2A1845]/85">
                  <strong className="text-[#2A1845] font-bold">Ubicación exacta:</strong>{' '}
                  {topRec.attraction.locationDetail}
                </div>
              </div>

              {/* Technical specs */}
              <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                {topRec.attraction.maxSpeedKmh && (
                  <span className="px-3 py-1 rounded-full bg-[#FFF9F3] border border-[#F0E2D4] font-serif font-bold text-[#E64A38]">
                    🚀 {topRec.attraction.maxSpeedKmh} km/h
                  </span>
                )}
                {topRec.attraction.heightM && (
                  <span className="px-3 py-1 rounded-full bg-[#FFF9F3] border border-[#F0E2D4] font-medium text-[#2A1845]/70">
                    📐 {topRec.attraction.heightM}m de caída
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-[#FFF9F3] border border-[#F0E2D4] text-[#2A1845]/70">
                  👥 {topRec.attraction.targetAudience}
                </span>
              </div>

              {/* Primary CTA: Open Survey of this attraction */}
              <button
                id={`btn-open-rec-survey-${topRec.attraction.id}`}
                onClick={() => onOpenSurveyForAttraction(topRec.attraction.id)}
                className="w-full py-4 bg-gradient-to-r from-[#E64A38] to-[#D63031] hover:from-[#D63031] hover:to-[#B31D1D] text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#E64A38]/25 transition-all flex items-center justify-center gap-2 active:scale-98 border-2 border-white/60"
              >
                <span>¡Montarme y Abrir Encuesta de {topRec.attraction.name}!</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Secondary Alternative Recommendations */}
          {otherRecs.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#2A1845]/70 mb-3 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#E64A38]" />
                <span>Otras Buenas Opciones Cercanas</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {otherRecs.map((rec) => {
                  const area = AREAS[rec.attraction.areaId];
                  return (
                    <div
                      key={rec.attraction.id}
                      className="p-3.5 rounded-2xl bg-white border border-[#F0E2D4] hover:border-[#E64A38] transition-all flex flex-col justify-between shadow-2xs group"
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <img
                          src={rec.attraction.photoUrl}
                          alt={rec.attraction.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#F0E2D4]"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.src =
                              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-[#E64A38]/10 text-[#E64A38]">
                              {rec.matchPercentage}%
                            </span>
                            <span className="text-[10px] text-[#2A1845]/50 truncate">
                              {area?.name}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-[#2A1845] truncate font-serif mt-0.5">
                            {rec.attraction.name}
                          </h5>
                          <p className="text-[10px] text-[#2A1845]/60 truncate font-light">
                            {rec.reasonTitle}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenSurveyForAttraction(rec.attraction.id)}
                        className="w-full py-2 bg-[#FFF9F3] hover:bg-[#E64A38] text-[#2A1845] hover:text-white border border-[#F0E2D4] hover:border-[#E64A38] rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Abrir Encuesta</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FFF9F3] border-t border-[#F0E2D4] flex items-center justify-between gap-3 shrink-0">
          {onViewCatalog && (
            <button
              onClick={() => {
                onClose();
                onViewCatalog();
              }}
              className="text-xs font-bold text-[#2A1845]/70 hover:text-[#E64A38] transition-colors"
            >
              Explorar el Mapa Completo
            </button>
          )}

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all ml-auto shadow-2xs"
          >
            Seguir con mi Visita
          </button>
        </div>
      </div>
    </div>
  );
};
