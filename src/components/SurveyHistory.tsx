import React from 'react';
import {
  History,
  Trash2,
  ChevronRight,
  Star,
  Trophy,
  Calendar,
  User,
  ArrowLeft,
  PlusCircle,
} from 'lucide-react';
import { AttractionRating, SurveySession } from '../types';
import { computeVisitorProfile } from '../utils/storage';
import { CarnivalBunting, StarSparkles, TicketStamp } from './ParkDecorations';

interface SurveyHistoryProps {
  sessions: SurveySession[];
  onSelectSession: (session: SurveySession) => void;
  onDeleteSession: (id: string) => void;
  onNewSurvey: () => void;
  onBack: () => void;
}

export const SurveyHistory: React.FC<SurveyHistoryProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onNewSurvey,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#2A1845] pb-20">
      <CarnivalBunting />

      {/* Header */}
      <div className="bg-white border-b-2 border-[#F0E2D4] py-8 relative overflow-hidden">
        <StarSparkles className="top-4 right-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2A1845]/60 hover:text-[#E64A38] mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#2A1845] flex items-center gap-2.5">
                <History className="w-6 h-6 text-[#E64A38]" />
                <span>Historial de Visitas y Encuestas</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs sm:text-sm text-[#2A1845]/70 font-light">
                  Consulta tus valoraciones anteriores de PortAventura y rankings guardados en tu pasaporte.
                </p>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Firebase Firestore sincronizado
                </span>
              </div>
            </div>

            <button
              onClick={onNewSurvey}
              className="px-6 py-3 bg-gradient-to-r from-[#E64A38] to-[#D63031] hover:from-[#D63031] hover:to-[#B31D1D] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 shrink-0 border border-white/40 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Nueva Encuesta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => {
              const ratings = session.ratings || {};
              const sessionRatings = Object.values(ratings) as AttractionRating[];
              const ratedCount = sessionRatings.filter((r) => r.rodeIt).length;
              const scores = sessionRatings
                .map((r) => r.score)
                .filter((s): s is number => typeof s === 'number');
              const avgScore = scores.length
                ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
                : '-';
              const profile = computeVisitorProfile(ratings);

              return (
                <div
                  key={session.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#F0E2D4] hover:border-[#E64A38] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:shadow-md"
                >
                  <div
                    onClick={() => onSelectSession(session)}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif font-black text-[#2A1845] text-base sm:text-lg hover:text-[#E64A38] transition-colors">
                        {session.title}
                      </h3>
                      {session.completed && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E64A38]/10 text-[#E64A38] font-black uppercase tracking-wider border border-[#E64A38]/30">
                          Completada
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#2A1845]/70 mt-2 font-light">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#E64A38]" />
                        {session.visitDate || 'Sin fecha'}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <User className="w-3.5 h-3.5 text-[#2A1845]/50" />
                        {session.visitorName || 'Aventurero'}
                      </span>
                      <span className="text-[#E64A38] font-bold">
                        {ratedCount} atracciones valoradas
                      </span>
                      <span className="text-[#2A1845]/70 font-semibold">Perfil: {profile.archetype}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F0E2D4]">
                    <div
                      onClick={() => onSelectSession(session)}
                      className="cursor-pointer text-right"
                    >
                      <div className="text-[10px] text-[#2A1845]/50 uppercase font-bold">Nota Media</div>
                      <div className="text-xl font-serif font-black text-[#E64A38] flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#E64A38]" />
                        {avgScore}
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteSession(session.id)}
                      title="Eliminar encuesta"
                      className="p-2 rounded-full text-[#2A1845]/40 hover:text-[#E64A38] hover:bg-[#FFF9F3] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectSession(session)}
                      className="p-2.5 rounded-full bg-[#FFF9F3] hover:bg-[#2A1845] hover:text-white text-[#2A1845] border border-[#F0E2D4] transition-colors shadow-2xs"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border-2 border-[#F0E2D4] rounded-3xl p-8 shadow-xs">
            <History className="w-12 h-12 text-[#2A1845]/30 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-black text-[#2A1845]">No tienes encuestas guardadas</h3>
            <p className="text-xs text-[#2A1845]/60 mt-1 max-w-sm mx-auto font-light">
              Realiza tu primera encuesta sobre PortAventura para generar tu ranking y estadísticas en el pasaporte.
            </p>
            <button
              onClick={onNewSurvey}
              className="mt-6 px-8 py-3.5 bg-gradient-to-r from-[#E64A38] to-[#D63031] hover:from-[#D63031] hover:to-[#B31D1D] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all inline-flex items-center gap-2 border border-white/40"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Empezar Encuesta</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
