import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Trophy,
  Flame,
  Zap,
  Users,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  Share2,
  Clock,
  Shuffle,
  Star,
  Award,
  ChevronRight,
  ArrowRight,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS, QUEUE_CHALLENGES, WHEEL_CHOICES, QuizQuestion } from '../data/queueGames';
import { AREAS, ATTRACTIONS } from '../data/attractions';
import { StarSparkles, CarnivalBunting } from './ParkDecorations';
import {
  playStarSound,
  playNextSound,
  playCompleteSound,
  playSuccessSound,
  playErrorSound,
  playTickSound,
  playSpinTickSound,
} from '../utils/audio';

interface QueueGamesViewProps {
  onOpenSurveyForAttraction: (attractionId: string) => void;
  onOpenWaitTimes: () => void;
}

type ActiveGame = 'hub' | 'quiz' | 'reflex' | 'memory' | 'wheel';

export const QueueGamesView: React.FC<QueueGamesViewProps> = ({
  onOpenSurveyForAttraction,
  onOpenWaitTimes,
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('hub');

  // Global game points accumulated in session
  const [totalParkCoins, setTotalParkCoins] = useState<number>(() => {
    if (typeof window === 'undefined') return 150;
    const saved = localStorage.getItem('pa_game_coins');
    return saved ? parseInt(saved, 10) : 150;
  });

  const addCoins = (amount: number) => {
    setTotalParkCoins((prev) => {
      const next = prev + amount;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pa_game_coins', next.toString());
      }
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-[#FFF9F3] text-[#2A1845] pb-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#2A1845] via-[#3B2260] to-[#2A1845] text-white pt-10 pb-12 relative overflow-hidden border-b-4 border-[#E64A38]">
        <StarSparkles className="top-4 right-10 text-[#F7B731]" />
        <StarSparkles className="bottom-4 left-10 text-[#F7B731]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E64A38] text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Zona Recreativa PortAventura</span>
                </span>
                <span className="text-xs text-[#F7B731] font-bold">
                  ¡Diversión en la Cola!
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white">
                Pasatiempos & Minijuegos
              </h1>
              <p className="text-sm text-white/80 font-light max-w-xl">
                Juega solo o pasa el móvil entre amigos y familia mientras esperas en la fila. Compite en el gran Quiz, pon a prueba tus reflejos o gira la ruleta.
              </p>
            </div>

            {/* Total Coins / Achievements Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F7B731] to-[#FFA801] text-[#2A1845] flex items-center justify-center text-2xl font-bold shadow-md">
                🪙
              </div>
              <div>
                <div className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Monedas de Aventura</div>
                <div className="text-2xl font-black font-serif text-[#F7B731]">{totalParkCoins} pts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeGame === 'hub' && (
          <GameHubMenu
            onSelectGame={(game) => {
              setActiveGame(game);
              playNextSound();
            }}
            onOpenWaitTimes={onOpenWaitTimes}
          />
        )}

        {activeGame === 'quiz' && (
          <QuizGame
            onBack={() => setActiveGame('hub')}
            onAddCoins={addCoins}
          />
        )}

        {activeGame === 'reflex' && (
          <ReflexTapGame
            onBack={() => setActiveGame('hub')}
            onAddCoins={addCoins}
          />
        )}

        {activeGame === 'memory' && (
          <MemoryGame
            onBack={() => setActiveGame('hub')}
            onAddCoins={addCoins}
          />
        )}

        {activeGame === 'wheel' && (
          <ParkWheelGame
            onBack={() => setActiveGame('hub')}
            onAddCoins={addCoins}
            onOpenSurveyForAttraction={onOpenSurveyForAttraction}
          />
        )}
      </div>
    </main>
  );
};

// ==========================================
// 1. GAME HUB (SELECTION SCREEN)
// ==========================================
interface GameHubMenuProps {
  onSelectGame: (game: ActiveGame) => void;
  onOpenWaitTimes: () => void;
}

const GameHubMenu: React.FC<GameHubMenuProps> = ({ onSelectGame, onOpenWaitTimes }) => {
  const gamesList = [
    {
      id: 'quiz' as ActiveGame,
      title: 'Gran Quiz de PortAventura',
      subtitle: '¿Cuánto sabes de los 7 mundos?',
      description: 'Preguntas con niveles, curiosidades de Shambhala, Dragon Khan, velocidades récord y modo grupo "Pasa el móvil".',
      icon: '🏆',
      badge: 'Multijugador / Solitario',
      badgeColor: 'bg-[#E64A38]',
      gradient: 'from-[#E64A38] to-[#D63031]',
      players: '1 a 4 Jugadores',
      time: '3-5 min',
    },
    {
      id: 'reflex' as ActiveGame,
      title: 'Cazador de Velocidad (Reflex Tap)',
      subtitle: 'Frena el tren en el punto exacto',
      description: 'Un juego arcade vertiginoso donde debes calcular el momento exacto en el que el tren entra al bucle a toda velocidad.',
      icon: '⚡',
      badge: 'Reflejos & Récord',
      badgeColor: 'bg-[#0284C7]',
      gradient: 'from-[#0284C7] to-[#0369A1]',
      players: '1 Jugador',
      time: '1-2 min',
    },
    {
      id: 'memory' as ActiveGame,
      title: 'Memory de los 7 Mundos',
      subtitle: 'Encuentra las parejas temáticas',
      description: 'Encuentra las parejas de colosos y mundos temáticos antes de que se agote el tiempo de la cola.',
      icon: '🧩',
      badge: 'Clásico & Familiar',
      badgeColor: 'bg-[#81B29A]',
      gradient: 'from-[#81B29A] to-[#679B82]',
      players: 'Todos los públicos',
      time: '2-3 min',
    },
    {
      id: 'wheel' as ActiveGame,
      title: 'Ruleta Mágica & Retos de Cola',
      subtitle: 'Decide tu próxima atracción o supera retos',
      description: '¿Indecisos? Gira la ruleta para elegir la siguiente montaña rusa o realiza divertidos retos en grupo mientras esperas.',
      icon: '🎡',
      badge: 'Sorteo & Retos',
      badgeColor: 'bg-[#F7B731] text-[#2A1845]',
      gradient: 'from-[#F7B731] to-[#FFA801]',
      players: 'Ideal para grupos',
      time: 'Instantáneo',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Navigation to Wait Times */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-3xl border-2 border-[#F0E2D4] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF0E5] text-[#E64A38] flex items-center justify-center text-lg">
            ⏱️
          </div>
          <div>
            <div className="text-xs font-serif font-black text-[#2A1845]">¿Quieres saber cuánto falta para tu atracción?</div>
            <p className="text-[11px] text-[#2A1845]/70">Consulta los minutos exactos en el panel en directo.</p>
          </div>
        </div>
        <button
          onClick={onOpenWaitTimes}
          className="px-4 py-2 bg-[#2A1845] hover:bg-[#E64A38] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
        >
          Ver Tiempos de Espera
        </button>
      </div>

      {/* Games Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gamesList.map((game) => (
          <article
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className="bg-white border-2 border-[#F0E2D4] hover:border-[#E64A38] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-wider ${game.badgeColor}`}>
                  {game.badge}
                </span>
                <div className="flex items-center gap-3 text-xs text-[#2A1845]/60 font-medium">
                  <span>👥 {game.players}</span>
                  <span>⏳ {game.time}</span>
                </div>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] group-hover:scale-110 group-hover:bg-[#FFF0E5] text-3xl flex items-center justify-center shadow-xs transition-all shrink-0">
                  {game.icon}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A1845] group-hover:text-[#E64A38] transition-colors">
                    {game.title}
                  </h3>
                  <div className="text-xs font-bold text-[#E64A38] mt-0.5">{game.subtitle}</div>
                </div>
              </div>

              <p className="text-xs text-[#2A1845]/75 font-light leading-relaxed mb-6">
                {game.description}
              </p>
            </div>

            {/* Launch Button */}
            <div className="pt-4 border-t border-[#F0E2D4] flex items-center justify-between">
              <span className="text-xs font-bold text-[#2A1845]/60 group-hover:text-[#2A1845]">
                Toca para empezar
              </span>
              <button
                id={`btn-play-${game.id}`}
                className="px-5 py-2.5 rounded-full bg-[#E64A38] group-hover:bg-[#D63031] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#E64A38]/20 group-hover:translate-x-1 transition-all"
              >
                <span>¡Jugar Ahora!</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. QUIZ & TRIVIA GAME
// ==========================================
interface QuizGameProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ onBack, onAddCoins }) => {
  const [mode, setMode] = useState<'single' | 'passphone'>('single');
  const [players, setPlayers] = useState<string[]>(['Jugador 1', 'Jugador 2']);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerScores, setPlayerScores] = useState<Record<string, number>>({
    'Jugador 1': 0,
    'Jugador 2': 0,
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize random batch of 8 questions
  useEffect(() => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 8);
    setQuestions(shuffled);
  }, []);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      playSuccessSound();
      const pointsWon = currentQ.points + streak * 20;
      setScore((s) => s + pointsWon);
      setStreak((st) => st + 1);
      onAddCoins(pointsWon);

      if (mode === 'passphone') {
        const pName = players[currentPlayerIndex];
        setPlayerScores((ps) => ({
          ...ps,
          [pName]: (ps[pName] || 0) + pointsWon,
        }));
      }
    } else {
      playErrorSound();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsFinished(true);
      playCompleteSound();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } else {
      playNextSound();
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      if (mode === 'passphone') {
        setCurrentPlayerIndex((p) => (p + 1) % players.length);
      }
    }
  };

  const handleRestart = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 8);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
  };

  if (!currentQ) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all flex items-center gap-1.5"
        >
          ← Volver a Juegos
        </button>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-[#F0E2D4]">
          <button
            onClick={() => setMode('single')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              mode === 'single' ? 'bg-[#E64A38] text-white shadow-xs' : 'text-[#2A1845]/70'
            }`}
          >
            Modo 1 Jugador
          </button>
          <button
            onClick={() => setMode('passphone')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              mode === 'passphone' ? 'bg-[#E64A38] text-white shadow-xs' : 'text-[#2A1845]/70'
            }`}
          >
            👥 Pasa el Móvil en Cola
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white border-2 border-[#E64A38] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          {/* Progress & Current Turn */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E64A38] text-white text-[10px] font-black uppercase">
                Pregunta {currentIndex + 1} de {questions.length}
              </span>
              <span className="text-xs font-bold text-[#81B29A]">
                {currentQ.funFactBadge}
              </span>
            </div>

            {mode === 'passphone' ? (
              <div className="px-3 py-1 rounded-full bg-[#FFF0E5] border border-[#E64A38]/30 text-[#E64A38] text-xs font-bold">
                Turno de: <strong>{players[currentPlayerIndex]}</strong>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-[#2A1845]">
                <span>Puntos: <strong className="text-[#E64A38]">{score}</strong></span>
                {streak > 1 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#F7B731] text-[#2A1845] text-[10px] font-black">
                    🔥 x{streak}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Question Text */}
          <div className="my-6">
            <div className="text-xs font-bold text-[#38A3A5] uppercase tracking-wider mb-1">
              Zona: {AREAS[currentQ.areaId]?.name}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#2A1845] leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
            {currentQ.options.map((opt, idx) => {
              let btnClass = 'bg-[#FFF9F3] border-[#F0E2D4] text-[#2A1845] hover:border-[#E64A38]';
              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  btnClass = 'bg-[#81B29A] border-[#81B29A] text-white font-bold shadow-md';
                } else if (idx === selectedOption) {
                  btnClass = 'bg-[#E64A38] border-[#E64A38] text-white font-bold';
                } else {
                  btnClass = 'bg-gray-100 border-gray-200 text-gray-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2 shadow-2xs ${btnClass}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 shrink-0 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box when Answered */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-[#FFF0E5] border border-[#E64A38]/30 mb-6 animate-in fade-in duration-200">
              <div className="text-xs font-bold text-[#E64A38] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>💡 Dato Oficial del Parque</span>
              </div>
              <p className="text-xs text-[#2A1845]/90 font-light leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Question CTA */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full py-4 bg-gradient-to-r from-[#E64A38] to-[#D63031] text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{currentIndex + 1 >= questions.length ? 'Ver Resultados de la Partida' : 'Siguiente Pregunta'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      ) : (
        /* Victory Finished Card */
        <div className="bg-white border-2 border-[#E64A38] rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#F7B731] to-[#FFA801] text-[#2A1845] flex items-center justify-center text-4xl mx-auto shadow-lg">
            🏆
          </div>
          <div>
            <h2 className="text-3xl font-serif font-black text-[#2A1845]">¡Fin del Quiz de la Cola!</h2>
            <p className="text-xs text-[#2A1845]/70 mt-1">Has demostrado tus conocimientos sobre las leyendas de PortAventura World.</p>
          </div>

          {mode === 'passphone' ? (
            <div className="max-w-md mx-auto bg-[#FFF9F3] p-4 rounded-2xl border border-[#F0E2D4] space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#2A1845]/70">Puntuaciones del Grupo:</div>
              {Object.entries(playerScores).map(([name, pts]) => (
                <div key={name} className="flex items-center justify-between p-2.5 bg-white rounded-xl font-bold text-xs">
                  <span>{name}</span>
                  <span className="text-[#E64A38] font-black">{pts} pts</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="inline-block px-6 py-3 rounded-2xl bg-[#FFF0E5] border border-[#E64A38]/30">
              <div className="text-xs font-bold text-[#E64A38] uppercase">Puntuación Final</div>
              <div className="text-3xl font-black font-serif text-[#2A1845]">{score} pts</div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleRestart}
              className="px-8 py-3.5 bg-[#E64A38] hover:bg-[#D63031] text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-md"
            >
              Jugar Otra Ronda
            </button>
            <button
              onClick={onBack}
              className="px-8 py-3.5 bg-[#FFF9F3] text-[#2A1845] border border-[#F0E2D4] rounded-full font-bold uppercase tracking-wider text-xs"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. REFLEX SPEED TAP GAME
// ==========================================
interface ReflexTapGameProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

const ReflexTapGame: React.FC<ReflexTapGameProps> = ({ onBack, onAddCoins }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trainPos, setTrainPos] = useState(0); // 0 to 100%
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const reqRef = useRef<number | null>(null);
  const speedRef = useRef(1.2);
  const posRef = useRef(0);
  const movingForwardRef = useRef(true);

  // Target drop zone is between 45% and 55%
  const TARGET_MIN = 45;
  const TARGET_MAX = 55;

  const startRound = (r = 1) => {
    setIsPlaying(true);
    setRound(r);
    setFeedback(null);
    posRef.current = 0;
    speedRef.current = 0.8 + r * 0.35; // gets faster each round
    movingForwardRef.current = true;

    const loop = () => {
      if (movingForwardRef.current) {
        posRef.current += speedRef.current;
        if (posRef.current >= 100) {
          posRef.current = 100;
          movingForwardRef.current = false;
        }
      } else {
        posRef.current -= speedRef.current;
        if (posRef.current <= 0) {
          posRef.current = 0;
          movingForwardRef.current = true;
        }
      }
      setTrainPos(posRef.current);
      reqRef.current = requestAnimationFrame(loop);
    };

    reqRef.current = requestAnimationFrame(loop);
  };

  const handleTap = () => {
    if (!isPlaying) return;
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    setIsPlaying(false);

    const pos = posRef.current;
    let points = 0;
    let text = '';

    if (pos >= 48 && pos <= 52) {
      points = 100;
      text = '🎯 ¡PERFECTO EN EL DROP! +100pts';
      playSuccessSound();
    } else if (pos >= TARGET_MIN && pos <= TARGET_MAX) {
      points = 60;
      text = '⚡ ¡EXCELENTE REFLEJO! +60pts';
      playSuccessSound();
    } else if (pos >= 35 && pos <= 65) {
      points = 25;
      text = '👍 ¡CASI! +25pts';
      playTickSound();
    } else {
      points = 0;
      text = '❌ ¡DEMASIADO PRONTO/TARDE!';
      playErrorSound();
    }

    setScore((s) => s + points);
    onAddCoins(points);
    setFeedback(text);

    if (round >= 5) {
      setTimeout(() => {
        setIsGameOver(true);
        playCompleteSound();
        confetti({ particleCount: 70, spread: 60 });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all"
        >
          ← Volver a Juegos
        </button>
        <div className="text-xs font-bold text-[#2A1845]">
          Puntos: <strong className="text-[#E64A38] text-sm">{score}</strong> (Ronda {round}/5)
        </div>
      </div>

      <div className="bg-white border-2 border-[#0284C7] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white text-[10px] font-black uppercase tracking-wider">
            Arcade de Reflejos
          </span>
          <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
            Cazador del Bucle Vertical
          </h2>
          <p className="text-xs text-[#2A1845]/70 font-light max-w-md mx-auto mt-1">
            Toca el botón cuando el tren esté exactamente en el centro de la zona verde (el Drop de Shambhala).
          </p>
        </div>

        {/* Track Canvas / Slider */}
        <div className="relative h-24 bg-[#2A1845] rounded-3xl overflow-hidden border-4 border-[#0284C7]/40 shadow-inner flex items-center">
          {/* Target Zone */}
          <div
            className="absolute top-0 bottom-0 bg-[#81B29A]/80 border-x-2 border-white/60 flex items-center justify-center"
            style={{ left: `${TARGET_MIN}%`, width: `${TARGET_MAX - TARGET_MIN}%` }}
          >
            <span className="text-[10px] text-white font-black uppercase tracking-widest rotate-90">
              DROP
            </span>
          </div>

          {/* Coaster Train */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform"
            style={{ left: `${trainPos}%` }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E64A38] to-[#F7B731] border-2 border-white text-white flex items-center justify-center text-xl shadow-lg">
              🎢
            </div>
          </div>
        </div>

        {/* Feedback text */}
        {feedback && (
          <div className="text-sm font-bold text-[#2A1845] bg-[#FFF0E5] py-2 px-4 rounded-xl border border-[#E64A38]/20 animate-bounce">
            {feedback}
          </div>
        )}

        {/* Action Button */}
        {!isGameOver ? (
          <div>
            {isPlaying ? (
              <button
                id="btn-tap-drop"
                onClick={handleTap}
                className="w-full py-6 bg-gradient-to-r from-[#E64A38] to-[#D63031] text-white rounded-3xl font-black text-xl tracking-wider uppercase shadow-xl hover:scale-102 active:scale-95 transition-all border-4 border-white"
              >
                ¡FRENAR EN EL DROP!
              </button>
            ) : (
              <button
                onClick={() => startRound(round + (feedback ? 1 : 0))}
                className="px-8 py-4 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-full font-bold text-sm uppercase tracking-wider shadow-md active:scale-95"
              >
                {round === 1 && !feedback ? '¡Iniciar Ronda 1!' : 'Siguiente Ronda'}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 pt-4 border-t border-[#F0E2D4]">
            <h3 className="text-2xl font-serif font-black text-[#2A1845]">¡Partida Terminada!</h3>
            <div className="text-sm font-bold text-[#E64A38]">Puntuación Total: {score} pts</div>
            <button
              onClick={() => {
                setScore(0);
                setIsGameOver(false);
                startRound(1);
              }}
              className="px-8 py-3 bg-[#E64A38] text-white rounded-full font-bold text-xs uppercase tracking-wider"
            >
              Volver a Jugar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. MEMORY MATCH GAME
// ==========================================
interface MemoryGameProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

interface MemoryCard {
  id: number;
  icon: string;
  name: string;
  matched: boolean;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack, onAddCoins }) => {
  const PAIRS = [
    { icon: '🐉', name: 'Dragon Khan' },
    { icon: '🏔️', name: 'Shambhala' },
    { icon: '🌋', name: 'Tutuki Splash' },
    { icon: '🏎️', name: 'Red Force' },
    { icon: '🤠', name: 'Stampida' },
    { icon: '🗿', name: 'Hurakan Condor' },
  ];

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    const deck: MemoryCard[] = [];
    PAIRS.forEach((item, idx) => {
      deck.push({ id: idx * 2, icon: item.icon, name: item.name, matched: false });
      deck.push({ id: idx * 2 + 1, icon: item.icon, name: item.name, matched: false });
    });
    setCards(deck.sort(() => 0.5 - Math.random()));
    setFlipped([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || cards[index].matched || flipped.includes(index)) return;

    playTickSound();
    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      if (cards[firstIdx].name === cards[secondIdx].name) {
        // Match!
        playSuccessSound();
        setCards((prev) =>
          prev.map((c, i) => (i === firstIdx || i === secondIdx ? { ...c, matched: true } : c))
        );
        setFlipped([]);
        onAddCoins(30);

        // Check if all matched
        setTimeout(() => {
          setCards((current) => {
            const allMatched = current.every((c) => c.matched);
            if (allMatched) {
              setIsWon(true);
              playCompleteSound();
              confetti({ particleCount: 70, spread: 60 });
            }
            return current;
          });
        }, 300);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 900);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all"
        >
          ← Volver a Juegos
        </button>
        <div className="text-xs font-bold text-[#2A1845]">
          Movimientos: <strong className="text-[#E64A38] text-sm">{moves}</strong>
        </div>
      </div>

      <div className="bg-white border-2 border-[#81B29A] rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-center">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#81B29A] text-white text-[10px] font-black uppercase tracking-wider">
            Memoria Temática
          </span>
          <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
            Parejas de los 7 Mundos
          </h2>
          <p className="text-xs text-[#2A1845]/70 font-light">
            Encuentra las 6 parejas de atracciones emblemáticas de PortAventura World.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 max-w-lg mx-auto">
          {cards.map((card, idx) => {
            const isCardFlipped = flipped.includes(idx) || card.matched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`h-24 sm:h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all transform ${
                  isCardFlipped
                    ? 'bg-[#FFF0E5] border-[#E64A38] rotate-0 shadow-md'
                    : 'bg-[#2A1845] border-white/40 hover:bg-[#3B2260] shadow-xs'
                }`}
              >
                {isCardFlipped ? (
                  <>
                    <div className="text-3xl mb-1">{card.icon}</div>
                    <div className="text-[10px] font-bold text-[#2A1845] truncate w-full text-center">
                      {card.name}
                    </div>
                  </>
                ) : (
                  <span className="text-xl opacity-40 text-white font-serif">🎡</span>
                )}
              </button>
            );
          })}
        </div>

        {isWon && (
          <div className="p-4 bg-[#81B29A]/10 border border-[#81B29A] rounded-2xl space-y-3">
            <h3 className="text-lg font-serif font-black text-[#2A1845]">
              ¡Enhorabuena! Has resuelto el tablero en {moves} movimientos.
            </h3>
            <button
              onClick={initGame}
              className="px-6 py-2.5 bg-[#81B29A] text-white rounded-full text-xs font-bold uppercase tracking-wider"
            >
              Jugar de Nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. WHEEL OF FORTUNE & QUEUE CHALLENGES
// ==========================================
interface ParkWheelGameProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
  onOpenSurveyForAttraction: (attractionId: string) => void;
}

const ParkWheelGame: React.FC<ParkWheelGameProps> = ({
  onBack,
  onAddCoins,
  onOpenSurveyForAttraction,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedResult, setSelectedResult] = useState<typeof WHEEL_CHOICES[0] | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<typeof QUEUE_CHALLENGES[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'wheel' | 'challenges'>('wheel');

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedResult(null);

    // Audio tick sound
    const tickInterval = setInterval(() => {
      playSpinTickSound();
    }, 120);

    const randomDegrees = Math.floor(1800 + Math.random() * 1440); // 5+ full turns
    const nextRot = rotation + randomDegrees;
    setRotation(nextRot);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      const sliceSize = 360 / WHEEL_CHOICES.length;
      const normalizedDegree = (nextRot % 360);
      const chosenIndex = Math.floor(((360 - normalizedDegree + sliceSize / 2) % 360) / sliceSize);
      const result = WHEEL_CHOICES[chosenIndex % WHEEL_CHOICES.length];
      setSelectedResult(result);
      playSuccessSound();
      onAddCoins(50);
      confetti({ particleCount: 60, spread: 50 });
    }, 3500);
  };

  const drawRandomChallenge = () => {
    playTickSound();
    const shuffled = [...QUEUE_CHALLENGES].sort(() => 0.5 - Math.random());
    setSelectedChallenge(shuffled[0]);
    onAddCoins(30);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all"
        >
          ← Volver a Juegos
        </button>

        {/* Tab Switch */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#F0E2D4]">
          <button
            onClick={() => setActiveTab('wheel')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wheel' ? 'bg-[#F7B731] text-[#2A1845] shadow-xs' : 'text-[#2A1845]/70'
            }`}
          >
            🎡 Ruleta de Atracción
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'challenges' ? 'bg-[#E64A38] text-white shadow-xs' : 'text-[#2A1845]/70'
            }`}
          >
            🎭 Retos de Cola
          </button>
        </div>
      </div>

      {activeTab === 'wheel' ? (
        <div className="bg-white border-2 border-[#F7B731] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#F7B731] text-[#2A1845] text-[10px] font-black uppercase tracking-wider">
              Decisor Mágico
            </span>
            <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
              ¿A qué atracción vamos ahora?
            </h2>
            <p className="text-xs text-[#2A1845]/70 font-light">
              Gira la ruleta y deja que el destino del parque elija vuestra próxima aventura.
            </p>
          </div>

          {/* Visual Wheel Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-4">
            {/* Top Pointer Needle */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-8 bg-[#E64A38] text-white flex items-center justify-center font-bold text-xs clip-triangle shadow-md" />

            {/* Rotating SVG Wheel */}
            <div
              className="w-full h-full rounded-full border-8 border-[#2A1845] overflow-hidden shadow-xl transition-transform duration-[3500ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {WHEEL_CHOICES.map((choice, i) => {
                  const angle = 360 / WHEEL_CHOICES.length;
                  const startAngle = i * angle;
                  const endAngle = (i + 1) * angle;
                  const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  return (
                    <g key={choice.id}>
                      <path d={pathData} fill={choice.color} stroke="#FFFFFF" strokeWidth="1" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Center Logo Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#2A1845] border-4 border-white text-white flex items-center justify-center text-xl shadow-md z-10">
              🎡
            </div>
          </div>

          {/* Spin CTA */}
          <button
            id="btn-spin-wheel"
            onClick={spinWheel}
            disabled={isSpinning}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#F7B731] to-[#FFA801] hover:from-[#FFA801] hover:to-[#F7B731] text-[#2A1845] font-black text-sm uppercase tracking-widest rounded-full shadow-lg active:scale-95 disabled:opacity-50 transition-all"
          >
            {isSpinning ? '¡Girando la Ruleta...!' : '¡GIRAR LA RULETA!'}
          </button>

          {/* Result Card */}
          {selectedResult && (
            <div className="p-5 rounded-3xl bg-[#FFF9F3] border-2 border-[#E64A38] text-left space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E64A38] text-white text-[10px] font-black uppercase">
                  Resultado de la Suerte
                </span>
                <span className="text-xs font-bold text-[#F7B731]">¡Destino Elegido!</span>
              </div>
              <h3 className="text-2xl font-serif font-black text-[#2A1845]">
                {selectedResult.label}
              </h3>
              <p className="text-xs text-[#2A1845]/80 font-light">
                {selectedResult.description}
              </p>
              {selectedResult.attractionId && (
                <button
                  onClick={() => onOpenSurveyForAttraction(selectedResult.attractionId!)}
                  className="w-full py-3 bg-[#2A1845] hover:bg-[#E64A38] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>¡Abrir Encuesta de {selectedResult.label}!</span>
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Queue Challenges Tab */
        <div className="bg-white border-2 border-[#E64A38] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#E64A38] text-white text-[10px] font-black uppercase tracking-wider">
              Pasatiempo en Grupo
            </span>
            <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
              Retos Divertidos de Cola
            </h2>
            <p className="text-xs text-[#2A1845]/70 font-light">
              Saca una carta de reto y pon a prueba a tus acompañantes en la fila.
            </p>
          </div>

          <button
            onClick={drawRandomChallenge}
            className="px-8 py-4 bg-[#E64A38] hover:bg-[#D63031] text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-md active:scale-95"
          >
            🎲 Sacar Nuevo Reto
          </button>

          {selectedChallenge && (
            <div className="p-6 rounded-3xl bg-[#FFF0E5] border-2 border-[#E64A38] text-left space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2A1845] text-white text-[10px] font-bold uppercase">
                  Categoría: {selectedChallenge.category}
                </span>
                <span className="text-xs font-black text-[#E64A38]">+{selectedChallenge.rewardPoints} pts</span>
              </div>
              <h3 className="text-xl font-serif font-black text-[#2A1845]">
                {selectedChallenge.title}
              </h3>
              <p className="text-sm text-[#2A1845]/90 leading-relaxed font-light">
                {selectedChallenge.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
