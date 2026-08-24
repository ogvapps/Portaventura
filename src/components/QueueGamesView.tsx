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
  Scale,
  Timer,
  MessageSquare,
  HelpCircle as QuestionIcon,
  Search,
  Swords,
  Grid,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  QUIZ_QUESTIONS,
  QUEUE_CHALLENGES,
  WHEEL_CHOICES,
  HEIGHT_DUEL_CARDS,
  WORD_CHAIN_PROMPTS,
  GUESS_NUMBER_ITEMS,
  TRUTH_OR_LIE_SETS,
  COASTER_PERSONALITIES,
  COASTER_RIDDLES,
  QuizQuestion,
} from '../data/queueGames';
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

export type ActiveGame =
  | 'hub'
  | 'quiz'
  | 'reflex'
  | 'memory'
  | 'wheel'
  | 'height-duel'
  | 'blind-timer'
  | 'word-chain'
  | 'guess-number'
  | 'truth-or-lie'
  | 'tic-tac-toe'
  | 'coaster-personality'
  | 'coaster-riddles'
  | 'reaction-duel'
  | 'rock-paper-coaster';

export const QueueGamesView: React.FC<QueueGamesViewProps> = ({
  onOpenSurveyForAttraction,
  onOpenWaitTimes,
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('hub');
  const [gameFilter, setGameFilter] = useState<'all' | 'solo' | 'group'>('all');

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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#E64A38] text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Zona Recreativa PortAventura</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F7B731] text-[#2A1845] text-[10px] font-black uppercase">
                  14 Minijuegos en Cola
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white">
                Pasatiempos & Minijuegos de Cola
              </h1>
              <p className="text-sm text-white/80 font-light max-w-2xl">
                Haz que la espera pase volando: compite en el gran Quiz, pon a prueba tus reflejos en el drop, bate a tus amigos en duelos de pantalla dividida o descubre qué montaña rusa eres.
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
            filter={gameFilter}
            onSetFilter={setGameFilter}
            onSelectGame={(game) => {
              setActiveGame(game);
              playNextSound();
            }}
            onOpenWaitTimes={onOpenWaitTimes}
          />
        )}

        {activeGame === 'quiz' && (
          <QuizGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}

        {activeGame === 'reflex' && (
          <ReflexTapGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}

        {activeGame === 'memory' && (
          <MemoryGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}

        {activeGame === 'wheel' && (
          <ParkWheelGame
            onBack={() => setActiveGame('hub')}
            onAddCoins={addCoins}
            onOpenSurveyForAttraction={onOpenSurveyForAttraction}
          />
        )}

        {/* 10 NUEVOS JUEGOS */}
        {activeGame === 'height-duel' && (
          <HeightDuelGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}

        {activeGame === 'blind-timer' && (
          <BlindTimerGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}

        {activeGame === 'word-chain' && (
          <WordChainGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}

        {activeGame === 'guess-number' && (
          <GuessNumberGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}

        {activeGame === 'truth-or-lie' && (
          <TruthOrLieGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}

        {activeGame === 'tic-tac-toe' && (
          <TicTacToeGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}

        {activeGame === 'coaster-personality' && (
          <CoasterPersonalityGame
            onBack={() => setActiveGame('hub')}
            onAddCoins={addCoins}
            onOpenSurveyForAttraction={onOpenSurveyForAttraction}
          />
        )}

        {activeGame === 'coaster-riddles' && (
          <CoasterRiddlesGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}

        {activeGame === 'reaction-duel' && (
          <ReactionDuelGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}

        {activeGame === 'rock-paper-coaster' && (
          <RockPaperCoasterGame onBack={() => setActiveGame('hub')} onAddCoins={addCoins} />
        )}
      </div>
    </main>
  );
};

// ==========================================
// 1. GAME HUB (SELECTION SCREEN CON 14 JUEGOS)
// ==========================================
interface GameHubMenuProps {
  filter: 'all' | 'solo' | 'group';
  onSetFilter: (f: 'all' | 'solo' | 'group') => void;
  onSelectGame: (game: ActiveGame) => void;
  onOpenWaitTimes: () => void;
}

const GameHubMenu: React.FC<GameHubMenuProps> = ({
  filter,
  onSetFilter,
  onSelectGame,
  onOpenWaitTimes,
}) => {
  const gamesList: Array<{
    id: ActiveGame;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    badge: string;
    badgeColor: string;
    players: string;
    time: string;
    isGroup: boolean;
  }> = [
    {
      id: 'quiz',
      title: 'Gran Quiz de PortAventura',
      subtitle: '¿Cuánto sabes de los 7 mundos?',
      description: 'Preguntas con niveles, curiosidades de Shambhala, Dragon Khan, récords y modo "Pasa el móvil".',
      icon: '🏆',
      badge: 'Multijugador / Solitario',
      badgeColor: 'bg-[#E64A38]',
      players: '1 a 4 Jugadores',
      time: '3-5 min',
      isGroup: true,
    },
    {
      id: 'height-duel',
      title: '¿Quién es más Alta?',
      subtitle: 'Duelo de Alturas de Atracciones',
      description: 'Compara dos atracciones emblemáticas y adivina cuál tiene mayor altura o caída libre.',
      icon: '📏',
      badge: 'Rápido & Dinámico',
      badgeColor: 'bg-[#0284C7]',
      players: '1 o más Jugadores',
      time: '1-2 min',
      isGroup: false,
    },
    {
      id: 'blind-timer',
      title: 'Cronómetro Ciego (10.00s)',
      subtitle: 'Detén el tiempo en el instante exacto',
      description: 'Inicia el cronómetro y frena sin ver la pantalla exactamente en 10 segundos. ¿Quién clava el tiempo?',
      icon: '⏱️',
      badge: 'Precisión & Pasa Móvil',
      badgeColor: 'bg-[#9333EA]',
      players: '1 a 5 Jugadores',
      time: '1 min',
      isGroup: true,
    },
    {
      id: 'word-chain',
      title: 'Bomba de Palabras de la Cola',
      subtitle: 'Cadena temático-frenética',
      description: 'La bomba corre: pasa el móvil nombrando elementos de PortAventura antes de que explote.',
      icon: '💣',
      badge: 'Para Grupos',
      badgeColor: 'bg-[#D97706]',
      players: '2 a 6 Jugadores',
      time: '2-3 min',
      isGroup: true,
    },
    {
      id: 'guess-number',
      title: 'Adivina la Cifra Récord',
      subtitle: 'Estimación de velocidades y toneladas',
      description: '¿Cuántas toneladas de madera tiene Stampida? ¿A qué velocidad va Furius Baco? Ajusta el dial y acércate a la cifra.',
      icon: '🎯',
      badge: 'Estimación & Datos',
      badgeColor: 'bg-[#059669]',
      players: 'Todos los públicos',
      time: '2 min',
      isGroup: false,
    },
    {
      id: 'truth-or-lie',
      title: '2 Verdades y 1 Mentira',
      subtitle: 'Caza el mito falso de PortAventura',
      description: 'Descubre cuál de las 3 afirmaciones sobre las atracciones y leyendas del parque es completamente falsa.',
      icon: '🕵️',
      badge: 'Detective de Atracciones',
      badgeColor: 'bg-[#DC2626]',
      players: '1 a 4 Jugadores',
      time: '2-3 min',
      isGroup: true,
    },
    {
      id: 'reaction-duel',
      title: 'Duelo de Reflejos (2 Jugadores)',
      subtitle: 'Tap de pantalla dividida frente a frente',
      description: 'Dos jugadores sujetan el móvil: cuando la señal cambie a verde ¡toca más rápido que tu rival!',
      icon: '⚡',
      badge: 'Duelo 1 vs 1 en Vivo',
      badgeColor: 'bg-[#E11D48]',
      players: '2 Jugadores',
      time: '1 min',
      isGroup: true,
    },
    {
      id: 'coaster-personality',
      title: '¿Qué Montaña Rusa Eres Hoy?',
      subtitle: 'Test de personalidad instantáneo',
      description: 'Responde 4 preguntas rápidas y descubre qué coloso de PortAventura encaja con tu vibra del día.',
      icon: '✨',
      badge: 'Test & Compartir',
      badgeColor: 'bg-[#7C3AED]',
      players: '1 Jugador',
      time: '1-2 min',
      isGroup: false,
    },
    {
      id: 'coaster-riddles',
      title: 'Adivina la Atracción por Pistas',
      subtitle: 'Siluetas y acertijos en 3 pistas',
      description: 'Desbloquea hasta 3 pistas para descubrir de qué atracción secreta se trata antes de que se acabe el tiempo.',
      icon: '🧩',
      badge: 'Acertijos & Pistas',
      badgeColor: 'bg-[#0891B2]',
      players: '1 a 3 Jugadores',
      time: '2 min',
      isGroup: true,
    },
    {
      id: 'tic-tac-toe',
      title: 'Tres en Raya: Dragón vs Cóndor',
      subtitle: 'Duelo clásico en el móvil',
      description: 'Elige tu bando (Dragon Khan 🐉 o Hurakan Condor 🗿) y desafía a tu acompañante en la fila.',
      icon: '❌',
      badge: 'Estrategia 1 vs 1',
      badgeColor: 'bg-[#2A1845]',
      players: '2 Jugadores',
      time: '1-2 min',
      isGroup: true,
    },
    {
      id: 'rock-paper-coaster',
      title: 'Piedra, Papel o Montaña Rusa',
      subtitle: 'Versión extrema del clásico juego',
      description: 'Shambhala aplasta el Agua, el Agua frena a Furius Baco, y Furius Baco supera a Shambhala. ¡Desafía a la máquina o a un amigo!',
      icon: '✊',
      badge: 'Partidas Rápidas',
      badgeColor: 'bg-[#EA580C]',
      players: '1 o 2 Jugadores',
      time: '1 min',
      isGroup: true,
    },
    {
      id: 'reflex',
      title: 'Cazador de Velocidad (Reflex Tap)',
      subtitle: 'Frena el tren en el punto exacto',
      description: 'Un juego arcade vertiginoso donde debes calcular el momento exacto en el que el tren entra al bucle a toda velocidad.',
      icon: '🎢',
      badge: 'Reflejos & Récord',
      badgeColor: 'bg-[#0284C7]',
      players: '1 Jugador',
      time: '1-2 min',
      isGroup: false,
    },
    {
      id: 'memory',
      title: 'Memory de los 7 Mundos',
      subtitle: 'Encuentra las parejas temáticas',
      description: 'Encuentra las parejas de colosos y mundos temáticos antes de que se agote el tiempo de la cola.',
      icon: '🎴',
      badge: 'Clásico & Familiar',
      badgeColor: 'bg-[#81B29A]',
      players: 'Todos los públicos',
      time: '2-3 min',
      isGroup: false,
    },
    {
      id: 'wheel',
      title: 'Ruleta Mágica & Retos de Cola',
      subtitle: 'Decide tu próxima atracción o supera retos',
      description: '¿Indecisos? Gira la ruleta para elegir la siguiente montaña rusa o realiza divertidos retos en grupo mientras esperas.',
      icon: '🎡',
      badge: 'Sorteo & Retos',
      badgeColor: 'bg-[#F7B731] text-[#2A1845]',
      players: 'Ideal para grupos',
      time: 'Instantáneo',
      isGroup: true,
    },
  ];

  const filteredGames = gamesList.filter((g) => {
    if (filter === 'solo') return !g.isGroup;
    if (filter === 'group') return g.isGroup;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Quick Navigation to Wait Times */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 sm:p-5 rounded-3xl border-2 border-[#F0E2D4] shadow-xs gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF0E5] text-[#E64A38] flex items-center justify-center text-lg shrink-0">
            ⏱️
          </div>
          <div>
            <div className="text-xs font-serif font-black text-[#2A1845]">¿Quieres saber cuánto falta para tu atracción?</div>
            <p className="text-[11px] text-[#2A1845]/70">Consulta los minutos exactos en directo con el monitor de PAFANS.</p>
          </div>
        </div>
        <button
          onClick={onOpenWaitTimes}
          className="px-4 py-2 bg-[#2A1845] hover:bg-[#E64A38] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
        >
          Ver Tiempos de Espera
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#F0E2D4] shadow-2xs">
          <button
            onClick={() => onSetFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-[#E64A38] text-white shadow-xs' : 'text-[#2A1845]/70 hover:text-[#2A1845]'
            }`}
          >
            Todos los Juegos ({gamesList.length})
          </button>
          <button
            onClick={() => onSetFilter('group')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'group' ? 'bg-[#E64A38] text-white shadow-xs' : 'text-[#2A1845]/70 hover:text-[#2A1845]'
            }`}
          >
            👥 En Grupo / Pasa Móvil
          </button>
          <button
            onClick={() => onSetFilter('solo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'solo' ? 'bg-[#E64A38] text-white shadow-xs' : 'text-[#2A1845]/70 hover:text-[#2A1845]'
            }`}
          >
            👤 1 Jugador
          </button>
        </div>

        <span className="text-xs text-[#2A1845]/60 font-medium">
          Mostrando {filteredGames.length} pasatiempos
        </span>
      </div>

      {/* Games Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map((game) => (
          <article
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className="bg-white border-2 border-[#F0E2D4] hover:border-[#E64A38] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase tracking-wider ${game.badgeColor}`}>
                  {game.badge}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-[#2A1845]/60 font-medium">
                  <span>{game.players}</span>
                </div>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3.5 mb-2.5">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] group-hover:scale-110 group-hover:bg-[#FFF0E5] text-2xl flex items-center justify-center shadow-xs transition-all shrink-0">
                  {game.icon}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-black text-[#2A1845] group-hover:text-[#E64A38] transition-colors leading-tight">
                    {game.title}
                  </h3>
                  <div className="text-[11px] font-bold text-[#E64A38] mt-0.5">{game.subtitle}</div>
                </div>
              </div>

              <p className="text-xs text-[#2A1845]/75 font-light leading-relaxed mb-4">
                {game.description}
              </p>
            </div>

            {/* Launch Button */}
            <div className="pt-3 border-t border-[#F0E2D4] flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#2A1845]/50 group-hover:text-[#2A1845]">
                ⏱️ {game.time}
              </span>
              <button
                id={`btn-play-${game.id}`}
                className="px-3.5 py-1.5 rounded-full bg-[#E64A38] group-hover:bg-[#D63031] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-md shadow-[#E64A38]/20 group-hover:translate-x-1 transition-all"
              >
                <span>¡Jugar!</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
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
  const [players] = useState<string[]>(['Jugador 1', 'Jugador 2']);
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
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all flex items-center gap-1.5"
        >
          ← Volver a Juegos
        </button>

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

          <div className="my-6">
            <div className="text-xs font-bold text-[#38A3A5] uppercase tracking-wider mb-1">
              Zona: {AREAS[currentQ.areaId]?.name}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#2A1845] leading-snug">
              {currentQ.question}
            </h2>
          </div>

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
// NUEVO JUEGO 1: DUELO DE ALTURAS (¿QUIÉN MIDE MÁS?)
// ==========================================
interface HeightDuelProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

const HeightDuelGame: React.FC<HeightDuelProps> = ({ onBack, onAddCoins }) => {
  const [cardA, setCardA] = useState(HEIGHT_DUEL_CARDS[0]);
  const [cardB, setCardB] = useState(HEIGHT_DUEL_CARDS[1]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  const getNewPair = () => {
    const shuffled = [...HEIGHT_DUEL_CARDS].sort(() => 0.5 - Math.random());
    setCardA(shuffled[0]);
    setCardB(shuffled[1]);
    setAnswered(false);
  };

  useEffect(() => {
    getNewPair();
  }, []);

  const handlePick = (chosen: 'A' | 'B') => {
    if (answered) return;
    setAnswered(true);
    setRoundsPlayed((r) => r + 1);

    const aIsTaller = cardA.heightMeters >= cardB.heightMeters;
    const userPickedA = chosen === 'A';
    const correct = (aIsTaller && userPickedA) || (!aIsTaller && !userPickedA);

    setIsCorrect(correct);
    if (correct) {
      playSuccessSound();
      setScore((s) => s + 50);
      onAddCoins(50);
    } else {
      playErrorSound();
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
          Aciertos: <strong className="text-[#0284C7] text-sm">{score / 50}</strong> ({score} pts)
        </div>
      </div>

      <div className="bg-white border-2 border-[#0284C7] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white text-[10px] font-black uppercase tracking-wider">
            Comparador de Colosos
          </span>
          <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
            ¿Cuál de las dos es más ALTA?
          </h2>
          <p className="text-xs text-[#2A1845]/70 font-light">
            Toca la atracción que crees que alcanza mayor altura o caída libre.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card A */}
          <button
            onClick={() => handlePick('A')}
            disabled={answered}
            className={`p-6 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-between gap-3 ${
              answered
                ? cardA.heightMeters >= cardB.heightMeters
                  ? 'bg-emerald-50 border-emerald-500 scale-102'
                  : 'bg-rose-50 border-rose-300 opacity-60'
                : 'bg-[#FFF9F3] border-[#F0E2D4] hover:border-[#0284C7] hover:shadow-md'
            }`}
          >
            <span className="text-5xl">{cardA.imageIcon}</span>
            <div>
              <div className="text-xs font-bold text-[#0284C7] uppercase">{cardA.area}</div>
              <h3 className="text-xl font-serif font-black text-[#2A1845]">{cardA.name}</h3>
            </div>
            {answered && (
              <div className="px-4 py-1.5 rounded-full bg-[#0284C7] text-white text-base font-black font-serif">
                {cardA.heightMeters} metros
              </div>
            )}
          </button>

          {/* Card B */}
          <button
            onClick={() => handlePick('B')}
            disabled={answered}
            className={`p-6 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-between gap-3 ${
              answered
                ? cardB.heightMeters >= cardA.heightMeters
                  ? 'bg-emerald-50 border-emerald-500 scale-102'
                  : 'bg-rose-50 border-rose-300 opacity-60'
                : 'bg-[#FFF9F3] border-[#F0E2D4] hover:border-[#0284C7] hover:shadow-md'
            }`}
          >
            <span className="text-5xl">{cardB.imageIcon}</span>
            <div>
              <div className="text-xs font-bold text-[#0284C7] uppercase">{cardB.area}</div>
              <h3 className="text-xl font-serif font-black text-[#2A1845]">{cardB.name}</h3>
            </div>
            {answered && (
              <div className="px-4 py-1.5 rounded-full bg-[#0284C7] text-white text-base font-black font-serif">
                {cardB.heightMeters} metros
              </div>
            )}
          </button>
        </div>

        {answered && (
          <div className="space-y-3 animate-in fade-in">
            <div className={`text-sm font-bold p-3 rounded-2xl ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {isCorrect ? '🎉 ¡Correcto! Sabes calcular las alturas del parque.' : '❌ ¡Casi! Revisa bien las medidas oficiales.'}
            </div>
            <button
              onClick={getNewPair}
              className="px-8 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Siguiente Duelo →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// NUEVO JUEGO 2: CRONÓMETRO CIEGO (DETÉN EN 10.00s)
// ==========================================
interface BlindTimerProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

const BlindTimerGame: React.FC<BlindTimerProps> = ({ onBack, onAddCoins }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalDiff, setFinalDiff] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState<number | null>(null);

  const startTimer = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    setFinalDiff(null);
    setFinalTime(null);
    playTickSound();
  };

  const stopTimer = () => {
    if (!isRunning || !startTime) return;
    const now = Date.now();
    const elapsedSeconds = (now - startTime) / 1000;
    const diff = Math.abs(elapsedSeconds - 10.0);
    setIsRunning(false);
    setFinalTime(elapsedSeconds);
    setFinalDiff(diff);

    if (diff < 0.2) {
      playSuccessSound();
      onAddCoins(100);
      confetti({ particleCount: 70, spread: 60 });
    } else if (diff < 0.6) {
      playSuccessSound();
      onAddCoins(50);
    } else {
      playErrorSound();
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all"
        >
          ← Volver a Juegos
        </button>
      </div>

      <div className="bg-white border-2 border-[#9333EA] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#9333EA] text-white text-[10px] font-black uppercase tracking-wider">
            Control de Tiempo a Ciegas
          </span>
          <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
            Detén en 10.00 Segundos Exactos
          </h2>
          <p className="text-xs text-[#2A1845]/70 font-light">
            Pulsa Iniciar, cuenta mentalmente sin mirar la pantalla y pulsa ¡PARAR! en el segundo 10.
          </p>
        </div>

        {/* Display Area */}
        <div className="h-36 rounded-3xl bg-[#2A1845] text-white flex flex-col items-center justify-center border-4 border-[#9333EA]/30">
          {isRunning ? (
            <div className="space-y-1">
              <span className="text-4xl animate-pulse">🙈 ⏳</span>
              <div className="text-xs text-purple-200 uppercase font-black tracking-widest">
                ¡Contando a ciegas...!
              </div>
            </div>
          ) : finalTime !== null ? (
            <div>
              <div className="text-4xl font-serif font-black text-[#F7B731]">
                {finalTime.toFixed(2)}s
              </div>
              <div className="text-xs text-white/70 mt-1">
                Diferencia: {finalDiff !== null ? finalDiff.toFixed(2) : '0'}s del objetivo (10.00s)
              </div>
            </div>
          ) : (
            <div className="text-3xl font-serif font-black text-white/50">10.00s</div>
          )}
        </div>

        {/* Action Button */}
        <div>
          {isRunning ? (
            <button
              onClick={stopTimer}
              className="w-full py-6 bg-gradient-to-r from-[#E64A38] to-[#D63031] text-white rounded-3xl font-black text-2xl uppercase tracking-wider shadow-xl hover:scale-102 active:scale-95 transition-all"
            >
              ¡PARAR AHORA! 🛑
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="px-10 py-4 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-full font-bold text-sm uppercase tracking-wider shadow-md active:scale-95"
            >
              {finalTime !== null ? 'Probar Otra Vez' : '¡Iniciar Cuenta! ⏱️'}
            </button>
          )}
        </div>

        {finalDiff !== null && (
          <div className="text-xs font-bold p-3 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4]">
            {finalDiff < 0.1
              ? '🏆 ¡INCREÍBLE! Tienes un reloj atómico en la cabeza (+100 pts).'
              : finalDiff < 0.5
              ? '⚡ ¡Excelente reflejo! Muy cerca del tiempo perfecto (+50 pts).'
              : '😅 ¡Un poco fuera! Sigue practicando en la cola.'}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// NUEVO JUEGO 3: BOMBA DE PALABRAS (WORD CHAIN)
// ==========================================
interface WordChainProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

const WordChainGame: React.FC<WordChainProps> = ({ onBack, onAddCoins }) => {
  const [promptIdx, setPromptIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((s) => s - 1);
        playTickSound();
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      setExploded(true);
      playErrorSound();
    }
    return () => clearInterval(timer);
  }, [isActive, secondsLeft]);

  const startGame = () => {
    setPromptIdx(Math.floor(Math.random() * WORD_CHAIN_PROMPTS.length));
    setSecondsLeft(15 + Math.floor(Math.random() * 10)); // 15-25s bomba secreta
    setIsActive(true);
    setExploded(false);
  };

  const passPhone = () => {
    playStarSound(6);
    onAddCoins(10);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all"
        >
          ← Volver a Juegos
        </button>
      </div>

      <div className="bg-white border-2 border-[#D97706] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#D97706] text-white text-[10px] font-black uppercase tracking-wider">
            Juego de Grupo en Cola
          </span>
          <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
            La Bomba Temática de la Fila 💣
          </h2>
          <p className="text-xs text-[#2A1845]/70 font-light">
            Di una palabra que encaje con el tema y pasa el móvil a tu compañero antes de que la bomba explote.
          </p>
        </div>

        {/* Bomb Visual Box */}
        <div className={`p-6 rounded-3xl border-2 transition-all ${exploded ? 'bg-rose-100 border-rose-500' : isActive ? 'bg-amber-50 border-amber-400' : 'bg-[#FFF9F3] border-[#F0E2D4]'}`}>
          {exploded ? (
            <div className="space-y-2 animate-bounce">
              <span className="text-6xl">💥</span>
              <h3 className="text-2xl font-serif font-black text-rose-700">¡BOOOOOOM!</h3>
              <p className="text-xs text-rose-800">¡A quien le tocó el móvil con la bomba paga los helados o cumple un reto!</p>
            </div>
          ) : isActive ? (
            <div className="space-y-3">
              <div className="text-xs font-black uppercase tracking-widest text-[#D97706]">
                Tema en Curso:
              </div>
              <h3 className="text-xl font-serif font-black text-[#2A1845]">
                {WORD_CHAIN_PROMPTS[promptIdx].topic}
              </h3>
              <p className="text-xs text-[#2A1845]/70 italic">
                Ejemplos: {WORD_CHAIN_PROMPTS[promptIdx].example}
              </p>
              <div className="text-4xl animate-pulse">💣 ⏳</div>
            </div>
          ) : (
            <div className="space-y-2 text-[#2A1845]/60">
              <span className="text-5xl">💣</span>
              <p className="text-xs">¿Listos en el grupo? Pulsa Iniciar para encender la mecha.</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div>
          {isActive ? (
            <button
              onClick={passPhone}
              className="w-full py-5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-3xl font-black text-lg uppercase tracking-wider shadow-lg active:scale-95 transition-all"
            >
              ¡Dije mi palabra! PASAR MÓVIL 👉
            </button>
          ) : (
            <button
              onClick={startGame}
              className="px-10 py-4 bg-[#D97706] hover:bg-[#B45309] text-white rounded-full font-bold text-sm uppercase tracking-wider shadow-md active:scale-95"
            >
              {exploded ? 'Nueva Ronda de Bomba' : '¡Encender la Mecha! 💣'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// NUEVO JUEGO 4: ADIVINA LA CIFRA RÉCORD (ESTIMACIÓN)
// ==========================================
interface GuessNumberProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

const GuessNumberGame: React.FC<GuessNumberProps> = ({ onBack, onAddCoins }) => {
  const [itemIdx, setItemIdx] = useState(0);
  const [guess, setGuess] = useState<number>(100);
  const [submitted, setSubmitted] = useState(false);
  const current = GUESS_NUMBER_ITEMS[itemIdx];

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const diff = Math.abs(guess - current.targetNumber);
    if (diff <= current.tolerance) {
      playSuccessSound();
      onAddCoins(80);
      confetti({ particleCount: 60, spread: 50 });
    } else {
      playErrorSound();
    }
  };

  const handleNext = () => {
    setItemIdx((i) => (i + 1) % GUESS_NUMBER_ITEMS.length);
    setGuess(100);
    setSubmitted(false);
  };

  const minRange = Math.max(0, Math.floor(current.targetNumber * 0.3));
  const maxRange = Math.floor(current.targetNumber * 1.8);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all"
        >
          ← Volver a Juegos
        </button>
      </div>

      <div className="bg-white border-2 border-[#059669] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#059669] text-white text-[10px] font-black uppercase tracking-wider">
            Estimación & Récords
          </span>
          <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
            {current.title}
          </h2>
        </div>

        {/* Dial Slider */}
        <div className="p-6 rounded-3xl bg-[#FFF9F3] border border-[#F0E2D4] space-y-4">
          <div className="text-4xl font-serif font-black text-[#059669]">
            {guess} <span className="text-base font-sans font-bold text-[#2A1845]/60">{current.unit}</span>
          </div>

          <input
            type="range"
            min={minRange}
            max={maxRange}
            step={current.unit === 'año' ? 1 : 5}
            value={guess}
            disabled={submitted}
            onChange={(e) => setGuess(parseInt(e.target.value, 10))}
            className="w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-[#059669]"
          />
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="px-8 py-3.5 bg-[#059669] hover:bg-[#047857] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Comprobar Mi Estimación
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-2">
              <div className="text-xs font-bold text-[#059669] uppercase">
                Dato Real: <strong>{current.targetNumber} {current.unit}</strong>
              </div>
              <p className="text-xs text-[#2A1845]/90 font-light">{current.funFact}</p>
            </div>
            <button
              onClick={handleNext}
              className="px-8 py-3.5 bg-[#2A1845] text-white rounded-full font-bold text-xs uppercase tracking-wider"
            >
              Siguiente Pregunta →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// NUEVO JUEGO 5: 2 VERDADES Y 1 MENTIRA
// ==========================================
interface TruthOrLieProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

const TruthOrLieGame: React.FC<TruthOrLieProps> = ({ onBack, onAddCoins }) => {
  const [setIdx, setSetIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const currentSet = TRUTH_OR_LIE_SETS[setIdx];

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    const chosen = currentSet.statements[idx];
    if (chosen.isLie) {
      playSuccessSound();
      onAddCoins(70);
      confetti({ particleCount: 60, spread: 50 });
    } else {
      playErrorSound();
    }
  };

  const handleNext = () => {
    setSetIdx((i) => (i + 1) % TRUTH_OR_LIE_SETS.length);
    setSelectedIdx(null);
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
      </div>

      <div className="bg-white border-2 border-[#DC2626] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#DC2626] text-white text-[10px] font-black uppercase tracking-wider">
            Cazador de Mitos
          </span>
          <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
            2 Verdades y 1 Mentira
          </h2>
          <p className="text-xs text-[#2A1845]/70 font-light">
            Lee atentamente las 3 afirmaciones y toca la que creas que es totalmente FALSA.
          </p>
        </div>

        <div className="space-y-3 text-left">
          {currentSet.statements.map((stmt, idx) => {
            let cardClass = 'bg-[#FFF9F3] border-[#F0E2D4] hover:border-[#DC2626]';
            if (selectedIdx !== null) {
              if (stmt.isLie) {
                cardClass = 'bg-emerald-50 border-emerald-500 font-bold';
              } else if (idx === selectedIdx && !stmt.isLie) {
                cardClass = 'bg-rose-50 border-rose-500 font-bold';
              } else {
                cardClass = 'bg-gray-50 border-gray-200 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selectedIdx !== null}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex flex-col gap-1.5 text-xs sm:text-sm ${cardClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#2A1845] font-medium leading-snug">{stmt.text}</span>
                  {selectedIdx !== null && stmt.isLie && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] uppercase font-black shrink-0">
                      ¡ES LA MENTIRA!
                    </span>
                  )}
                </div>
                {selectedIdx !== null && (
                  <p className="text-[11px] text-[#2A1845]/80 font-light pt-1 border-t border-black/5">
                    {stmt.explanation}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {selectedIdx !== null && (
          <button
            onClick={handleNext}
            className="px-8 py-3.5 bg-[#DC2626] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Siguiente Ronda →
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// NUEVO JUEGO 6: TRES EN RAYA (DRAGÓN VS CÓNDOR)
// ==========================================
interface TicTacToeProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

const TicTacToeGame: React.FC<TicTacToeProps> = ({ onBack, onAddCoins }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(Boolean) ? 'Empate' : null;
  };

  const winner = checkWinner(board);

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    playTickSound();
    const next = [...board];
    next[i] = isXNext ? '🐉' : '🗿';
    setBoard(next);
    setIsXNext(!isXNext);

    const win = checkWinner(next);
    if (win && win !== 'Empate') {
      playSuccessSound();
      onAddCoins(40);
      confetti({ particleCount: 50, spread: 40 });
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all"
        >
          ← Volver a Juegos
        </button>
        <button
          onClick={resetGame}
          className="text-xs font-bold text-[#E64A38] hover:underline"
        >
          Reiniciar Tablero
        </button>
      </div>

      <div className="bg-white border-2 border-[#2A1845] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#2A1845] text-white text-[10px] font-black uppercase tracking-wider">
            Duelo 1 vs 1
          </span>
          <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
            Dragon Khan (🐉) vs Cóndor (🗿)
          </h2>
          <div className="text-xs font-bold text-[#E64A38] mt-1">
            {winner
              ? winner === 'Empate'
                ? '¡Tablas! Duelo igualado.'
                : `🏆 ¡Ha ganado ${winner}!`
              : `Turno de: ${isXNext ? '🐉 Dragon Khan' : '🗿 Hurakan Condor'}`}
          </div>
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
          {board.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#FFF9F3] border-2 border-[#F0E2D4] hover:border-[#E64A38] text-3xl flex items-center justify-center shadow-xs transition-all active:scale-95"
            >
              {cell}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// NUEVO JUEGO 7: TEST ¿QUÉ MONTAÑA RUSA ERES HOY?
// ==========================================
interface CoasterPersonalityProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
  onOpenSurveyForAttraction: (attractionId: string) => void;
}

const CoasterPersonalityGame: React.FC<CoasterPersonalityProps> = ({
  onBack,
  onAddCoins,
  onOpenSurveyForAttraction,
}) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultKey, setResultKey] = useState<string | null>(null);

  const QUESTIONS = [
    {
      q: '¿Cómo afrontas la primera bajada de una atracción?',
      opts: [
        { text: 'Brazos arriba y mirando el horizonte', key: 'shambhala' },
        { text: 'Gritando con risa loca y disfrutando cada looping', key: 'dragonKhan' },
        { text: 'Con el pulso a mil buscando máxima aceleración', key: 'redForce' },
        { text: 'Deseando que haya agua para empaparme con amigos', key: 'tutuki' },
      ],
    },
    {
      q: '¿Cuál es tu plan perfecto de comida en el parque?',
      opts: [
        { text: 'Rollitos y fideos chinos con vistas a la muralla', key: 'dragonKhan' },
        { text: 'Costillas barbacoa en Penitence escuchando country', key: 'uncharted' },
        { text: 'Fruta tropical fresca junto al lago de Polynesia', key: 'tutuki' },
        { text: 'Un tentempié rápido para no perder ni un minuto de colas', key: 'redForce' },
      ],
    },
    {
      q: 'Si pudieras tener un superpoder en PortAventura, ¿cuál sería?',
      opts: [
        { text: 'Volar sobre los 76 metros de las cumbres', key: 'shambhala' },
        { text: 'Ser inmune a cualquier mareo en 8 inversiones', key: 'dragonKhan' },
        { text: 'Acelerar de 0 a 180 km/h en 3 segundos', key: 'redForce' },
        { text: 'Descubrir todos los tesoros y salas secretas', key: 'uncharted' },
      ],
    },
  ];

  const handleAnswer = (key: string) => {
    const nextAnswers = [...answers, key];
    setAnswers(nextAnswers);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
      playNextSound();
    } else {
      // Calculate top result
      const counts: Record<string, number> = {};
      nextAnswers.forEach((k) => (counts[k] = (counts[k] || 0) + 1));
      let topKey = 'shambhala';
      let maxC = 0;
      Object.entries(counts).forEach(([k, c]) => {
        if (c > maxC) {
          maxC = c;
          topKey = k;
        }
      });
      setResultKey(topKey);
      playCompleteSound();
      onAddCoins(60);
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  const result = resultKey ? COASTER_PERSONALITIES[resultKey] || COASTER_PERSONALITIES.shambhala : null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all"
        >
          ← Volver a Juegos
        </button>
      </div>

      <div className="bg-white border-2 border-[#7C3AED] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-wider">
            Test Exclusivo de Cola
          </span>
          <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
            ¿Qué Montaña Rusa Eres Hoy?
          </h2>
        </div>

        {!result ? (
          <div className="space-y-4 text-left">
            <div className="text-xs font-bold text-[#7C3AED] uppercase">
              Pregunta {step + 1} de {QUESTIONS.length}
            </div>
            <h3 className="text-lg font-serif font-black text-[#2A1845]">
              {QUESTIONS[step].q}
            </h3>

            <div className="space-y-2.5 pt-2">
              {QUESTIONS[step].opts.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.key)}
                  className="w-full p-4 rounded-2xl bg-[#FFF9F3] border-2 border-[#F0E2D4] hover:border-[#7C3AED] text-xs font-medium text-[#2A1845] text-left transition-all hover:scale-101"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in zoom-in-95">
            <span className="text-6xl">{result.icon}</span>
            <div>
              <div className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest">
                Tu Arquetipo de Hoy:
              </div>
              <h3 className="text-3xl font-serif font-black text-[#2A1845]">
                {result.coasterName}
              </h3>
              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] text-xs font-black">
                {result.badge}
              </span>
            </div>
            <p className="text-xs text-[#2A1845]/80 font-light leading-relaxed max-w-md mx-auto">
              {result.description}
            </p>

            <div className="pt-3 border-t border-[#F0E2D4] flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => {
                  setStep(0);
                  setAnswers([]);
                  setResultKey(null);
                }}
                className="px-6 py-2.5 rounded-full bg-[#FFF9F3] border border-[#F0E2D4] text-xs font-bold"
              >
                Hacer Test Otra Vez
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// NUEVO JUEGO 8: ACERTIJOS POR PISTAS
// ==========================================
interface CoasterRiddlesProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

const CoasterRiddlesGame: React.FC<CoasterRiddlesProps> = ({ onBack, onAddCoins }) => {
  const [riddleIdx, setRiddleIdx] = useState(0);
  const [revealedClues, setRevealedClues] = useState(1);
  const [revealedAnswer, setRevealedAnswer] = useState(false);
  const current = COASTER_RIDDLES[riddleIdx];

  const revealMore = () => {
    if (revealedClues < 3) {
      setRevealedClues((c) => c + 1);
      playTickSound();
    } else {
      setRevealedAnswer(true);
      playSuccessSound();
      onAddCoins(40);
    }
  };

  const nextRiddle = () => {
    setRiddleIdx((i) => (i + 1) % COASTER_RIDDLES.length);
    setRevealedClues(1);
    setRevealedAnswer(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all"
        >
          ← Volver a Juegos
        </button>
      </div>

      <div className="bg-white border-2 border-[#0891B2] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#0891B2] text-white text-[10px] font-black uppercase tracking-wider">
            Acertijo por Pistas
          </span>
          <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
            ¿Qué atracción se esconde aquí?
          </h2>
        </div>

        <div className="space-y-3 text-left">
          {current.clues.slice(0, revealedClues).map((clue, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E2D4] flex items-start gap-3 animate-in fade-in">
              <span className="text-base font-black text-[#0891B2]">#{idx + 1}</span>
              <p className="text-xs sm:text-sm text-[#2A1845] leading-snug">{clue}</p>
            </div>
          ))}
        </div>

        {!revealedAnswer ? (
          <div className="flex gap-2 justify-center">
            {revealedClues < 3 ? (
              <button
                onClick={revealMore}
                className="px-6 py-3 bg-[#0891B2] hover:bg-[#0e7490] text-white rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Pedir Pista {revealedClues + 1} / 3 🔍
              </button>
            ) : (
              <button
                onClick={() => {
                  setRevealedAnswer(true);
                  playSuccessSound();
                  onAddCoins(40);
                }}
                className="px-8 py-3.5 bg-[#E64A38] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
              >
                ¡Revelar Respuesta! 🎯
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-cyan-50 border-2 border-[#0891B2] space-y-2 animate-in zoom-in-95">
            <span className="text-5xl">{current.icon}</span>
            <div className="text-xs font-bold text-[#0891B2] uppercase">¡Era...!</div>
            <h3 className="text-2xl font-serif font-black text-[#2A1845]">{current.answer}</h3>
            <div className="text-xs text-[#2A1845]/70">Ubicada en la zona de {current.area}</div>
            <button
              onClick={nextRiddle}
              className="mt-3 px-8 py-3 bg-[#2A1845] text-white rounded-full text-xs font-bold uppercase tracking-wider"
            >
              Siguiente Acertijo →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// NUEVO JUEGO 9: DUELO DE REFLEJOS EN PANTALLA DIVIDIDA (1 VS 1)
// ==========================================
interface ReactionDuelProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

const ReactionDuelGame: React.FC<ReactionDuelProps> = ({ onBack, onAddCoins }) => {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'finished'>('idle');
  const [winner, setWinner] = useState<'P1' | 'P2' | null>(null);
  const timerRef = useRef<any>(null);

  const startRound = () => {
    setGameState('waiting');
    setWinner(null);
    const delay = 2000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      setGameState('ready');
      playTickSound();
    }, delay);
  };

  const handleTap = (player: 'P1' | 'P2') => {
    if (gameState === 'waiting') {
      // False start!
      clearTimeout(timerRef.current);
      setGameState('finished');
      setWinner(player === 'P1' ? 'P2' : 'P1');
      playErrorSound();
    } else if (gameState === 'ready') {
      setGameState('finished');
      setWinner(player);
      playSuccessSound();
      onAddCoins(50);
      confetti({ particleCount: 50, spread: 50 });
    }
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all"
        >
          ← Volver a Juegos
        </button>
      </div>

      <div className="bg-white border-2 border-[#E11D48] rounded-3xl p-4 sm:p-6 shadow-md text-center space-y-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#E11D48] text-white text-[10px] font-black uppercase tracking-wider">
            Duelo 1 vs 1 Frente a Frente
          </span>
          <h2 className="text-xl font-serif font-black text-[#2A1845] mt-1">
            Tap Rápido: Sujetad los dos extremos
          </h2>
        </div>

        {/* Split Screen Container */}
        <div className="h-80 rounded-3xl overflow-hidden flex flex-col border-4 border-[#2A1845]">
          {/* Player 1 Top Side (Rotated for opposite player) */}
          <button
            onClick={() => handleTap('P1')}
            disabled={gameState === 'idle' || gameState === 'finished'}
            className={`flex-1 flex flex-col items-center justify-center rotate-180 transition-colors p-4 ${
              gameState === 'ready'
                ? 'bg-emerald-500 text-white animate-pulse'
                : 'bg-rose-950 text-rose-200'
            }`}
          >
            <span className="text-xs font-black uppercase tracking-widest">Jugador 1 (Arriba)</span>
            <span className="text-xl font-bold mt-1">
              {gameState === 'ready' ? '¡¡TOCA YA!!' : 'Espera verde...'}
            </span>
          </button>

          {/* Player 2 Bottom Side */}
          <button
            onClick={() => handleTap('P2')}
            disabled={gameState === 'idle' || gameState === 'finished'}
            className={`flex-1 flex flex-col items-center justify-center transition-colors p-4 border-t-2 border-white/20 ${
              gameState === 'ready'
                ? 'bg-emerald-500 text-white animate-pulse'
                : 'bg-indigo-950 text-indigo-200'
            }`}
          >
            <span className="text-xs font-black uppercase tracking-widest">Jugador 2 (Abajo)</span>
            <span className="text-xl font-bold mt-1">
              {gameState === 'ready' ? '¡¡TOCA YA!!' : 'Espera verde...'}
            </span>
          </button>
        </div>

        {/* Status / Start Button */}
        <div>
          {gameState === 'idle' || gameState === 'finished' ? (
            <div className="space-y-2">
              {winner && (
                <div className="text-sm font-bold text-[#E11D48]">
                  🏆 ¡Ha ganado el {winner === 'P1' ? 'Jugador 1 (Arriba)' : 'Jugador 2 (Abajo)'}!
                </div>
              )}
              <button
                onClick={startRound}
                className="w-full py-4 bg-[#E11D48] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md"
              >
                {gameState === 'idle' ? '¡Empezar Duelo!' : 'Revancha Inmediata'}
              </button>
            </div>
          ) : (
            <div className="text-xs font-bold text-[#2A1845]/70 py-2">
              {gameState === 'waiting' ? '⏳ Atentos... tocará en cualquier segundo...' : '⚡ ¡¡TOCAD YA!!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// NUEVO JUEGO 10: PIEDRA, PAPEL, TIJERA, MONTAÑA RUSA
// ==========================================
interface RockPaperCoasterProps {
  onBack: () => void;
  onAddCoins: (coins: number) => void;
}

const RockPaperCoasterGame: React.FC<RockPaperCoasterProps> = ({ onBack, onAddCoins }) => {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [cpuChoice, setCpuChoice] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);

  const CHOICES = [
    { id: 'shambhala', label: 'Shambhala 🏔️', beats: 'tutuki', defeatsText: 'vuela sobre el agua de Tutuki Splash' },
    { id: 'tutuki', label: 'Tutuki Splash 🌊', beats: 'furius', defeatsText: 'empapa y frena los motores de Furius Baco' },
    { id: 'furius', label: 'Furius Baco 🍇', beats: 'shambhala', defeatsText: 'acelera más rápido que la caída de Shambhala' },
  ];

  const play = (choiceId: string) => {
    playTickSound();
    const cpu = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    setPlayerChoice(choiceId);
    setCpuChoice(cpu.id);

    const userObj = CHOICES.find((c) => c.id === choiceId)!;

    if (choiceId === cpu.id) {
      setResultText('¡Empate entre colosos!');
    } else if (userObj.beats === cpu.id) {
      setResultText(`🎉 ¡Ganaste! Tu ${userObj.label} ${userObj.defeatsText}.`);
      playSuccessSound();
      onAddCoins(30);
    } else {
      setResultText(`❌ ¡Perdiste! El ${cpu.label} de la máquina superó tu elección.`);
      playErrorSound();
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white border border-[#F0E2D4] hover:bg-[#2A1845] hover:text-white text-xs font-bold text-[#2A1845] transition-all"
        >
          ← Volver a Juegos
        </button>
      </div>

      <div className="bg-white border-2 border-[#EA580C] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#EA580C] text-white text-[10px] font-black uppercase tracking-wider">
            Clásico Versionado
          </span>
          <h2 className="text-2xl font-serif font-black text-[#2A1845] mt-2">
            Piedra, Papel o Montaña Rusa
          </h2>
          <p className="text-xs text-[#2A1845]/70 font-light">
            Shambhala vence al Agua • El Agua frena a Furius Baco • Furius Baco gana en velocidad a Shambhala.
          </p>
        </div>

        {/* 3 Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {CHOICES.map((c) => (
            <button
              key={c.id}
              onClick={() => play(c.id)}
              className="p-4 rounded-2xl bg-[#FFF9F3] border-2 border-[#F0E2D4] hover:border-[#EA580C] text-sm font-bold text-[#2A1845] transition-all flex items-center justify-between hover:scale-101"
            >
              <span>{c.label}</span>
              <span className="text-xs text-[#EA580C] uppercase font-black">Elegir →</span>
            </button>
          ))}
        </div>

        {resultText && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-[#2A1845] animate-in fade-in">
            {resultText}
          </div>
        )}
      </div>
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
  const [trainPos, setTrainPos] = useState(0);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const reqRef = useRef<number | null>(null);
  const speedRef = useRef(1.2);
  const posRef = useRef(0);
  const movingForwardRef = useRef(true);

  const TARGET_MIN = 45;
  const TARGET_MAX = 55;

  const startRound = (r = 1) => {
    setIsPlaying(true);
    setRound(r);
    setFeedback(null);
    posRef.current = 0;
    speedRef.current = 0.8 + r * 0.35;
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

        <div className="relative h-24 bg-[#2A1845] rounded-3xl overflow-hidden border-4 border-[#0284C7]/40 shadow-inner flex items-center">
          <div
            className="absolute top-0 bottom-0 bg-[#81B29A]/80 border-x-2 border-white/60 flex items-center justify-center"
            style={{ left: `${TARGET_MIN}%`, width: `${TARGET_MAX - TARGET_MIN}%` }}
          >
            <span className="text-[10px] text-white font-black uppercase tracking-widest rotate-90">
              DROP
            </span>
          </div>

          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform"
            style={{ left: `${trainPos}%` }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E64A38] to-[#F7B731] border-2 border-white text-white flex items-center justify-center text-xl shadow-lg">
              🎢
            </div>
          </div>
        </div>

        {feedback && (
          <div className="text-sm font-bold text-[#2A1845] bg-[#FFF0E5] py-2 px-4 rounded-xl border border-[#E64A38]/20 animate-bounce">
            {feedback}
          </div>
        )}

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
        playSuccessSound();
        setCards((prev) =>
          prev.map((c, i) => (i === firstIdx || i === secondIdx ? { ...c, matched: true } : c))
        );
        setFlipped([]);
        onAddCoins(30);

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

    const tickInterval = setInterval(() => {
      playSpinTickSound();
    }, 120);

    const randomDegrees = Math.floor(1800 + Math.random() * 1440);
    const nextRot = rotation + randomDegrees;
    setRotation(nextRot);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      const sliceSize = 360 / WHEEL_CHOICES.length;
      const normalizedDegree = nextRot % 360;
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

          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-4">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-8 bg-[#E64A38] text-white flex items-center justify-center font-bold text-xs clip-triangle shadow-md" />

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

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#2A1845] border-4 border-white text-white flex items-center justify-center text-xl shadow-md z-10">
              🎡
            </div>
          </div>

          <button
            id="btn-spin-wheel"
            onClick={spinWheel}
            disabled={isSpinning}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#F7B731] to-[#FFA801] hover:from-[#FFA801] hover:to-[#F7B731] text-[#2A1845] font-black text-sm uppercase tracking-widest rounded-full shadow-lg active:scale-95 disabled:opacity-50 transition-all"
          >
            {isSpinning ? '¡Girando la Ruleta...!' : '¡GIRAR LA RULETA!'}
          </button>

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
