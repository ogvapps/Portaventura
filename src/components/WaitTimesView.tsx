import React from 'react';
import { ExternalLink, Clock, Sparkles, Compass, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { CarnivalBunting, StarSparkles } from './ParkDecorations';

interface WaitTimesViewProps {
  onOpenSurveyForAttraction?: (attractionId: string) => void;
  onOpenGames?: () => void;
}

export const WaitTimesView: React.FC<WaitTimesViewProps> = ({ onOpenGames }) => {
  const pafansUrl = 'https://www.pafans.com/info/tiempos-de-espera';

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#2A1845] pb-24">
      {/* Top Banner with Circus & Victorian Carnival Aesthetic */}
      <div className="relative bg-gradient-to-b from-[#2A1845] to-[#1E1131] pt-8 pb-14 overflow-hidden border-b-4 border-[#F7B731]">
        <CarnivalBunting className="absolute top-0 inset-x-0 h-4 opacity-80" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E64A38] text-white text-xs font-black uppercase tracking-widest shadow-md mb-4 border border-white/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Tiempos de Espera en Vivo</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white mb-4">
            Colas y Tiempos de Espera
          </h1>

          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            Consulta en directo los tiempos oficiales y actualizados de todas las atracciones de PortAventura Park y Ferrari Land a través del monitor especializado de PAFANS.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              id="btn-open-pafans-main"
              href={pafansUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-[#E64A38] to-[#D63031] hover:from-[#D63031] hover:to-[#B31D1D] text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#E64A38]/30 transition-all flex items-center gap-3 active:scale-95 border-2 border-white/60 group"
            >
              <span>Abrir Monitor PAFANS en Directo</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {onOpenGames && (
              <button
                type="button"
                onClick={onOpenGames}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-full font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#F7B731]" />
                <span>¿Haciendo Cola? Jugar a Minijuegos</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container / Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-3xl border-2 border-[#E64A38]/30 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3 pb-6 border-b border-[#F0E2D4] mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0E5] border border-[#E64A38]/30 flex items-center justify-center text-xl shrink-0">
              ⏱️
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-[#2A1845]">
                Acceso Oficial a PAFANS Tiempos de Espera
              </h2>
              <p className="text-xs text-[#2A1845]/70">
                La fuente comunitaria de referencia con el estado exacto de colas, aperturas y tiempos minuto a minuto.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4]">
              <ShieldCheck className="w-5 h-5 text-[#81B29A] shrink-0 mt-0.5" />
              <div className="text-xs text-[#2A1845]/85 leading-relaxed">
                <strong>Datos en Tiempo Real:</strong> Minutos de fila regular, disponibilidad de Express Pass y colas Single Rider para Shambhala, Dragon Khan, Furius Baco, Uncharted, Red Force y el resto del parque.
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4]">
              <Compass className="w-5 h-5 text-[#38A3A5] shrink-0 mt-0.5" />
              <div className="text-xs text-[#2A1845]/85 leading-relaxed">
                <strong>Organizado por Áreas Temáticas:</strong> Navega cómodamente por Mediterrània, Polynesia, China, México, Far West, SésamoAventura y Ferrari Land.
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4]">
              <Info className="w-5 h-5 text-[#F7B731] shrink-0 mt-0.5" />
              <div className="text-xs text-[#2A1845]/85 leading-relaxed">
                <strong>Consejo de Visita:</strong> Puedes mantener la pestaña abierta en tu móvil mientras realizas las encuestas y juegas para optimizar tus recorridos por el parque.
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="text-center pt-2">
            <a
              id="btn-link-pafans-action"
              href={pafansUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-10 py-4 bg-[#2A1845] hover:bg-[#3D2561] text-[#F7B731] hover:text-white rounded-2xl font-serif font-black text-sm uppercase tracking-wider shadow-lg transition-all border border-[#F7B731]/40"
            >
              <span>Ir a www.pafans.com/info/tiempos-de-espera</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
