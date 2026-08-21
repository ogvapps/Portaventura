import React, { useState, useEffect } from 'react';
import {
  Clock,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Star,
  Zap,
  Gamepad2,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Users,
  Compass,
  ArrowUpDown,
  Filter,
  Flame,
  Droplets,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { AreaId, Attraction } from '../types';
import { ATTRACTIONS, AREAS } from '../data/attractions';
import {
  AttractionWaitTime,
  generateLiveWaitTimes,
  getFavoriteAttractionIds,
  toggleFavoriteAttraction,
} from '../data/waitTimes';
import { CarnivalBunting, StarSparkles } from './ParkDecorations';
import { playTickSound, playSuccessSound } from '../utils/audio';

interface WaitTimesViewProps {
  onOpenSurveyForAttraction: (attractionId: string) => void;
  onOpenGames: () => void;
}

export const WaitTimesView: React.FC<WaitTimesViewProps> = ({
  onOpenSurveyForAttraction,
  onOpenGames,
}) => {
  const [waitTimes, setWaitTimes] = useState<Record<string, AttractionWaitTime>>(() =>
    generateLiveWaitTimes(0)
  );
  const [favorites, setFavorites] = useState<string[]>(getFavoriteAttractionIds);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedRange, setSelectedRange] = useState<'all' | 'low' | 'mid' | 'high' | 'favorites'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'wait-asc' | 'wait-desc' | 'score' | 'name'>('wait-asc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [jitterCount, setJitterCount] = useState(1);

  // Auto-refresh timer every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refreshTimes();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [jitterCount]);

  const refreshTimes = () => {
    setIsRefreshing(true);
    playTickSound();
    setTimeout(() => {
      const nextCount = jitterCount + 1;
      setJitterCount(nextCount);
      setWaitTimes(generateLiveWaitTimes(nextCount));
      setIsRefreshing(false);
      setCountdown(60);
      playSuccessSound();
    }, 600);
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFavoriteAttraction(id);
    setFavorites(updated);
    playTickSound();
  };

  // Combine attraction metadata with live wait time
  const enrichedList = ATTRACTIONS.map((att) => {
    const waitInfo = waitTimes[att.id] || {
      attractionId: att.id,
      name: att.name,
      areaId: att.areaId,
      status: 'open',
      waitMinutes: 15,
      expressAvailable: true,
      singleRiderAvailable: false,
      trend: 'stable',
      lastUpdated: '12:00',
      historicalPeakHour: '14:00 - 16:30',
      capacityPerHour: 1000,
    };
    return {
      attraction: att,
      wait: waitInfo,
      isFavorite: favorites.includes(att.id),
    };
  });

  // Filter logic
  const filteredList = enrichedList.filter((item) => {
    const { attraction, wait, isFavorite } = item;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = attraction.name.toLowerCase().includes(q);
      const matchArea = AREAS[attraction.areaId]?.name.toLowerCase().includes(q);
      if (!matchName && !matchArea) return false;
    }

    // Area filter
    if (selectedArea !== 'all' && attraction.areaId !== selectedArea) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'Montaña Rusa' && attraction.category !== 'Montaña Rusa') return false;
      if (selectedCategory === 'Acuática' && attraction.category !== 'Acuática') return false;
      if (selectedCategory === 'Familiar' && attraction.category !== 'Familiar' && attraction.category !== 'Infantil') return false;
      if (selectedCategory === 'Extrema' && attraction.intensity !== 'Extrema') return false;
    }

    // Wait range filter
    if (selectedRange === 'favorites' && !isFavorite) return false;
    if (selectedRange === 'low' && (wait.status !== 'open' || wait.waitMinutes > 20)) return false;
    if (selectedRange === 'mid' && (wait.status !== 'open' || wait.waitMinutes <= 20 || wait.waitMinutes > 45)) return false;
    if (selectedRange === 'high' && (wait.status !== 'open' || wait.waitMinutes <= 45)) return false;

    return true;
  });

  // Sort logic
  filteredList.sort((a, b) => {
    // Keep favorites on top if sorting by wait-asc or general
    if (sortBy === 'wait-asc') {
      if (a.wait.status !== 'open' && b.wait.status === 'open') return 1;
      if (a.wait.status === 'open' && b.wait.status !== 'open') return -1;
      return a.wait.waitMinutes - b.wait.waitMinutes;
    }
    if (sortBy === 'wait-desc') {
      return b.wait.waitMinutes - a.wait.waitMinutes;
    }
    if (sortBy === 'score') {
      return b.attraction.communityScore - a.attraction.communityScore;
    }
    if (sortBy === 'name') {
      return a.attraction.name.localeCompare(b.attraction.name);
    }
    return 0;
  });

  // Aggregate stats
  const openCount = enrichedList.filter((x) => x.wait.status === 'open').length;
  const expressCount = enrichedList.filter((x) => x.wait.expressAvailable).length;
  const avgWait = Math.round(
    enrichedList
      .filter((x) => x.wait.status === 'open')
      .reduce((acc, x) => acc + x.wait.waitMinutes, 0) / Math.max(1, openCount)
  );

  return (
    <main className="min-h-screen bg-[#FFF9F3] text-[#2A1845] pb-24">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#2A1845] via-[#3B2260] to-[#2A1845] text-white pt-10 pb-12 relative overflow-hidden border-b-4 border-[#E64A38]">
        <StarSparkles className="top-4 right-10 text-[#F7B731]" />
        <StarSparkles className="bottom-4 left-10 text-[#F7B731]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E64A38] text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                  <Clock className="w-3.5 h-3.5" />
                  <span>En Directo en el Parque</span>
                </span>
                <span className="text-xs text-[#F7B731] font-bold">
                  ● Actualización en Tiempo Real
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white">
                Tiempos de Espera & Colas
              </h1>
              <p className="text-sm text-white/80 font-light max-w-xl">
                Consulta los minutos exactos de cola en las 49 atracciones, acceso Express, Single Rider y juega a divertidos minijuegos mientras esperas tu turno.
              </p>
            </div>

            {/* Quick Live Park Status Dashboard */}
            <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
              <div className="px-4 py-2 bg-white/10 rounded-2xl text-center">
                <div className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Atracciones</div>
                <div className="text-lg font-black font-serif text-[#81B29A]">{openCount}/49 Abiertas</div>
              </div>

              <div className="px-4 py-2 bg-white/10 rounded-2xl text-center">
                <div className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Media Parque</div>
                <div className="text-lg font-black font-serif text-[#F7B731]">{avgWait} min</div>
              </div>

              <div className="px-4 py-2 bg-white/10 rounded-2xl text-center hidden sm:block">
                <div className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Afluencia</div>
                <div className="text-lg font-black font-serif text-white">68% Media</div>
              </div>

              <button
                id="btn-refresh-wait-times"
                onClick={refreshTimes}
                disabled={isRefreshing}
                className="px-4 py-3 bg-[#E64A38] hover:bg-[#D63031] text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md disabled:opacity-50 active:scale-95"
                title="Actualizar ahora"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">Actualizar ({countdown}s)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Game Promotion Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-gradient-to-r from-[#F7B731] via-[#FFA801] to-[#F7B731] text-[#2A1845] rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2A1845] text-[#F7B731] flex items-center justify-center text-2xl shadow-md shrink-0">
              🎮
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#2A1845]/80 flex items-center gap-1.5">
                <span>¿Aburrido en la cola?</span>
                <span className="px-2 py-0.2 rounded-full bg-[#E64A38] text-white text-[10px]">¡Nuevo!</span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-black">
                Pasa el rato con el Quiz de PortAventura, Cazador de Reflejos y Ruleta de Retos
              </h3>
            </div>
          </div>

          <button
            id="btn-open-queue-games-banner"
            onClick={onOpenGames}
            className="w-full sm:w-auto px-6 py-3 bg-[#2A1845] hover:bg-[#E64A38] text-white rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Jugar Minijuegos de Cola</span>
          </button>
        </div>
      </div>

      {/* Main Content & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Controls Bar: Search, Ranges & Sort */}
        <div className="bg-white border-2 border-[#F0E2D4] rounded-3xl p-5 sm:p-6 mb-8 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#2A1845]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-wait-times"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre de atracción o zona (ej. Shambhala, Dragon Khan, China)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F3] text-xs font-medium text-[#2A1845] rounded-2xl border border-[#F0E2D4] focus:outline-none focus:ring-2 focus:ring-[#E64A38]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#2A1845]/40 hover:text-[#E64A38]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Wait Range Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#FFF9F3] p-1.5 rounded-2xl border border-[#F0E2D4]">
              <button
                onClick={() => setSelectedRange('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRange === 'all' ? 'bg-[#2A1845] text-white shadow-xs' : 'text-[#2A1845]/70 hover:text-[#2A1845]'
                }`}
              >
                Todas ({enrichedList.length})
              </button>
              <button
                onClick={() => setSelectedRange('low')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedRange === 'low' ? 'bg-[#81B29A] text-white shadow-xs' : 'text-[#81B29A] hover:bg-white'
                }`}
              >
                <span>≤ 20 min</span>
              </button>
              <button
                onClick={() => setSelectedRange('mid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedRange === 'mid' ? 'bg-[#F7B731] text-[#2A1845] shadow-xs' : 'text-[#d97706] hover:bg-white'
                }`}
              >
                <span>20-45 min</span>
              </button>
              <button
                onClick={() => setSelectedRange('high')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedRange === 'high' ? 'bg-[#E64A38] text-white shadow-xs' : 'text-[#E64A38] hover:bg-white'
                }`}
              >
                <span>&gt; 45 min</span>
              </button>
              <button
                onClick={() => setSelectedRange('favorites')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedRange === 'favorites' ? 'bg-[#F7B731] text-[#2A1845] shadow-xs' : 'text-[#2A1845]/70 hover:bg-white'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>Favoritos ({favorites.length})</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#2A1845]/60 font-semibold whitespace-nowrap hidden lg:inline">
                Ordenar:
              </span>
              <select
                id="select-sort-wait-times"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3.5 py-2.5 bg-[#FFF9F3] text-xs font-bold text-[#2A1845] rounded-2xl border border-[#F0E2D4] focus:outline-none focus:ring-2 focus:ring-[#E64A38]"
              >
                <option value="wait-asc">Menor a mayor espera</option>
                <option value="wait-desc">Mayor a menor espera</option>
                <option value="score">Mejor valoradas</option>
                <option value="name">Alfabético (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Area Filter Buttons */}
          <div className="pt-2 border-t border-[#F0E2D4] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-[#2A1845]/60 shrink-0 mr-1">Mundos:</span>
            <button
              onClick={() => setSelectedArea('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedArea === 'all'
                  ? 'bg-[#E64A38] text-white shadow-xs'
                  : 'bg-[#FFF9F3] text-[#2A1845]/70 hover:text-[#E64A38] border border-[#F0E2D4]'
              }`}
            >
              Todos los Mundos
            </button>
            {Object.values(AREAS).map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedArea === area.id
                    ? 'text-white shadow-xs'
                    : 'bg-[#FFF9F3] text-[#2A1845]/70 hover:text-[#2A1845] border border-[#F0E2D4]'
                }`}
                style={{
                  backgroundColor: selectedArea === area.id ? area.color : undefined,
                }}
              >
                <span>{area.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Fast Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs text-[#2A1845]/70 font-medium">
            Mostrando <strong>{filteredList.length}</strong> atracciones en tiempo real
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-[#2A1845]/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#81B29A]" /> &le; 20 min
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F7B731]" /> 25-45 min
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E64A38]" /> &gt; 45 min
            </span>
          </div>
        </div>

        {/* Attraction Cards Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-[#F0E2D4] p-8">
            <div className="text-4xl mb-3">🎢</div>
            <h3 className="text-lg font-serif font-black text-[#2A1845]">No se encontraron atracciones</h3>
            <p className="text-xs text-[#2A1845]/60 mt-1">Prueba a cambiar el filtro de búsqueda o el rango de tiempo de espera.</p>
            <button
              onClick={() => {
                setSelectedArea('all');
                setSelectedRange('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#E64A38] text-white text-xs font-bold uppercase tracking-wider"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map(({ attraction, wait, isFavorite }) => {
              const area = AREAS[attraction.areaId];
              const isClosed = wait.status !== 'open';

              // Badge color logic
              let badgeBg = 'bg-[#81B29A] text-white';
              let badgeBorder = 'border-[#81B29A]';
              if (isClosed) {
                badgeBg = 'bg-gray-400 text-white';
                badgeBorder = 'border-gray-300';
              } else if (wait.waitMinutes > 45) {
                badgeBg = 'bg-[#E64A38] text-white';
                badgeBorder = 'border-[#E64A38]';
              } else if (wait.waitMinutes > 20) {
                badgeBg = 'bg-[#F7B731] text-[#2A1845]';
                badgeBorder = 'border-[#F7B731]';
              }

              return (
                <article
                  key={attraction.id}
                  className={`bg-white border-2 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                    isFavorite ? 'border-[#F7B731]/80 ring-2 ring-[#F7B731]/20' : 'border-[#F0E2D4] hover:border-[#E64A38]'
                  }`}
                >
                  <div>
                    {/* Image Header & Live Wait Pill */}
                    <div className="relative h-40 w-full bg-[#2A1845] overflow-hidden">
                      <img
                        src={attraction.photoUrl}
                        alt={attraction.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src =
                            'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Area Badge & Favorite Pin */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs backdrop-blur-xs"
                          style={{ backgroundColor: `${area?.color}E6` }}
                        >
                          {area?.name}
                        </span>

                        <button
                          id={`btn-fav-${attraction.id}`}
                          onClick={(e) => handleToggleFavorite(attraction.id, e)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isFavorite
                              ? 'bg-[#F7B731] text-[#2A1845] shadow-md scale-110'
                              : 'bg-black/40 text-white hover:bg-[#F7B731] hover:text-[#2A1845]'
                          }`}
                          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                        >
                          <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Giant Wait Time Pill on Photo */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <div className="text-[10px] font-medium text-[#F7B731] uppercase tracking-wider">
                            {attraction.category} • {attraction.intensity}
                          </div>
                          <h3 className="text-lg font-serif font-black leading-tight drop-shadow-sm truncate max-w-[180px] sm:max-w-[200px]">
                            {attraction.name}
                          </h3>
                        </div>

                        {/* Wait Minutes Pill */}
                        <div
                          className={`px-3.5 py-1.5 rounded-2xl font-serif font-black shadow-lg flex flex-col items-center justify-center border-2 border-white/50 shrink-0 ${badgeBg}`}
                        >
                          {isClosed ? (
                            <span className="text-xs font-sans uppercase tracking-wider">Cerrada</span>
                          ) : (
                            <>
                              <div className="flex items-center gap-1 text-xl leading-none">
                                <span>{wait.waitMinutes}</span>
                                <span className="text-[10px] font-sans font-bold">MIN</span>
                              </div>
                              <div className="flex items-center gap-0.5 text-[9px] font-sans font-medium opacity-90">
                                {wait.trend === 'rising' && <TrendingUp className="w-2.5 h-2.5" />}
                                {wait.trend === 'falling' && <TrendingDown className="w-2.5 h-2.5" />}
                                {wait.trend === 'stable' && <Minus className="w-2.5 h-2.5" />}
                                <span>{wait.trend === 'rising' ? 'Subiendo' : wait.trend === 'falling' ? 'Bajando' : 'Estable'}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Information Body */}
                    <div className="p-4 space-y-3">
                      {/* Express & Single Rider Pass info */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        {wait.expressAvailable ? (
                          <span className="px-2.5 py-1 rounded-xl bg-[#FFF0E5] border border-[#E64A38]/30 text-[#E64A38] font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" />
                            <span>Express: {wait.expressWaitMinutes ? `${wait.expressWaitMinutes} min` : 'Disponible'}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-xl bg-gray-100 text-gray-400 font-medium">
                            Sin Express
                          </span>
                        )}

                        {wait.singleRiderAvailable && (
                          <span className="px-2.5 py-1 rounded-xl bg-[#E0F2FE] border border-[#0284C7]/30 text-[#0284C7] font-bold flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>Single Rider: {wait.singleRiderWaitMinutes} min</span>
                          </span>
                        )}

                        <span className="text-[10px] text-[#2A1845]/50 ml-auto">
                          Act: {wait.lastUpdated}
                        </span>
                      </div>

                      {/* Location Detail */}
                      <p className="text-xs text-[#2A1845]/70 font-light line-clamp-1">
                        📍 {attraction.locationDetail}
                      </p>

                      {/* Technical badge row */}
                      <div className="flex items-center gap-2 text-[11px] text-[#2A1845]/70 pt-1">
                        {attraction.maxSpeedKmh && (
                          <span className="font-serif font-black text-[#E64A38]">
                            🚀 {attraction.maxSpeedKmh} km/h
                          </span>
                        )}
                        {attraction.heightM && (
                          <span>📐 {attraction.heightM}m</span>
                        )}
                        <span className="ml-auto font-serif font-bold text-[#F7B731]">
                          ★ {attraction.communityScore}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      id={`btn-survey-from-wait-${attraction.id}`}
                      onClick={() => onOpenSurveyForAttraction(attraction.id)}
                      className="py-2.5 px-2 rounded-2xl bg-[#E64A38] hover:bg-[#D63031] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-2xs transition-colors active:scale-95"
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      <span>¡He subido! Evaluar</span>
                    </button>

                    <button
                      id={`btn-play-for-queue-${attraction.id}`}
                      onClick={onOpenGames}
                      className="py-2.5 px-2 rounded-2xl bg-[#FFF9F3] hover:bg-[#2A1845] hover:text-white text-[#2A1845] border border-[#F0E2D4] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all active:scale-95"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-[#F7B731]" />
                      <span>Jugar en Cola</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
