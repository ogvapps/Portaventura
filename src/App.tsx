import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SurveyIntro } from './components/SurveyIntro';
import { SurveyRunner } from './components/SurveyRunner';
import { SurveyResults } from './components/SurveyResults';
import { CustomSurveyBuilder } from './components/CustomSurveyBuilder';
import { AttractionCatalog } from './components/AttractionCatalog';
import { SurveyHistory } from './components/SurveyHistory';
import { WaitTimesView } from './components/WaitTimesView';
import { QueueGamesView } from './components/QueueGamesView';
import { PreferenceSurveyModal } from './components/PreferenceSurveyModal';
import { UserProfilePassportModal } from './components/UserProfilePassportModal';
import { AIChatCompanion } from './components/AIChatCompanion';
import { ATTRACTIONS } from './data/attractions';
import { SURVEY_PRESETS } from './data/presets';
import { Attraction, AttractionRating, SurveyPreset, SurveySession, UserPreferences } from './types';
import { Bot, Cloud, CloudCheck, MessageSquare, Sparkles, X } from 'lucide-react';
import {
  loadSavedSessions,
  saveSession,
  loadActiveSession,
  clearActiveSession,
  deleteSession as deleteSessionStorage,
} from './utils/storage';
import {
  ensureAnonymousAuth,
  saveUserPreferencesToCloud,
  loadUserPreferencesFromCloud,
  saveSurveySessionToCloud,
  loadUserSurveySessionsFromCloud,
  deleteSurveySessionFromCloud,
  wipeAllUserDataAndSignOut,
  auth,
} from './lib/firebase';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'intro' | 'survey' | 'results' | 'custom-builder' | 'catalog' | 'history' | 'waittimes' | 'games' | 'chat'
  >('intro');
  const [activeSession, setActiveSession] = useState<SurveySession | null>(null);
  const [savedSessions, setSavedSessions] = useState<SurveySession[]>([]);
  const [currentSurveyAttractions, setCurrentSurveyAttractions] = useState<Attraction[]>([]);
  const [visitorName, setVisitorName] = useState('Aventurero PortAventura');
  const [visitDate, setVisitDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // User preferences & Onboarding state
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(() => {
    const saved = localStorage.getItem('pa_user_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [isConfirmLogoutModalOpen, setIsConfirmLogoutModalOpen] = useState(false);
  const [isWipingData, setIsWipingData] = useState(false);

  // Initialize Firebase Auth and sync cloud data
  useEffect(() => {
    ensureAnonymousAuth()
      .then(async (user) => {
        setUserId(user.uid);
        setIsCloudSynced(true);

        // Fetch cloud preferences if available
        try {
          const cloudPrefs = await loadUserPreferencesFromCloud(user.uid);
          if (cloudPrefs) {
            setUserPreferences(cloudPrefs);
            localStorage.setItem('pa_user_preferences', JSON.stringify(cloudPrefs));
            if (cloudPrefs.visitorName) {
              setVisitorName(cloudPrefs.visitorName);
            }
          } else if (userPreferences) {
            // Push local preferences to cloud
            await saveUserPreferencesToCloud(user.uid, userPreferences);
          }

          // Fetch cloud sessions
          const cloudSessions = await loadUserSurveySessionsFromCloud(user.uid);
          if (cloudSessions && cloudSessions.length > 0) {
            setSavedSessions(cloudSessions);
          }
        } catch (err) {
          console.warn('Firebase initial sync warning:', err);
        }
      })
      .catch((err) => {
        console.warn('Firebase anonymous auth warning:', err);
      });
  }, []);

  // Sync visitor name with preferences if available
  useEffect(() => {
    if (userPreferences?.visitorName) {
      setVisitorName(userPreferences.visitorName);
    }
  }, [userPreferences]);

  // Load existing sessions on mount & check onboarding
  useEffect(() => {
    const loaded = loadSavedSessions();
    setSavedSessions(loaded);
    const active = loadActiveSession();
    if (active) {
      setActiveSession(active);
    }

    // Check if initial preference survey should pop up on first visit
    const hasSeenOnboarding = localStorage.getItem('pa_onboarding_shown');
    if (!hasSeenOnboarding && !localStorage.getItem('pa_user_preferences')) {
      // Small timeout to allow smooth UI mount before displaying popup
      const timer = setTimeout(() => {
        setIsPreferenceModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSavePreferences = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    if (prefs.visitorName) {
      setVisitorName(prefs.visitorName);
    }
    localStorage.setItem('pa_user_preferences', JSON.stringify(prefs));
    localStorage.setItem('pa_onboarding_shown', 'true');
    setIsPreferenceModalOpen(false);

    // Sync to Firestore
    if (userId) {
      saveUserPreferencesToCloud(userId, prefs);
    }
  };


  // Handler: Start a survey from a preset
  const handleStartPreset = (preset: SurveyPreset, name: string, date: string) => {
    const attractions = preset.attractionIds
      .map((id) => ATTRACTIONS.find((a) => a.id === id))
      .filter((a): a is Attraction => !!a);

    const newSession: SurveySession = {
      id: `session_${Date.now()}`,
      title: `Encuesta: ${preset.title}`,
      presetId: preset.id,
      visitorName: name,
      visitDate: date,
      ratings: {},
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setVisitorName(name);
    setVisitDate(date);
    setActiveSession(newSession);
    setCurrentSurveyAttractions(attractions);
    saveSession(newSession);
    if (userId) {
      saveSurveySessionToCloud(newSession, userId);
    }
    setCurrentView('survey');
  };

  // Handler: Start custom survey setup
  const handleOpenCustomBuilder = (name: string, date: string) => {
    setVisitorName(name);
    setVisitDate(date);
    setCurrentView('custom-builder');
  };

  // Handler: Launch custom survey after selecting attractions
  const handleLaunchCustom = (selectedIds: string[]) => {
    const attractions = selectedIds
      .map((id) => ATTRACTIONS.find((a) => a.id === id))
      .filter((a): a is Attraction => !!a);

    const newSession: SurveySession = {
      id: `session_${Date.now()}`,
      title: `Mi Encuesta Personalizada (${selectedIds.length} atracciones)`,
      visitorName,
      visitDate,
      ratings: {},
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setActiveSession(newSession);
    setCurrentSurveyAttractions(attractions);
    saveSession(newSession);
    if (userId) {
      saveSurveySessionToCloud(newSession, userId);
    }
    setCurrentView('survey');
  };

  // Handler: Resume active session
  const handleResumeActive = () => {
    if (!activeSession) return;
    let attractions: Attraction[] = [];
    if (activeSession.presetId) {
      const preset = SURVEY_PRESETS.find((p) => p.id === activeSession.presetId);
      if (preset) {
        attractions = preset.attractionIds
          .map((id) => ATTRACTIONS.find((a) => a.id === id))
          .filter((a): a is Attraction => !!a);
      }
    }
    if (attractions.length === 0) {
      // If no preset or custom, use all attractions present in session ratings or fallback to top 10
      const ratedIds = Object.keys(activeSession.ratings);
      if (ratedIds.length > 0) {
        attractions = ratedIds
          .map((id) => ATTRACTIONS.find((a) => a.id === id))
          .filter((a): a is Attraction => !!a);
      } else {
        attractions = SURVEY_PRESETS[0].attractionIds
          .map((id) => ATTRACTIONS.find((a) => a.id === id))
          .filter((a): a is Attraction => !!a);
      }
    }
    setCurrentSurveyAttractions(attractions);
    setCurrentView('survey');
  };

  // Handler: Update rating of a specific attraction
  const handleUpdateRating = (attractionId: string, rating: AttractionRating) => {
    if (!activeSession) return;
    const updatedRatings = {
      ...activeSession.ratings,
      [attractionId]: rating,
    };
    const updatedSession: SurveySession = {
      ...activeSession,
      ratings: updatedRatings,
      updatedAt: new Date().toISOString(),
    };
    setActiveSession(updatedSession);
    saveSession(updatedSession);
    if (userId) {
      saveSurveySessionToCloud(updatedSession, userId);
    }
  };

  // Handler: Finish survey
  const handleFinishSurvey = () => {
    if (!activeSession) return;
    const finishedSession: SurveySession = {
      ...activeSession,
      completed: true,
      updatedAt: new Date().toISOString(),
    };
    setActiveSession(finishedSession);
    saveSession(finishedSession);
    if (userId) {
      saveSurveySessionToCloud(finishedSession, userId);
    }
    setSavedSessions(loadSavedSessions());
    setCurrentView('results');
  };

  // Handler: Open saved session
  const handleOpenSavedSession = (session: SurveySession) => {
    setActiveSession(session);
    setCurrentView('results');
  };

  // Handler: Start single survey on-the-spot for any attraction
  const handleStartSingleSurvey = (attractionId: string, name?: string, date?: string) => {
    const vName = name || visitorName;
    const vDate = date || visitDate;
    setVisitorName(vName);
    setVisitDate(vDate);

    const targetAttraction = ATTRACTIONS.find((a) => a.id === attractionId);
    if (!targetAttraction) return;

    const newSession: SurveySession = {
      id: `session_${Date.now()}`,
      title: `Valoración: ${targetAttraction.name}`,
      visitorName: vName,
      visitDate: vDate,
      ratings: activeSession?.ratings ? { ...activeSession.ratings } : {},
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setActiveSession(newSession);
    setCurrentSurveyAttractions([targetAttraction]);
    saveSession(newSession);
    if (userId) {
      saveSurveySessionToCloud(newSession, userId);
    }
    setCurrentView('survey');
  };

  // Handler: Delete session
  const handleDeleteSession = (id: string) => {
    const updated = deleteSessionStorage(id);
    setSavedSessions(updated);
    if (userId) {
      deleteSurveySessionFromCloud(id);
    }
    if (activeSession?.id === id) {
      setActiveSession(null);
    }
  };

  // Handler: Full Logout and Data Wipe (Cloud Firestore + Local Storage + State Reset)
  const handleLogoutAndWipeData = async () => {
    setIsWipingData(true);
    try {
      if (userId) {
        const newUser = await wipeAllUserDataAndSignOut(userId);
        setUserId(newUser.uid);
      }
    } catch (err) {
      console.warn('Error during wipe & sign out:', err);
    } finally {
      setIsWipingData(false);
    }

    // 1. Clear Local Storage
    localStorage.removeItem('pa_user_preferences');
    localStorage.removeItem('pa_onboarding_shown');
    localStorage.removeItem('pa_survey_sessions');
    localStorage.removeItem('pa_active_survey');

    // 2. Reset React State
    setUserPreferences(null);
    setSavedSessions([]);
    setActiveSession(null);
    setVisitorName('Aventurero PortAventura');
    setIsPassportModalOpen(false);
    setIsPreferenceModalOpen(false);
    setIsConfirmLogoutModalOpen(false);
    setCurrentView('intro');
  };

  // Handler: New survey button (navigates to intro & smoothly scrolls to survey presets selection)
  const handleNewSurvey = () => {
    if (currentView !== 'intro') {
      setCurrentView('intro');
    }
    // Smooth scroll to the survey selection section
    setTimeout(() => {
      const el =
        document.getElementById('section-survey-presets') ||
        document.getElementById('survey-config-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }
    }, 80);
  };

  // Active progress calculation for navbar
  const activeProgress =
    currentView === 'survey' && activeSession && currentSurveyAttractions.length > 0
      ? {
          current: Object.keys(activeSession.ratings).length,
          total: currentSurveyAttractions.length,
          title: activeSession.title,
        }
      : undefined;

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#3D405B] font-sans antialiased selection:bg-[#E07A5F] selection:text-white flex flex-col relative">
      <Navbar
        currentView={currentView === 'custom-builder' ? 'intro' : currentView}
        onNavigate={(view) => setCurrentView(view)}
        onNewSurvey={handleNewSurvey}
        onOpenPreferenceSurvey={() => setIsPreferenceModalOpen(true)}
        onOpenPassport={() => setIsPassportModalOpen(true)}
        onLogout={() => setIsConfirmLogoutModalOpen(true)}
        userPreferences={userPreferences}
        activeProgress={activeProgress}
        hasActiveSession={!!activeSession}
      />

      <main className="flex-1 pb-16 md:pb-0">
        {currentView === 'intro' && (
          <SurveyIntro
            onStartPreset={handleStartPreset}
            onStartCustom={handleOpenCustomBuilder}
            onResumeActive={handleResumeActive}
            activeSession={activeSession}
            savedSessions={savedSessions}
            onOpenSession={handleOpenSavedSession}
            onStartSingleSurvey={handleStartSingleSurvey}
            onOpenWaitTimes={() => setCurrentView('waittimes')}
            onOpenGames={() => setCurrentView('games')}
            userPreferences={userPreferences}
            onOpenPreferenceSurvey={() => setIsPreferenceModalOpen(true)}
            onOpenPassport={() => setIsPassportModalOpen(true)}
            onOpenAIChat={() => setCurrentView('chat')}
          />
        )}

        {currentView === 'custom-builder' && (
          <CustomSurveyBuilder
            visitorName={visitorName}
            visitDate={visitDate}
            onLaunchCustom={handleLaunchCustom}
            onBack={() => setCurrentView('intro')}
          />
        )}

        {currentView === 'survey' && activeSession && (
          <SurveyRunner
            attractions={
              currentSurveyAttractions.length > 0
                ? currentSurveyAttractions
                : ATTRACTIONS.slice(0, 10)
            }
            ratings={activeSession.ratings || {}}
            onUpdateRating={handleUpdateRating}
            onFinish={handleFinishSurvey}
            onCancel={() => setCurrentView('intro')}
            onOpenSurveyForAttraction={handleStartSingleSurvey}
          />
        )}

        {currentView === 'results' && activeSession && (
          <SurveyResults
            session={activeSession}
            onRestart={handleNewSurvey}
            onViewCatalog={() => setCurrentView('catalog')}
            onOpenSurveyForAttraction={handleStartSingleSurvey}
          />
        )}

        {currentView === 'catalog' && (
          <AttractionCatalog
            onSelectAttractionForSurvey={handleStartSingleSurvey}
          />
        )}

        {currentView === 'waittimes' && (
          <WaitTimesView
            onOpenSurveyForAttraction={handleStartSingleSurvey}
            onOpenGames={() => setCurrentView('games')}
          />
        )}

        {currentView === 'games' && (
          <QueueGamesView
            onOpenSurveyForAttraction={handleStartSingleSurvey}
            onOpenWaitTimes={() => setCurrentView('waittimes')}
          />
        )}

        {currentView === 'chat' && (
          <div className="p-2 sm:p-4 max-w-5xl mx-auto h-[calc(100dvh-5.5rem)] min-h-[460px]">
            <AIChatCompanion
              userPreferences={userPreferences}
              onOpenSurveyModal={() => setIsPreferenceModalOpen(true)}
              onSelectAttraction={handleStartSingleSurvey}
            />
          </div>
        )}

        {currentView === 'history' && (
          <SurveyHistory
            sessions={savedSessions}
            onSelectSession={handleOpenSavedSession}
            onDeleteSession={handleDeleteSession}
            onNewSurvey={handleNewSurvey}
            onBack={() => setCurrentView('intro')}
          />
        )}
      </main>

      {/* Onboarding Preference Survey Modal */}
      <PreferenceSurveyModal
        isOpen={isPreferenceModalOpen}
        onClose={() => {
          localStorage.setItem('pa_onboarding_shown', 'true');
          setIsPreferenceModalOpen(false);
        }}
        onSavePreferences={handleSavePreferences}
        initialPreferences={userPreferences}
      />

      {/* User Profile Passport Modal */}
      <UserProfilePassportModal
        isOpen={isPassportModalOpen}
        onClose={() => setIsPassportModalOpen(false)}
        userPreferences={userPreferences}
        onEditPreferences={() => {
          setIsPassportModalOpen(false);
          setIsPreferenceModalOpen(true);
        }}
        onSelectAttraction={(attId) => {
          setIsPassportModalOpen(false);
          handleStartSingleSurvey(attId);
        }}
        onLogout={handleLogoutAndWipeData}
      />

      {/* Confirmation Modal for Quick Logout / Reset */}
      {isConfirmLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-100 relative animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-serif font-black text-xl text-center text-[#2A1845] mb-2">
              ¿Cerrar sesión y borrar tus datos?
            </h3>

            <p className="text-sm text-center text-[#2A1845]/70 leading-relaxed mb-6">
              Se eliminará permanentemente tu pasaporte de aventurero, tu perfil, tus gustos y el historial de encuestas tanto de este dispositivo como de la base de datos de Firebase.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                id="btn-confirm-app-wipe"
                disabled={isWipingData}
                onClick={handleLogoutAndWipeData}
                className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isWipingData ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Borrando datos...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Sí, borrar todo y salir</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isWipingData}
                onClick={() => setIsConfirmLogoutModalOpen(false)}
                className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-[#2A1845] font-bold text-xs uppercase tracking-wider transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick AI Companion Button (available on all views except full-page chat and active survey to preserve focus) */}
      {currentView !== 'chat' && currentView !== 'survey' && (
        <div className="fixed bottom-18 sm:bottom-6 right-3 sm:right-6 z-40">
          <button
            id="btn-floating-ai-companion"
            onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#7E22CE] hover:to-[#6B21A8] text-white rounded-full shadow-2xl hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95 border-2 border-white/80 group"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
              {isFloatingChatOpen ? 'Cerrar Chat' : 'Hablar con IA en Cola'}
            </span>
          </button>
        </div>
      )}

      {/* Floating AI Companion Drawer */}
      {isFloatingChatOpen && currentView !== 'chat' && (
        <div className="fixed bottom-16 sm:bottom-20 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[430px] h-[540px] max-h-[calc(100dvh-5.5rem)] shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <AIChatCompanion
            userPreferences={userPreferences}
            onOpenSurveyModal={() => {
              setIsFloatingChatOpen(false);
              setIsPreferenceModalOpen(true);
            }}
            onSelectAttraction={(id) => {
              setIsFloatingChatOpen(false);
              handleStartSingleSurvey(id);
            }}
            isFloatingDrawer={true}
            onCloseDrawer={() => setIsFloatingChatOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
