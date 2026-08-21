import React from 'react';
import { UserPreferences, Attraction } from '../types';
import { getRecommendedAttractions } from '../utils/recommendationEngine';
import { AttractionImage } from './AttractionImage';
import { AREAS } from '../data/attractions';
import { AVATAR_OPTIONS, PERSONALITY_ROLES, PARK_FOOD_OPTIONS } from './PreferenceSurveyModal';
import { Sparkles, Zap, Flame, Compass, RefreshCw, ArrowRight, Star, Clock, User, Shield, Utensils, Ruler } from 'lucide-react';

interface RecommendedAttractionsSectionProps {
  userPreferences: UserPreferences;
  onOpenSurveyModal: () => void;
  onOpenPassport?: () => void;
  onSelectAttraction: (attractionId: string) => void;
  onViewWaitTimes?: () => void;
}

export const RecommendedAttractionsSection: React.FC<RecommendedAttractionsSectionProps> = ({
  userPreferences,
  onOpenSurveyModal,
  onOpenPassport,
  onSelectAttraction,
  onViewWaitTimes,
}) => {
  const recommendations = getRecommendedAttractions(userPreferences, 6);

  const avatarObj = AVATAR_OPTIONS.find((a) => a.id === userPreferences.avatar) || AVATAR_OPTIONS[0];
  const roleObj = PERSONALITY_ROLES.find((r) => r.id === userPreferences.personalityRole);
  const foodObj = PARK_FOOD_OPTIONS.find((f) => f.id === userPreferences.favoriteParkFood);

  return (
    <div className="my-8 bg-gradient-to-br from-[#2A1845] via-[#351C57] to-[#201035] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-2 border-[#F7B731]/40 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#E64A38]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#F7B731]/20 blur-3xl pointer-events-none" />

      {/* Header Profile Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/15 relative z-10">
        <div className="flex items-center gap-3.5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/80 shrink-0"
            style={{ backgroundColor: userPreferences.customAvatarBg || '#E64A38' }}
          >
            {avatarObj.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F7B731] text-[#2A1845] shadow-xs">
                Pasaporte Aventurero de {userPreferences.visitorName}
              </span>
              {userPreferences.heightCm && (
                <span className="text-xs text-[#F7B731] font-bold">
                  • {userPreferences.heightCm} cm
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-black text-white tracking-tight mt-0.5">
              {userPreferences.customTitle || userPreferences.archetypeName}
            </h2>

            {userPreferences.adventureMotto && (
              <p className="text-xs text-[#F7B731] italic font-serif mt-0.5">
                «{userPreferences.adventureMotto}»
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {roleObj && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-white">
                  {roleObj.emoji} {roleObj.name}
                </span>
              )}
              {foodObj && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-200">
                  {foodObj.emoji} {foodObj.name ? foodObj.name.split('&')[0].trim() : 'Snack'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenPassport && (
            <button
              type="button"
              onClick={onOpenPassport}
              className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#F7B731] to-[#FFA801] hover:from-[#FFA801] hover:to-[#F7B731] text-[#2A1845] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <span>⭐ Ver Mi Pasaporte</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSurveyModal}
            className="px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-2 border border-white/20"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#F7B731]" />
            <span>Editar Perfil</span>
          </button>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-white/90 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F7B731]" /> Top Coincidencias para tu Perfil
          </h3>
          <span className="text-xs text-white/60">
            Calculado con tu altura ({userPreferences.heightCm || 170}cm), rol y gustos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(({ attraction, matchScore, matchReasons }) => {
            const area = AREAS[attraction.areaId];
            return (
              <div
                key={attraction.id}
                className="group relative bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-white/40 flex flex-col justify-between"
              >
                {/* Top Image Preview */}
                <div className="relative">
                  <AttractionImage
                    attraction={attraction}
                    className="h-44 w-full"
                    showBadge={true}
                  />

                  {/* Match Percentage Pill */}
                  <div className="absolute top-3 right-3 bg-[#2A1845]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#F7B731]/80 shadow-lg flex items-center gap-1.5 z-10">
                    <Zap className="w-3.5 h-3.5 text-[#F7B731]" />
                    <span className="text-xs font-black text-white">{matchScore}% Match</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif font-black text-base text-white group-hover:text-[#F7B731] transition-colors leading-snug">
                        {attraction.name}
                      </h4>
                    </div>

                    <p className="text-xs text-white/80 line-clamp-2 mt-1 leading-relaxed font-light">
                      {attraction.tagline}
                    </p>

                    {/* Match Reasons Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {matchReasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-black/40 text-white/90 text-[10px] font-medium border border-white/10"
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectAttraction(attraction.id)}
                      className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-[#E64A38] to-[#d93826] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98"
                    >
                      <span>Abrir Encuesta</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
