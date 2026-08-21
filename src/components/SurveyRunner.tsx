import React, { useState, useEffect } from 'react';
import {
  Star,
  Flame,
  Droplets,
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Info,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Compass,
  Smile,
  AlertTriangle,
  RotateCcw,
  Check,
  ListFilter,
  MapPin,
} from 'lucide-react';
import { Attraction, AttractionRating, AreaId, QueueExperience, RepeatWillingness, SkipReason } from '../types';
import { AREAS } from '../data/attractions';
import { playStarSound, playNextSound, playCompleteSound } from '../utils/audio';
import { CarnivalBunting, FlyerCapsule, TicketStamp } from './ParkDecorations';
import { getSmartRecommendations } from '../utils/recommendations';
import { RecommendationModal } from './RecommendationModal';
import { AttractionImage } from './AttractionImage';

interface SurveyRunnerProps {
  attractions: Attraction[];
  ratings: Record<string, AttractionRating>;
  onUpdateRating: (attractionId: string, rating: AttractionRating) => void;
  onFinish: () => void;
  onCancel: () => void;
  onOpenSurveyForAttraction?: (attractionId: string) => void;
}

const SCORE_LABELS: Record<number, { text: string; color: string; desc: string }> = {
  1: { text: '1 - Muy insatisfactoria', color: 'text-[#E64A38]', desc: 'No me gustó nada' },
  2: { text: '2 - Mala', color: 'text-[#E64A38]', desc: 'Mala experiencia' },
  3: { text: '3 - Decepcionante', color: 'text-[#E64A38]', desc: 'Por debajo de lo esperado' },
  4: { text: '4 - Floja', color: 'text-[#2A1845]/80', desc: 'Le falta emoción o mantenimiento' },
  5: { text: '5 - Pasable', color: 'text-[#2A1845]/80', desc: 'Cumple sin destacar' },
  6: { text: '6 - Correcta', color: 'text-[#38A3A5]', desc: 'Divertida y entretenida' },
  7: { text: '7 - Buena', color: 'text-[#38A3A5]', desc: 'Una buena atracción del parque' },
  8: { text: '8 - Muy Buena', color: 'text-[#81B29A]', desc: '¡Gran emoción y disfrute!' },
  9: { text: '9 - Espectacular', color: 'text-[#81B29A]', desc: 'De las mejores de PortAventura' },
  10: { text: '10 - ¡Obra Maestra!', color: 'text-[#E64A38]', desc: '¡Inolvidable y legendaria!' },
};

const QUEUE_OPTIONS: { id: QueueExperience; label: string; sub: string }[] = [
  { id: 'express', label: 'Pase Express', sub: 'Sin apenas espera' },
  { id: 'corta', label: '< 15 min', sub: 'Cola muy rápida' },
  { id: 'moderada', label: '15 - 35 min', sub: 'Tiempo razonable' },
  { id: 'larga', label: '35 - 60 min', sub: 'Cola considerable' },
  { id: 'extrema', label: '> 60 min', sub: 'Mucha cola' },
];

const REPEAT_OPTIONS: { id: RepeatWillingness; label: string; icon: string }[] = [
  { id: 'siempre', label: '¡De cabeza hoy mismo!', icon: '🔥' },
  { id: 'si', label: 'Sí, volvería a subir', icon: '👍' },
  { id: 'quizas', label: 'Quizás en otra ocasión', icon: '⏳' },
  { id: 'no', label: 'No, una vez fue suficiente', icon: '🛑' },
];

const SKIP_REASONS: { id: SkipReason; label: string; desc: string }[] = [
  { id: 'miedo', label: 'Me dio respeto / miedo', desc: 'Demasiada altura o velocidad' },
  { id: 'mucha_cola', label: 'Había demasiada cola', desc: 'Más tiempo del que quería esperar' },
  { id: 'cerrada', label: 'Estaba fuera de servicio', desc: 'Cerrada por mantenimiento o tiempo' },
  { id: 'falta_tiempo', label: 'No me dio tiempo', desc: 'Prioricé otras áreas' },
  { id: 'no_cumplo_altura', label: 'No cumplía la altura', desc: 'Restricción de estatura' },
  { id: 'no_mi_estilo', label: 'No es mi estilo', desc: 'Prefiero otro tipo de atracciones' },
];

export const SurveyRunner: React.FC<SurveyRunnerProps> = ({
  attractions,
  ratings,
  onUpdateRating,
  onFinish,
  onCancel,
  onOpenSurveyForAttraction,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFunFact, setShowFunFact] = useState(false);
  const [showQuickJump, setShowQuickJump] = useState(false);
  const [showRecModal, setShowRecModal] = useState(false);

  const currentAttraction = attractions[currentIndex] || attractions[0];
  const area = AREAS[currentAttraction?.areaId as AreaId] || AREAS.china;
  const currentRating = ratings[currentAttraction.id] || {
    attractionId: currentAttraction.id,
    rodeIt: true,
    score: 8,
    adrenalineScore: 4,
    themingScore: 4,
    repeatWillingness: 'si',
    queueExperience: 'moderada',
    comment: '',
  };

  // Local editing state
  const [rodeIt, setRodeIt] = useState<boolean>(currentRating.rodeIt);
  const [score, setScore] = useState<number>(currentRating.score ?? 8);
  const [adrenalineScore, setAdrenalineScore] = useState<number>(currentRating.adrenalineScore ?? 4);
  const [themingScore, setThemingScore] = useState<number>(currentRating.themingScore ?? 4);
  const [queueExperience, setQueueExperience] = useState<QueueExperience>(
    currentRating.queueExperience ?? 'moderada'
  );
  const [repeatWillingness, setRepeatWillingness] = useState<RepeatWillingness>(
    currentRating.repeatWillingness ?? 'si'
  );
  const [comment, setComment] = useState<string>(currentRating.comment ?? '');
  const [skipReason, setSkipReason] = useState<SkipReason | undefined>(currentRating.skipReason);

  // Live computed rating object for recommendation
  const liveRating: AttractionRating = {
    attractionId: currentAttraction.id,
    rodeIt,
    score: rodeIt ? score : undefined,
    adrenalineScore: rodeIt ? adrenalineScore : undefined,
    themingScore: rodeIt ? themingScore : undefined,
    queueExperience: rodeIt ? queueExperience : undefined,
    repeatWillingness: rodeIt ? repeatWillingness : undefined,
    comment: comment.trim() || undefined,
    skipReason: !rodeIt ? skipReason : undefined,
  };

  const recommendations = getSmartRecommendations(currentAttraction, liveRating);
  const topRec = recommendations[0];

  // Sync state when currentIndex changes
  useEffect(() => {
    const existing = ratings[currentAttraction.id];
    if (existing) {
      setRodeIt(existing.rodeIt);
      setScore(existing.score ?? 8);
      setAdrenalineScore(existing.adrenalineScore ?? 4);
      setThemingScore(existing.themingScore ?? 4);
      setQueueExperience(existing.queueExperience ?? 'moderada');
      setRepeatWillingness(existing.repeatWillingness ?? 'si');
      setComment(existing.comment ?? '');
      setSkipReason(existing.skipReason);
    } else {
      setRodeIt(true);
      setScore(8);
      setAdrenalineScore(4);
      setThemingScore(4);
      setQueueExperience('moderada');
      setRepeatWillingness('si');
      setComment('');
      setSkipReason(undefined);
    }
    setShowFunFact(false);
  }, [currentIndex, currentAttraction.id]);

  const saveCurrent = (nextRodeIt = rodeIt, nextSkipReason = skipReason) => {
    const updated: AttractionRating = {
      attractionId: currentAttraction.id,
      rodeIt: nextRodeIt,
      score: nextRodeIt ? score : undefined,
      adrenalineScore: nextRodeIt ? adrenalineScore : undefined,
      themingScore: nextRodeIt ? themingScore : undefined,
      queueExperience: nextRodeIt ? queueExperience : undefined,
      repeatWillingness: nextRodeIt ? repeatWillingness : undefined,
      comment: comment.trim() || undefined,
      skipReason: !nextRodeIt ? nextSkipReason : undefined,
      ratedAt: new Date().toISOString(),
    };
    onUpdateRating(currentAttraction.id, updated);
  };

  const handleNext = () => {
    saveCurrent();
    if (currentIndex < attractions.length - 1) {
      playNextSound();
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      playCompleteSound();
      onFinish();
    }
  };

  const handlePrev = () => {
    saveCurrent();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkipAttraction = (reason: SkipReason) => {
    setRodeIt(false);
    setSkipReason(reason);
    const updated: AttractionRating = {
      attractionId: currentAttraction.id,
      rodeIt: false,
      skipReason: reason,
      ratedAt: new Date().toISOString(),
    };
    onUpdateRating(currentAttraction.id, updated);
    playNextSound();
    if (currentIndex < attractions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onFinish();
    }
  };

  const handleScoreClick = (newScore: number) => {
    setScore(newScore);
    playStarSound(newScore);
  };

  const totalAnswered = attractions.filter((a) => ratings[a.id]).length;
  const isLast = currentIndex === attractions.length - 1;

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#2A1845] pb-32">
      {/* Top progress bar with Amusement Carnival Accent */}
      <div className="bg-[#FFF9F3]/95 backdrop-blur-md border-b border-[#F0E2D4] sticky top-18 z-30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-[#E64A38] uppercase tracking-wider">
              Pregunta {currentIndex + 1} de {attractions.length}
            </span>
            <span className="text-xs text-[#2A1845]/60 hidden sm:inline">
              ({totalAnswered} valoradas)
            </span>
          </div>

          <div className="flex-1 max-w-xs bg-[#FCE8DD] rounded-full h-2.5 overflow-hidden border border-[#E64A38]/20">
            <div
              className="h-full bg-gradient-to-r from-[#E64A38] to-[#F7B731] rounded-full transition-all duration-300"
              style={{ width: `${Math.round(((currentIndex + 1) / attractions.length) * 100)}%` }}
            />
          </div>

          <button
            id="btn-toggle-quick-jump"
            onClick={() => setShowQuickJump(!showQuickJump)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#E64A38]/30 hover:border-[#E64A38] rounded-full text-xs font-bold text-[#2A1845] transition-colors shadow-2xs"
          >
            <ListFilter className="w-3.5 h-3.5 text-[#E64A38]" />
            <span className="hidden sm:inline">Ver todas</span>
          </button>
        </div>

        {/* Quick jump carousel if opened */}
        {showQuickJump && (
          <div className="max-w-4xl mx-auto mt-3 pt-3 border-t border-[#F0E2D4] flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {attractions.map((att, idx) => {
              const rated = ratings[att.id];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={att.id}
                  onClick={() => {
                    saveCurrent();
                    setCurrentIndex(idx);
                    setShowQuickJump(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isCurrent
                      ? 'bg-[#2A1845] text-white shadow-xs'
                      : rated
                      ? rated.rodeIt
                        ? 'bg-[#81B29A]/20 text-[#2A1845] border border-[#81B29A]'
                        : 'bg-white text-[#2A1845]/50 border border-[#F0E2D4]'
                      : 'bg-white text-[#2A1845]/70 border border-[#F0E2D4] hover:border-[#E64A38]'
                  }`}
                >
                  <span>{idx + 1}.</span>
                  <span className="truncate max-w-[110px]">{att.name}</span>
                  {rated && (
                    <CheckCircle2
                      className={`w-3 h-3 ${rated.rodeIt ? 'text-[#81B29A]' : 'text-[#2A1845]/40'}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        {/* Attraction Hero Poster Card with Photo & Location */}
        <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-[#E64A38]/40 shadow-md mb-6 ring-1 ring-[#E64A38]/15">
          {/* Photo Header */}
          <div className="relative h-48 sm:h-56 w-full bg-[#2A1845] overflow-hidden">
            <AttractionImage
              attraction={currentAttraction}
              className="h-48 sm:h-56 w-full"
              showBadge={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Badges on photo */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span className="px-3.5 py-1 rounded-full bg-[#2A1845]/90 backdrop-blur-xs text-[#FFF9F3] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs border border-white/20">
                <Compass className="w-3.5 h-3.5 text-[#F7B731]" />
                {area.name}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#E64A38] text-white text-xs font-bold shadow-xs">
                {currentAttraction.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#2A1845] text-xs font-bold shadow-xs">
                {currentAttraction.targetAudience}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white z-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight drop-shadow-md">
                {currentAttraction.name}
              </h1>
              <p className="text-sm sm:text-base text-[#F7B731] font-script font-bold drop-shadow-sm mt-0.5">
                "{currentAttraction.tagline}"
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            {/* Location in the park */}
            <div className="flex items-start gap-2 p-3 bg-[#FFF9F3] border border-[#F0E2D4] rounded-2xl mb-4">
              <MapPin className="w-4 h-4 text-[#E64A38] shrink-0 mt-0.5" />
              <div className="text-xs text-[#2A1845]/85">
                <strong className="text-[#E64A38] font-bold">Ubicación en el parque:</strong>{' '}
                {currentAttraction.locationDetail}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#2A1845]/75 leading-relaxed font-light">
              {currentAttraction.description}
            </p>

            {/* Key Specs Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {currentAttraction.maxSpeedKmh && (
                <div className="p-3 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] text-center">
                  <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold tracking-wider">Velocidad</div>
                  <div className="text-base font-bold text-[#E64A38] font-serif">{currentAttraction.maxSpeedKmh} km/h</div>
                </div>
              )}
              {currentAttraction.heightM && (
                <div className="p-3 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] text-center">
                  <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold tracking-wider">Altura</div>
                  <div className="text-base font-bold text-[#2A1845] font-serif">{currentAttraction.heightM} m</div>
                </div>
              )}
              {currentAttraction.inversions !== undefined && (
                <div className="p-3 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] text-center">
                  <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold tracking-wider">Inversiones</div>
                  <div className="text-base font-bold text-[#2A1845] font-serif">{currentAttraction.inversions} loops</div>
                </div>
              )}
              <div className="p-3 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] text-center">
                <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold tracking-wider">Estreno</div>
                <div className="text-base font-bold text-[#2A1845] font-serif">{currentAttraction.openingYear}</div>
              </div>
            </div>

            {/* Fun fact toggle */}
            <div className="mt-5 pt-3.5 border-t border-[#F0E2D4]">
              <button
                onClick={() => setShowFunFact(!showFunFact)}
                className="flex items-center gap-1.5 text-xs text-[#E64A38] hover:underline font-bold uppercase tracking-wider transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F7B731]" />
                <span>{showFunFact ? 'Ocultar curiosidad' : '¿Sabías que...?'}</span>
                {showFunFact ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {showFunFact && (
                <p className="mt-2.5 text-xs text-[#2A1845] bg-[#FFF0E5] border border-[#E64A38]/30 p-4 rounded-2xl leading-relaxed">
                  💡 {currentAttraction.funFact}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Question: Did you ride this attraction? */}
        <div className="bg-white border-2 border-[#F0E2D4] rounded-3xl p-6 sm:p-8 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E2D4]">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#2A1845]">
                ¿Te montaste en {currentAttraction.name}?
              </h2>
              <p className="text-xs text-[#2A1845]/60 mt-1 font-light">
                Cuéntanos tu veredicto en este día de parque
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-rode-yes"
                onClick={() => {
                  setRodeIt(true);
                  setSkipReason(undefined);
                }}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  rodeIt
                    ? 'bg-[#E64A38] text-white shadow-md scale-105 border border-white/50'
                    : 'bg-[#FFF9F3] border border-[#F0E2D4] text-[#2A1845]/70 hover:bg-white'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>¡Sí, me monté!</span>
              </button>

              <button
                id="btn-rode-no"
                onClick={() => {
                  setRodeIt(false);
                }}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  !rodeIt
                    ? 'bg-[#2A1845] text-white shadow-md scale-105'
                    : 'bg-[#FFF9F3] border border-[#F0E2D4] text-[#2A1845]/70 hover:bg-white'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>No me subí</span>
              </button>
            </div>
          </div>

          {/* If YES: Full Evaluation Form */}
          {rodeIt ? (
            <div className="space-y-8 mt-6">
              {/* Question 1: Global Score (1-10) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#2A1845]/80 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#E64A38] fill-[#E64A38]" />
                    <span>Puntuación Global (1 al 10)</span>
                  </label>
                  <span className={`text-xs font-bold uppercase tracking-wider ${SCORE_LABELS[score]?.color}`}>
                    {SCORE_LABELS[score]?.text}
                  </span>
                </div>
                <p className="text-xs text-[#2A1845]/60 mb-3.5 font-light">
                  {SCORE_LABELS[score]?.desc}
                </p>

                {/* Score Selector Buttons (1 to 10) with amusement colors */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isSelected = score === num;
                    return (
                      <button
                        key={num}
                        id={`btn-score-${num}`}
                        onClick={() => handleScoreClick(num)}
                        className={`h-11 sm:h-12 rounded-2xl font-black text-sm flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#E64A38] text-white shadow-md scale-105 border-2 border-white'
                            : 'bg-[#FFF9F3] border border-[#F0E2D4] text-[#2A1845] hover:bg-[#E64A38] hover:text-white hover:border-[#E64A38]'
                        }`}
                      >
                        <span>{num}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Adrenalina & Vértigo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#2A1845]/80 mb-1 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#E64A38]" />
                  <span>Sensación de Adrenalina y Vértigo</span>
                </label>
                <p className="text-xs text-[#2A1845]/60 mb-3.5 font-light">
                  ¿Qué tan intenso sentiste el recorrido?
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { val: 1, label: 'Suave / Relax', icon: '🍃' },
                    { val: 2, label: 'Divertida', icon: '😄' },
                    { val: 3, label: 'Moderada', icon: '⚡' },
                    { val: 4, label: 'Muy Intensa', icon: '🔥' },
                    { val: 5, label: '¡Extrema!', icon: '🚀' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => setAdrenalineScore(item.val)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                        adrenalineScore === item.val
                          ? 'bg-[#FCE8DD] border-2 border-[#E64A38] text-[#E64A38] shadow-xs'
                          : 'bg-[#FFF9F3] border-[#F0E2D4] text-[#2A1845]/70 hover:border-[#E64A38]'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Tematización & Decorados */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#2A1845]/80 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F7B731]" />
                  <span>Ambientación, Música e Inmersión</span>
                </label>
                <p className="text-xs text-[#2A1845]/60 mb-3.5 font-light">
                  ¿Qué te pareció el decorado, colas y tematización?
                </p>

                <div className="flex items-center gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setThemingScore(star)}
                      className={`flex-1 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        themingScore >= star
                          ? 'bg-[#FCE8DD] border-2 border-[#E64A38] text-[#E64A38]'
                          : 'bg-[#FFF9F3] border-[#F0E2D4] text-[#2A1845]/40 hover:border-[#E64A38]'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          themingScore >= star ? 'text-[#E64A38] fill-[#E64A38]' : 'text-[#2A1845]/30'
                        }`}
                      />
                      <span>{star}/5</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Queue / Espera */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#2A1845]/80 mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#38A3A5]" />
                  <span>Tiempo de Espera en la Cola</span>
                </label>
                <p className="text-xs text-[#2A1845]/60 mb-3.5 font-light">
                  ¿Cuánto tiempo tuviste que esperar aproximadamente?
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {QUEUE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setQueueExperience(opt.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        queueExperience === opt.id
                          ? 'bg-[#FFF0E5] border-2 border-[#E64A38] text-[#2A1845] font-bold shadow-xs'
                          : 'bg-[#FFF9F3] border-[#F0E2D4] text-[#2A1845]/70 hover:border-[#38A3A5]'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#2A1845]">{opt.label}</span>
                      <span className="text-[10px] text-[#2A1845]/50 mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 5: Repeatability */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#2A1845]/80 mb-1 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#E64A38]" />
                  <span>¿Te volverías a montar de nuevo?</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {REPEAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setRepeatWillingness(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        repeatWillingness === opt.id
                          ? 'bg-[#FCE8DD] border-2 border-[#E64A38] text-[#2A1845] font-bold shadow-xs'
                          : 'bg-[#FFF9F3] border-[#F0E2D4] text-[#2A1845]/70 hover:border-[#E64A38]'
                      }`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-xs font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 6: Comments / Anécdota */}
              <div>
                <label
                  htmlFor="input-attraction-comment"
                  className="block text-xs font-bold uppercase tracking-widest text-[#2A1845]/80 mb-1.5 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#E64A38]" />
                  <span>Tu opinión o anécdota personal (Opcional)</span>
                </label>
                <textarea
                  id="input-attraction-comment"
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ej. '¡Recomiendo montar en la última fila para notar más el airtime!' o 'Los giros en la cueva son geniales'..."
                  className="w-full p-3.5 bg-[#FFF9F3] border border-[#F0E2D4] rounded-2xl text-xs text-[#2A1845] placeholder-[#2A1845]/40 focus:outline-none focus:border-[#E64A38] focus:ring-1 focus:ring-[#E64A38] transition-all"
                />
              </div>
            </div>
          ) : (
            /* IF NO: Reason for skipping */
            <div className="mt-6">
              <h3 className="text-sm font-serif font-bold text-[#2A1845] mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#E64A38]" />
                <span>¿Por qué motivo no te subiste?</span>
              </h3>
              <p className="text-xs text-[#2A1845]/60 mb-4 font-light">
                Nos ayuda a entender la experiencia y afluencia del parque
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SKIP_REASONS.map((reason) => (
                  <button
                    key={reason.id}
                    id={`btn-skip-reason-${reason.id}`}
                    onClick={() => handleSkipAttraction(reason.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      skipReason === reason.id
                        ? 'bg-[#FCE8DD] border-2 border-[#E64A38] text-[#2A1845]'
                        : 'bg-[#FFF9F3] border-[#F0E2D4] text-[#2A1845]/75 hover:border-[#E64A38] hover:bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#2A1845]">{reason.label}</div>
                    <div className="text-[11px] text-[#2A1845]/60 mt-0.5 font-light">{reason.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Recommendation Card (According to User's Experience in This Attraction) */}
        {topRec && (
          <div className="bg-gradient-to-br from-white to-[#FFF0E5] border-2 border-[#E64A38]/50 rounded-3xl p-5 sm:p-6 mb-8 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E64A38] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span>{topRec.matchPercentage}% Afinidad</span>
                </span>
                <span className="text-xs font-bold text-[#E64A38]">
                  {topRec.matchTag}
                </span>
              </div>
              <button
                onClick={() => setShowRecModal(true)}
                className="text-xs font-bold text-[#2A1845]/70 hover:text-[#E64A38] underline transition-colors"
              >
                Ver alternativas
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-[#F0E2D4]">
              <img
                src={topRec.attraction.photoUrl}
                alt={topRec.attraction.name}
                referrerPolicy="no-referrer"
                className="w-full sm:w-24 h-28 sm:h-24 rounded-xl object-cover shrink-0 border border-[#F0E2D4]"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src =
                    'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=300&q=80';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-[#38A3A5] uppercase tracking-wider">
                  {AREAS[topRec.attraction.areaId]?.name} • {topRec.attraction.category}
                </div>
                <h4 className="text-base sm:text-lg font-serif font-black text-[#2A1845]">
                  {topRec.attraction.name}
                </h4>
                <p className="text-xs text-[#2A1845]/75 font-light line-clamp-2 mt-0.5">
                  {topRec.reasonDescription}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#2A1845]/80 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#E64A38] shrink-0" />
                  <span className="truncate">{topRec.attraction.locationDetail}</span>
                </div>
              </div>

              <div className="w-full sm:w-auto shrink-0 flex flex-col gap-2">
                <button
                  id="btn-open-live-rec-modal"
                  onClick={() => setShowRecModal(true)}
                  className="w-full px-4 py-2.5 bg-[#2A1845] hover:bg-[#E64A38] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ver Recomendación</span>
                </button>
                {onOpenSurveyForAttraction && (
                  <button
                    onClick={() => {
                      saveCurrent();
                      onOpenSurveyForAttraction(topRec.attraction.id);
                    }}
                    className="w-full px-4 py-2 bg-[#FFF9F3] hover:bg-[#FFF0E5] text-[#E64A38] border border-[#E64A38]/30 rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Evaluar ahora esta</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recommendation Modal */}
        {showRecModal && (
          <RecommendationModal
            evaluatedAttraction={currentAttraction}
            rating={liveRating}
            recommendations={recommendations}
            onOpenSurveyForAttraction={(attId) => {
              saveCurrent();
              setShowRecModal(false);
              if (onOpenSurveyForAttraction) {
                onOpenSurveyForAttraction(attId);
              }
            }}
            onClose={() => setShowRecModal(false)}
          />
        )}

        {/* Bottom Actions Sticky Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#FFF9F3]/95 backdrop-blur-md border-t border-[#F0E2D4] px-3 py-2.5 sm:p-4 z-50 shadow-[0_-4px_20px_rgba(42,24,69,0.06)]">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <button
              id="btn-survey-prev"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-3 sm:px-5 py-2.5 sm:py-3 rounded-full border border-[#F0E2D4] bg-white text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2A1845] hover:bg-[#FFF9F3] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 sm:gap-1.5 shadow-2xs shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Anterior</span>
            </button>

            <button
              id="btn-survey-cancel"
              onClick={onCancel}
              className="px-2 sm:px-4 py-2 text-[11px] sm:text-xs font-bold text-[#2A1845]/60 hover:text-[#E64A38] transition-colors truncate"
            >
              Guardar
            </button>

            <button
              id="btn-survey-next"
              onClick={handleNext}
              className="px-4 sm:px-10 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#E64A38] to-[#D63031] hover:from-[#D63031] hover:to-[#B31D1D] text-white rounded-full font-bold text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest shadow-lg shadow-[#E64A38]/20 transition-all flex items-center gap-1.5 sm:gap-2 active:scale-95 border border-white/40 shrink-0"
            >
              <span>{isLast ? 'Ver Resultados' : 'Siguiente'}</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
