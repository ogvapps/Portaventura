import React, { useState } from 'react';
import {
  Search,
  Compass,
  Star,
  Zap,
  Droplets,
  Flame,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  Filter,
  MapPin,
  Users,
  Smile,
  ShieldAlert,
  ArrowUpRight,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import { ATTRACTIONS, AREAS } from '../data/attractions';
import { AreaId, Attraction, AttractionCategory } from '../types';
import { CarnivalBunting, StarSparkles, TicketStamp, FlyerCapsule } from './ParkDecorations';
import { AttractionImage } from './AttractionImage';

interface AttractionCatalogProps {
  onSelectAttractionForSurvey?: (attractionId: string) => void;
}

export const AttractionCatalog: React.FC<AttractionCatalogProps> = ({
  onSelectAttractionForSurvey,
}) => {
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAttractionModal, setSelectedAttractionModal] = useState<Attraction | null>(null);

  const filteredAttractions = ATTRACTIONS.filter((att) => {
    const matchesSearch =
      att.name.toLowerCase().includes(search.toLowerCase()) ||
      att.description.toLowerCase().includes(search.toLowerCase()) ||
      att.tagline.toLowerCase().includes(search.toLowerCase()) ||
      att.locationDetail.toLowerCase().includes(search.toLowerCase());
    const matchesArea = selectedArea === 'all' || att.areaId === selectedArea;
    const matchesAudience = selectedAudience === 'all' || att.targetAudience === selectedAudience;
    const matchesCat = selectedCategory === 'all' || att.category === selectedCategory;
    return matchesSearch && matchesArea && matchesAudience && matchesCat;
  });

  // Group filtered attractions strictly by Area/Location
  const areaKeysOrder: AreaId[] = [
    'china',
    'mexico',
    'far-west',
    'sesamo',
    'polynesia',
    'mediterrania',
    'ferrari-land',
  ];

  const groupedByArea: Record<string, Attraction[]> = {};
  areaKeysOrder.forEach((areaId) => {
    groupedByArea[areaId] = filteredAttractions.filter((a) => a.areaId === areaId);
  });

  const categories: AttractionCategory[] = [
    'Montaña Rusa',
    'Acuática',
    'Dark Ride / Simulador',
    'Caída Libre',
    'Familiar',
    'Infantil',
  ];

  const audienceFilters = [
    { id: 'all', label: 'Todos los públicos', icon: '✨' },
    { id: 'Niños', label: '👶 Niños', icon: '👶' },
    { id: 'Toda la familia', label: '👨‍👩‍👧‍👦 Toda la familia', icon: '👨‍👩‍👧‍👦' },
    { id: 'Adultos', label: '🧑 Adultos', icon: '🧑' },
    { id: 'Amantes de emociones fuertes', label: '🔥 Emociones Fuertes', icon: '🔥' },
  ];

  const getAreaIcon = (areaId: AreaId) => {
    switch (areaId) {
      case 'china':
        return '🐉';
      case 'mexico':
        return '☀️';
      case 'far-west':
        return '🤠';
      case 'sesamo':
        return '🌈';
      case 'polynesia':
        return '🌴';
      case 'mediterrania':
        return '⛵';
      case 'ferrari-land':
        return '🏎️';
      default:
        return '🎡';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#2A1845] pb-24">
      <CarnivalBunting />

      {/* Header Banner */}
      <div className="bg-white border-b-2 border-[#F0E2D4] py-8 relative overflow-hidden">
        <StarSparkles className="top-3 left-6" />
        <StarSparkles className="bottom-2 right-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E64A38]/10 border border-[#E64A38]/30 text-[#E64A38] text-xs font-black uppercase tracking-wider mb-2.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Guía Oficial del Parque • 49 Atracciones</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#2A1845]">
                Atracciones Organizadas por Ubicación
              </h1>
              <p className="text-xs sm:text-sm text-[#2A1845]/70 mt-1.5 font-light max-w-2xl">
                Encuentra cada atracción con su <strong>fotografía</strong>, <strong>ubicación exacta en el mapa</strong>, categoría y público recomendado para planificar tu visita perfecta.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80 relative shrink-0">
              <Search className="w-4 h-4 text-[#2A1845]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, zona o ubicación..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F3] border-2 border-[#F0E2D4] rounded-full text-xs text-[#2A1845] placeholder-[#2A1845]/40 focus:outline-none focus:border-[#E64A38] transition-colors shadow-2xs font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#2A1845]/40 hover:text-[#E64A38]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar: Locations (Mundos) */}
          <div className="mt-6 pt-4 border-t border-[#F0E2D4]">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#2A1845]/70 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#E64A38]" />
              <span>Filtrar por Ubicación / Mundo:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedArea('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedArea === 'all'
                    ? 'bg-[#2A1845] text-white shadow-xs scale-102'
                    : 'bg-[#FFF9F3] border border-[#F0E2D4] text-[#2A1845]/75 hover:border-[#E64A38]'
                }`}
              >
                🌍 Todos los Mundos ({ATTRACTIONS.length})
              </button>
              {areaKeysOrder.map((areaKey) => {
                const aInfo = AREAS[areaKey];
                const count = ATTRACTIONS.filter((a) => a.areaId === areaKey).length;
                const isSelected = selectedArea === areaKey;
                return (
                  <button
                    key={areaKey}
                    onClick={() => setSelectedArea(areaKey)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#2A1845] text-white shadow-xs scale-102'
                        : 'bg-white border border-[#F0E2D4] text-[#2A1845]/80 hover:border-[#E64A38]'
                    }`}
                  >
                    <span>{getAreaIcon(areaKey)}</span>
                    <span>{aInfo.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 text-inherit">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filters: Target Audience & Category */}
          <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-[#F0E2D4]/60 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#2A1845]/60 font-semibold flex items-center gap-1">
                <Users className="w-3 h-3 text-[#E64A38]" /> Público:
              </span>
              {audienceFilters.map((aud) => (
                <button
                  key={aud.id}
                  onClick={() => setSelectedAudience(aud.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    selectedAudience === aud.id
                      ? 'bg-[#E64A38] text-white'
                      : 'bg-[#FFF9F3] text-[#2A1845]/70 border border-[#F0E2D4] hover:border-[#E64A38]/50'
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#2A1845]/60 font-semibold flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-[#E64A38]" /> Tipo:
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#38A3A5] text-white'
                    : 'bg-[#FFF9F3] text-[#2A1845]/70 border border-[#F0E2D4]'
                }`}
              >
                Todas las categorías
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#38A3A5] text-white'
                      : 'bg-[#FFF9F3] text-[#2A1845]/70 border border-[#F0E2D4] hover:border-[#38A3A5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Access to Live Wait Times at PAFANS */}
          <div className="mt-4 pt-3 border-t border-[#F0E2D4] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFF9F3] p-3 sm:p-4 rounded-2xl border border-[#E64A38]/20">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#E64A38] text-white flex items-center justify-center text-sm shadow-xs shrink-0">
                ⏱️
              </span>
              <div className="text-left">
                <div className="text-xs font-serif font-black text-[#2A1845]">
                  ¿Quieres ver las colas en tiempo real ahora mismo?
                </div>
                <div className="text-[11px] text-[#2A1845]/70">
                  Consulta el monitor especializado en directo de PortAventura & Ferrari Land.
                </div>
              </div>
            </div>
            <a
              id="btn-catalog-open-pafans"
              href="https://www.pafans.com/info/tiempos-de-espera"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E64A38] hover:bg-[#D63031] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all shrink-0"
            >
              <span>Ver Tiempos en PAFANS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Attraction Sections Grouped strictly by Location */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {areaKeysOrder.map((areaKey) => {
          const areaAttractions = groupedByArea[areaKey] || [];
          if (areaAttractions.length === 0) return null;
          const area = AREAS[areaKey];

          return (
            <section key={areaKey} className="scroll-mt-24" id={`area-${areaKey}`}>
              {/* Location Group Header Banner */}
              <div
                className="rounded-3xl p-5 sm:p-6 mb-6 border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                style={{
                  backgroundColor: `${area.color}08`,
                  borderColor: `${area.color}35`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 text-white"
                    style={{ backgroundColor: area.color }}
                  >
                    {getAreaIcon(areaKey)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white border text-[#2A1845]/70 border-[#F0E2D4]">
                        Área Temática
                      </span>
                      <span className="text-xs font-bold text-[#2A1845]/60 font-serif">
                        {area.theme}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#2A1845] mt-0.5">
                      {area.name}
                    </h2>
                    <p className="text-xs text-[#2A1845]/75 mt-0.5 font-light max-w-xl">
                      {area.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
                  <div className="px-4 py-2 rounded-2xl bg-white border border-[#F0E2D4] shadow-2xs text-center">
                    <div className="text-xs font-serif font-black text-[#2A1845]">
                      {areaAttractions.length}
                    </div>
                    <div className="text-[10px] text-[#2A1845]/60 font-bold uppercase">
                      Atracciones
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid of Attractions for this Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {areaAttractions.map((att) => {
                  return (
                    <article
                      key={att.id}
                      onClick={() => setSelectedAttractionModal(att)}
                      className="group cursor-pointer rounded-3xl bg-white border-2 border-[#F0E2D4] hover:border-[#E64A38] transition-all overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg hover:-translate-y-1"
                    >
                      {/* Attraction Photo Container */}
                      <AttractionImage
                        attraction={att}
                        className="h-48 sm:h-52 w-full"
                        showBadge={true}
                      />

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Location Pin with Detailed Directions */}
                          <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-[#FFF9F3] border border-[#F0E2D4] mb-3">
                            <MapPin className="w-3.5 h-3.5 text-[#E64A38] shrink-0 mt-0.5" />
                            <div className="text-[11px] text-[#2A1845]/80 font-medium leading-snug">
                              <strong className="text-[#E64A38] font-bold">Ubicación:</strong>{' '}
                              {att.locationDetail}
                            </div>
                          </div>

                          <p className="text-xs text-[#2A1845]/70 font-light line-clamp-2 leading-relaxed">
                            {att.description}
                          </p>
                        </div>

                        <div>
                          {/* Technical Specifications & Details Button */}
                          <div className="mt-4 pt-3.5 border-t border-[#F0E2D4] flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs">
                              {att.maxSpeedKmh && (
                                <span className="font-serif font-black text-[#E64A38]">
                                  {att.maxSpeedKmh} km/h
                                </span>
                              )}
                              {att.heightM && (
                                <span className="text-[11px] font-medium text-[#2A1845]/70">
                                  {att.heightM}m alt.
                                </span>
                              )}
                              {att.minHeightCm && (
                                <span className="text-[11px] text-[#2A1845]/50">
                                  Min: {att.minHeightCm}cm
                                </span>
                              )}
                            </div>

                            <span className="inline-flex items-center gap-1 text-xs font-black text-[#E64A38] group-hover:translate-x-1 transition-transform">
                              <span>Ver Ficha</span>
                              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          </div>

                          {/* Quick Survey Trigger Button */}
                          {onSelectAttractionForSurvey && (
                            <button
                              id={`btn-rate-attraction-${att.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectAttractionForSurvey(att.id);
                              }}
                              className="w-full mt-3 py-2.5 px-3 rounded-2xl bg-[#E64A38]/10 hover:bg-[#E64A38] text-[#E64A38] hover:text-white border border-[#E64A38]/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-2xs group/btn"
                            >
                              <Zap className="w-3.5 h-3.5 fill-current" />
                              <span>¡Acabo de montarme! Evaluar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        {filteredAttractions.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#F0E2D4] p-8">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF9F3] text-2xl flex items-center justify-center mb-3">
              🔍
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2A1845]">
              No se han encontrado atracciones
            </h3>
            <p className="text-xs text-[#2A1845]/60 mt-1">
              Prueba a cambiar los filtros de búsqueda o seleccionar "Todos los Mundos".
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedArea('all');
                setSelectedAudience('all');
                setSelectedCategory('all');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#2A1845] text-white text-xs font-bold hover:bg-[#E64A38] transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal (Flyer & Guidebook Style with Photo & Directions) */}
      {selectedAttractionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1845]/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setSelectedAttractionModal(null)}
        >
          <div
            className="bg-white border-2 border-[#E64A38]/50 rounded-3xl max-w-xl w-full shadow-2xl relative text-[#2A1845] overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-56 sm:h-64 w-full bg-[#2A1845]">
              <AttractionImage
                attraction={selectedAttractionModal}
                className="h-56 sm:h-64 w-full"
                showBadge={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <button
                onClick={() => setSelectedAttractionModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-[#E64A38] flex items-center justify-center transition-colors font-bold text-sm shadow-md z-20"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-xs"
                    style={{
                      backgroundColor: AREAS[selectedAttractionModal.areaId]?.color || '#E64A38',
                    }}
                  >
                    {AREAS[selectedAttractionModal.areaId]?.name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-[#2A1845] text-xs font-bold">
                    {selectedAttractionModal.category}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black drop-shadow-md">
                  {selectedAttractionModal.name}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-7 space-y-4">
              <p className="text-base text-[#E64A38] font-script font-bold">
                "{selectedAttractionModal.tagline}"
              </p>

              {/* Exact Location Card */}
              <div className="p-3.5 bg-[#FFF9F3] border-2 border-[#F0E2D4] rounded-2xl flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E64A38] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#2A1845] uppercase tracking-wider">
                    ¿Dónde encontrarla en el parque?
                  </div>
                  <div className="text-xs text-[#2A1845]/85 font-medium mt-0.5">
                    {selectedAttractionModal.locationDetail}
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#2A1845]/80 leading-relaxed font-light">
                {selectedAttractionModal.description}
              </p>

              {/* Technical Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#FFF9F3] p-3.5 rounded-2xl border border-[#F0E2D4]">
                <div className="text-center">
                  <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold">Intensidad</div>
                  <div className="text-xs font-bold text-[#E64A38] mt-0.5">
                    {selectedAttractionModal.intensity}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold">Público</div>
                  <div className="text-xs font-bold text-[#2A1845] mt-0.5">
                    {selectedAttractionModal.targetAudience}
                  </div>
                </div>
                {selectedAttractionModal.maxSpeedKmh && (
                  <div className="text-center">
                    <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold">Velocidad</div>
                    <div className="text-xs font-serif font-black text-[#E64A38] mt-0.5">
                      {selectedAttractionModal.maxSpeedKmh} km/h
                    </div>
                  </div>
                )}
                {selectedAttractionModal.heightM && (
                  <div className="text-center">
                    <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold">Altura</div>
                    <div className="text-xs font-serif font-bold text-[#2A1845] mt-0.5">
                      {selectedAttractionModal.heightM} m
                    </div>
                  </div>
                )}
                {selectedAttractionModal.minHeightCm && (
                  <div className="text-center">
                    <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold">Altura Mín.</div>
                    <div className="text-xs font-bold text-[#2A1845] mt-0.5">
                      {selectedAttractionModal.minHeightCm} cm
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold">Estreno</div>
                  <div className="text-xs font-bold text-[#2A1845] mt-0.5">
                    {selectedAttractionModal.openingYear}
                  </div>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="p-3.5 bg-[#FFF0E5] border border-[#E64A38]/30 rounded-2xl text-xs text-[#2A1845] leading-relaxed font-light">
                💡 <strong className="font-bold text-[#2A1845]">Curiosidad:</strong>{' '}
                {selectedAttractionModal.funFact}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {onSelectAttractionForSurvey && (
                  <button
                    id="btn-modal-rate-attraction"
                    onClick={() => {
                      const id = selectedAttractionModal.id;
                      setSelectedAttractionModal(null);
                      onSelectAttractionForSurvey(id);
                    }}
                    className="flex-1 py-3.5 px-5 bg-gradient-to-r from-[#E64A38] to-[#D63031] hover:from-[#D63031] hover:to-[#B31D1D] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-[#E64A38]/20 flex items-center justify-center gap-2 border border-white/40"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>¡Acabo de montarme! Abrir Encuesta</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedAttractionModal(null)}
                  className="px-6 py-3 bg-[#FFF9F3] hover:bg-white text-[#2A1845] border border-[#F0E2D4] rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
