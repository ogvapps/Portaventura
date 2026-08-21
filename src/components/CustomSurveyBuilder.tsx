import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Droplets,
  Flame,
  Check,
  Compass,
} from 'lucide-react';
import { ATTRACTIONS, AREAS } from '../data/attractions';
import { AreaId, Attraction } from '../types';
import { CarnivalBunting, StarSparkles, TicketStamp } from './ParkDecorations';

interface CustomSurveyBuilderProps {
  visitorName: string;
  visitDate: string;
  onLaunchCustom: (selectedIds: string[]) => void;
  onBack: () => void;
}

export const CustomSurveyBuilder: React.FC<CustomSurveyBuilderProps> = ({
  visitorName,
  visitDate,
  onLaunchCustom,
  onBack,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'shambhala',
    'dragon-khan',
    'furius-baco',
    'tutuki-splash',
    'uncharted',
    'hurakan-condor',
  ]);

  const toggleAttraction = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(ATTRACTIONS.map((a) => a.id));
  };

  const selectNone = () => {
    setSelectedIds([]);
  };

  const selectByCategory = (category: string) => {
    const ids = ATTRACTIONS.filter((a) => a.category === category).map((a) => a.id);
    setSelectedIds(Array.from(new Set([...selectedIds, ...ids])));
  };

  const groupedByArea = Object.keys(AREAS).reduce<Record<AreaId, Attraction[]>>(
    (acc, areaKey) => {
      acc[areaKey as AreaId] = ATTRACTIONS.filter((a) => a.areaId === areaKey);
      return acc;
    },
    {} as Record<AreaId, Attraction[]>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#2A1845] pb-32">
      <CarnivalBunting />

      {/* Header */}
      <div className="bg-white border-b-2 border-[#F0E2D4] py-8 relative overflow-hidden">
        <StarSparkles className="top-4 right-8" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2A1845]/60 hover:text-[#E64A38] mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la selección de encuestas</span>
          </button>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#2A1845]">
            Personaliza tu Encuesta de Atracciones
          </h1>
          <p className="text-xs sm:text-sm text-[#2A1845]/70 mt-1 font-light">
            Marca exactamente las atracciones en las que te subiste durante tu visita para valorarlas una a una en tu pasaporte.
          </p>

          {/* Quick preset filters */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#F0E2D4]">
            <span className="text-xs text-[#2A1845]/70 font-bold uppercase tracking-wider">Selección rápida:</span>
            <button
              onClick={selectAll}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#F0E2D4] hover:border-[#E64A38] text-xs font-bold text-[#2A1845] transition-colors shadow-2xs"
            >
              Marcar Todas ({ATTRACTIONS.length})
            </button>
            <button
              onClick={() => selectByCategory('Montaña Rusa')}
              className="px-3.5 py-1.5 rounded-full bg-[#E64A38]/10 hover:bg-[#E64A38]/20 text-xs font-bold text-[#E64A38] border border-[#E64A38]/30 transition-colors"
            >
              🎢 Montañas Rusas
            </button>
            <button
              onClick={() => selectByCategory('Acuática')}
              className="px-3.5 py-1.5 rounded-full bg-[#38A3A5]/10 hover:bg-[#38A3A5]/20 text-xs font-bold text-[#38A3A5] border border-[#38A3A5]/30 transition-colors"
            >
              🌊 Acuáticas
            </button>
            <button
              onClick={selectNone}
              className="px-3.5 py-1.5 rounded-full bg-[#FFF9F3] border border-[#F0E2D4] hover:bg-white text-xs font-medium text-[#2A1845]/60 transition-colors"
            >
              Desmarcar
            </button>
          </div>
        </div>
      </div>

      {/* Main Attraction Selector by Areas */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {(Object.keys(AREAS) as AreaId[]).map((areaId) => {
          const area = AREAS[areaId];
          const areaAttractions = groupedByArea[areaId] || [];
          if (areaAttractions.length === 0) return null;

          const areaSelectedCount = areaAttractions.filter((a) =>
            selectedIds.includes(a.id)
          ).length;

          return (
            <div
              key={areaId}
              className="bg-white border-2 border-[#F0E2D4] rounded-3xl p-6 sm:p-7 shadow-xs"
            >
              <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[#F0E2D4]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-xs"
                    style={{ backgroundColor: area.color }}
                  />
                  <h2 className="text-lg font-serif font-black text-[#2A1845]">{area.name}</h2>
                  <span className="text-xs text-[#2A1845]/50 font-light">({area.theme})</span>
                </div>
                <span className="text-xs text-[#E64A38] font-black uppercase tracking-wider">
                  {areaSelectedCount}/{areaAttractions.length} seleccionadas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {areaAttractions.map((att) => {
                  const isChecked = selectedIds.includes(att.id);
                  return (
                    <div
                      key={att.id}
                      onClick={() => toggleAttraction(att.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-[#E64A38]/10 border-[#E64A38] text-[#2A1845] shadow-xs'
                          : 'bg-[#FFF9F3] border-[#F0E2D4] hover:border-[#E64A38]/50 text-[#2A1845]/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shadow-2xs shrink-0 ${
                            isChecked ? 'bg-[#E64A38] text-white' : 'bg-white border border-[#F0E2D4] text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>

                        {/* Miniature thumbnail */}
                        <img
                          src={att.photoUrl}
                          alt={att.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#F0E2D4]"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.src =
                              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=200&q=80';
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-[#2A1845] truncate">{att.name}</div>
                          <div className="text-[10px] text-[#2A1845]/60 flex items-center gap-1.5 mt-0.5 font-light truncate">
                            <span className="font-medium text-[#E64A38]">{att.category}</span>
                            <span>•</span>
                            <span>{att.targetAudience}</span>
                          </div>
                        </div>
                      </div>

                      {att.maxSpeedKmh && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#F0E2D4] text-[#E64A38] font-black shrink-0">
                          {att.maxSpeedKmh} km/h
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-[#F0E2D4] p-4 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-black text-[#2A1845]">
              {selectedIds.length} atracciones seleccionadas
            </div>
            <div className="text-xs text-[#2A1845]/60 font-light">
              Duración estimada de la encuesta: ~{Math.max(1, Math.round(selectedIds.length * 0.5))} minutos
            </div>
          </div>

          <button
            id="btn-launch-custom-survey"
            onClick={() => onLaunchCustom(selectedIds)}
            disabled={selectedIds.length === 0}
            className="px-8 py-3.5 bg-gradient-to-r from-[#E64A38] to-[#D63031] hover:from-[#D63031] hover:to-[#B31D1D] disabled:opacity-30 disabled:pointer-events-none text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#E64A38]/20 transition-all flex items-center gap-2 active:scale-95 border border-white/40"
          >
            <span>Iniciar Encuesta Personalizada</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
