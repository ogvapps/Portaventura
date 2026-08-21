import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { CompanionPersona, ChatMessage, UserPreferences, CompanionPersonaId } from '../types';
import { COMPANION_PERSONAS } from '../data/companionPersonas';
import { ATTRACTIONS } from '../data/attractions';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings2,
  Smile,
  Compass,
  Zap,
  Flame,
  MessageSquare,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface AIChatCompanionProps {
  userPreferences?: UserPreferences | null;
  onOpenSurveyModal?: () => void;
  onSelectAttraction?: (attractionId: string) => void;
  isFloatingDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export const AIChatCompanion: React.FC<AIChatCompanionProps> = ({
  userPreferences,
  onOpenSurveyModal,
  onSelectAttraction,
  isFloatingDrawer = false,
  onCloseDrawer,
}) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<CompanionPersonaId>('woody');
  const [customName, setCustomName] = useState('Porty');
  const [customTone, setCustomTone] = useState('Divertido y Aventurero');
  const [customAvatar, setCustomAvatar] = useState('🤖');
  const [showPersonalizationModal, setShowPersonalizationModal] = useState(false);

  const activePersona =
    COMPANION_PERSONAS.find((p) => p.id === selectedPersonaId) || COMPANION_PERSONAS[0];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`pa_chat_messages_${selectedPersonaId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'msg-init-1',
        sender: 'assistant',
        text: activePersona.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight + 1000,
        behavior,
      });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    }
  };

  useEffect(() => {
    // Immediate and delayed scroll to handle markdown rendering height updates
    scrollToBottom('auto');
    const timer = setTimeout(() => {
      scrollToBottom('smooth');
    }, 80);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const handleContainerScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    // Show jump to bottom button if user scrolled up
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollBottomBtn(isScrolledUp);
  };

  // Persist messages per persona
  useEffect(() => {
    localStorage.setItem(`pa_chat_messages_${selectedPersonaId}`, JSON.stringify(messages));
  }, [messages, selectedPersonaId]);

  const handleSelectPersona = (personaId: CompanionPersonaId) => {
    setSelectedPersonaId(personaId);
    const persona = COMPANION_PERSONAS.find((p) => p.id === personaId) || COMPANION_PERSONAS[0];
    
    // Switch greeting
    const newInitialMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: persona.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([newInitialMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      let systemPrompt = activePersona.systemPrompt;
      if (selectedPersonaId === 'custom') {
        systemPrompt = `Eres ${customName}, el asistente personalizado de PortAventura World. Tu tono es ${customTone}. Conoces todas las atracciones y entretienes a los visitantes en las colas.`;
      }

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          persona: selectedPersonaId,
          systemInstruction: systemPrompt,
          userPreferences: userPreferences,
          chatHistory: messages.slice(-6),
        }),
      });

      if (!response.ok) {
        throw new Error('Chat response error');
      }

      const data = await response.json();
      const replyText = data.reply || '¡Qué gran momento en el parque!';

      // Check if reply mentions a specific attraction to link it
      let matchedAttractionId: string | undefined;
      for (const attr of ATTRACTIONS) {
        if (replyText.toLowerCase().includes(attr.name.toLowerCase())) {
          matchedAttractionId = attr.id;
          break;
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attractionSuggestionId: matchedAttractionId,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Speech synthesis if enabled
      if (ttsEnabled && 'speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(replyText.replace(/[*#_~]/g, ''));
          utterance.lang = 'es-ES';
          utterance.rate = 1.05;
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: '¡Por todos los vagones de montaña rusa! Ha habido un pequeño bache en la vía de comunicación, pero cuéntame: ¿en qué atracción estás ahora?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const persona = COMPANION_PERSONAS.find((p) => p.id === selectedPersonaId) || COMPANION_PERSONAS[0];
    const initialMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: persona.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialMsg]);
    localStorage.removeItem(`pa_chat_messages_${selectedPersonaId}`);
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 overflow-hidden h-full min-h-0 ${
        !isFloatingDrawer ? 'max-w-5xl mx-auto w-full' : 'w-full'
      }`}
    >
      {/* Companion Header */}
      <div
        className={`p-3.5 sm:p-5 text-white bg-gradient-to-r ${activePersona.bgGradient} flex items-center justify-between shadow-md shrink-0`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl shadow-inner border border-white/30 shrink-0">
            {selectedPersonaId === 'custom' ? customAvatar : activePersona.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h3 className="font-serif font-black text-base sm:text-xl text-white tracking-tight truncate">
                {selectedPersonaId === 'custom' ? customName : activePersona.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-[9px] sm:text-[10px] font-black uppercase text-white tracking-wider backdrop-blur-sm shrink-0">
                IA de Cola
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/90 font-medium truncate">
              {selectedPersonaId === 'custom' ? customTone : activePersona.title}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* TTS Audio Voice Button */}
          <button
            type="button"
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              ttsEnabled ? 'bg-white text-slate-900 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
            }`}
            title={ttsEnabled ? 'Voz activada' : 'Activar voz'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 text-[#E64A38]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Personalize Persona Button */}
          <button
            type="button"
            onClick={() => setShowPersonalizationModal(true)}
            className="p-2 rounded-xl bg-black/20 text-white hover:bg-black/30 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Personalizar acompañante IA"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Personalizar</span>
          </button>

          {/* Reset chat */}
          <button
            type="button"
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-black/20 text-white hover:bg-black/30 transition-colors"
            title="Reiniciar conversación"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isFloatingDrawer && onCloseDrawer && (
            <button
              type="button"
              onClick={onCloseDrawer}
              className="p-2 rounded-xl bg-black/20 text-white hover:bg-black/30 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Persona Quick Switcher Chips */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1">
          <Smile className="w-3.5 h-3.5" /> Personajes:
        </span>
        {COMPANION_PERSONAS.map((persona) => {
          const isSelected = selectedPersonaId === persona.id;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => handleSelectPersona(persona.id)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900 ring-offset-1'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{persona.avatar}</span>
              <span>{persona.name ? persona.name.split(' ')[0] : 'Guía'}</span>
            </button>
          );
        })}
      </div>

      {/* Message Chat List */}
      <div
        ref={messagesContainerRef}
        onScroll={handleContainerScroll}
        className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-6 space-y-3 sm:space-y-4 bg-slate-50/50"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 sm:gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {!isUser && (
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center text-base sm:text-lg text-white shadow-sm shrink-0 mt-1"
                  style={{ backgroundColor: activePersona.themeColor }}
                >
                  {selectedPersonaId === 'custom' ? customAvatar : activePersona.avatar}
                </div>
              )}

              <div className={`max-w-[88%] sm:max-w-[75%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-tr from-[#E64A38] to-[#c93d2d] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {/* Message formatted paragraphs & markdown */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  ) : (
                    <div className="chat-markdown-content text-slate-800 text-xs sm:text-sm leading-relaxed overflow-x-auto">
                      <Markdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-extrabold text-[#2A1845]">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1.5 pl-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1.5 pl-1">{children}</ol>,
                          li: ({ children }) => <li className="leading-snug">{children}</li>,
                          h1: ({ children }) => <h1 className="font-serif font-black text-base text-[#2A1845] mt-2.5 mb-1">{children}</h1>,
                          h2: ({ children }) => <h2 className="font-serif font-bold text-sm text-[#2A1845] mt-2 mb-1">{children}</h2>,
                          h3: ({ children }) => <h3 className="font-bold text-sm text-[#2A1845] mt-1.5 mb-0.5">{children}</h3>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-[#E64A38] pl-2.5 my-1.5 italic text-slate-600 bg-[#FFF9F3]/60 py-0.5 rounded-r">
                              {children}
                            </blockquote>
                          ),
                          code: ({ children }) => (
                            <code className="bg-slate-100 text-[#E64A38] px-1.5 py-0.5 rounded text-xs font-mono font-medium">
                              {children}
                            </code>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#E64A38] underline hover:text-[#d63031] font-semibold inline-flex items-center gap-0.5"
                            >
                              {children}
                            </a>
                          ),
                          hr: () => <hr className="my-2 border-slate-200" />,
                        }}
                      >
                        {msg.text}
                      </Markdown>
                    </div>
                  )}

                  {/* Suggestion badge if an attraction is referenced */}
                  {msg.attractionSuggestionId && onSelectAttraction && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">Atracción mencionada</span>
                      <button
                        type="button"
                        onClick={() => onSelectAttraction(msg.attractionSuggestionId!)}
                        className="px-2 py-1 rounded-lg bg-[#E64A38]/10 hover:bg-[#E64A38]/20 text-[#E64A38] text-[11px] sm:text-xs font-black flex items-center gap-1 transition-colors"
                      >
                        <span>Ver Ficha</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className={`text-[10px] text-slate-500 px-2 flex items-center gap-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span>{msg.timestamp}</span>
                  {!isUser && <span className="font-semibold text-slate-500">• {activePersona.name}</span>}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-2.5 sm:gap-3 justify-start animate-fade-in">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center text-base sm:text-lg text-white shadow-sm shrink-0"
              style={{ backgroundColor: activePersona.themeColor }}
            >
              {activePersona.avatar}
            </div>
            <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl rounded-bl-none bg-white border border-slate-200 shadow-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E64A38] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#F7B731] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-500 font-medium ml-1">Escribiendo...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-px" />

        {/* Floating Quick Scroll to Bottom Button */}
        {showScrollBottomBtn && (
          <div className="sticky bottom-2 inset-x-0 flex justify-center z-20 pointer-events-none">
            <button
              type="button"
              onClick={() => scrollToBottom('smooth')}
              className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold shadow-lg transition-all active:scale-95 backdrop-blur-sm border border-white/20"
            >
              <ChevronDown className="w-3.5 h-3.5 text-[#F7B731]" />
              <span>Ver últimos mensajes</span>
            </button>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="bg-white px-3 sm:px-4 py-2 border-t border-slate-100 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#F7B731]" /> Ideas de cola:
        </span>
        {activePersona.suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 border border-slate-200 transition-colors disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2.5 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Habla con ${activePersona.name} en la cola...`}
          disabled={isLoading}
          className="flex-1 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E64A38] focus:bg-white text-xs sm:text-sm text-slate-900 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 sm:p-3 rounded-2xl bg-[#E64A38] hover:bg-[#c93d2d] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-500/20 transition-all shrink-0"
          aria-label="Enviar mensaje"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>

      {/* PERSONALIZATION MODAL */}
      {showPersonalizationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#F7B731]" />
                <h3 className="font-serif font-black text-lg">Personaliza tu Asistente IA</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPersonalizationModal(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  1. Elige una personalidad predefinida
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {COMPANION_PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        handleSelectPersona(p.id);
                        setShowPersonalizationModal(false);
                      }}
                      className={`p-3 rounded-2xl text-left border-2 transition-all flex items-center gap-2.5 ${
                        selectedPersonaId === p.id
                          ? 'border-[#E64A38] bg-red-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl">{p.avatar}</span>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{p.name}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{p.voiceTone}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  2. O crea tu propio Guía Virtual
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-600 font-bold block mb-1">Nombre del Asistente</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-bold block mb-1">Emoji / Avatar</label>
                    <div className="flex gap-2">
                      {['🤖', '🎢', '🦁', '🦜', '🎩', '🚀', '🧙‍♂️'].map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setCustomAvatar(em)}
                          className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border ${
                            customAvatar === em ? 'border-[#E64A38] bg-red-50' : 'border-slate-200'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-bold block mb-1">Tono y Carácter</label>
                    <select
                      value={customTone}
                      onChange={(e) => setCustomTone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-sm font-medium"
                    >
                      <option value="Divertido, bromista y enérgico">Divertido, bromista y enérgico</option>
                      <option value="Experto estratega, serio y técnico">Experto estratega y técnico</option>
                      <option value="Místico y legendario">Místico y legendario</option>
                      <option value="Súper simpático para niños">Infantil y alegre para niños</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPersonaId('custom');
                    setShowPersonalizationModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold bg-slate-900 text-white text-sm shadow-md"
                >
                  Guardar y Activar Guía
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
