import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SearchHero } from './components/SearchHero';
import { ProfileHeader } from './components/ProfileHeader';
import { StatCards } from './components/StatCards';
import { ActivityChart } from './components/ActivityChart';
import { GamesSection } from './components/GamesSection';
import { BadgesSection } from './components/BadgesSection';
import { TimeAnalytics } from './components/TimeAnalytics';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Footer } from './components/Footer';
import { Gamepad2, Award, Clock, TrendingUp, AlertCircle } from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('steam_api_key') || '');
  const [currentSteamId, setCurrentSteamId] = useState('76561197960287930'); // Gabe Newell default
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('games'); // 'games', 'activity', 'analytics', 'badges'
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Fetch profile stats
  const fetchProfile = async (identifier, keyToUse = apiKey) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {};
      if (keyToUse) {
        headers['x-steam-api-key'] = keyToUse;
      }

      const res = await fetch(`/api/player/${encodeURIComponent(identifier)}`, {
        headers
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Не удалось получить данные профиля');
      }

      setProfileData(data.data);
      setCurrentSteamId(data.data.summary.steamid);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Произошла непредвиденная ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProfile('76561197960287930');
  }, []);

  const handleSaveApiKey = (newKey) => {
    localStorage.setItem('steam_api_key', newKey);
    setApiKey(newKey);
    if (currentSteamId) {
      fetchProfile(currentSteamId, newKey);
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('steam_api_key');
    setApiKey('');
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        apiKey={apiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onSelectDemo={(demoId) => fetchProfile(demoId)}
        currentProfile={profileData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Search Hero */}
        <SearchHero
          onSearch={(query) => fetchProfile(query)}
          loading={loading}
          error={error}
          onSelectDemo={(demoId) => fetchProfile(demoId)}
        />

        {/* Private profile warning notice if applicable */}
        {profileData?.isPrivate && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-700/50 text-amber-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="font-semibold block text-amber-300">Профиль приватный</strong>
              Пользователь ограничил видимость библиотеки игр или инвентаря в настройках приватности Steam. Некоторые метрики могут быть недоступны.
            </div>
          </div>
        )}

        {/* Loaded Profile View */}
        {profileData && (
          <div className="animate-fade-in space-y-6">
            {/* Header: User Avatar, Name, Level, Bans, Age */}
            <ProfileHeader data={profileData} />

            {/* Quick KPI Stat Cards */}
            <StatCards games={profileData.games} />

            {/* Prominent Activity Chart */}
            <ActivityChart activity={profileData.activity} />

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-800/80 gap-2 sm:gap-4 overflow-x-auto pb-1 text-sm pt-4">
              <button
                onClick={() => setActiveTab('games')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium transition-colors shrink-0 ${
                  activeTab === 'games'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Игры и бэклог ({profileData.games.totalCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium transition-colors shrink-0 ${
                  activeTab === 'analytics'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Аналитика времени</span>
              </button>

              <button
                onClick={() => setActiveTab('badges')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium transition-colors shrink-0 ${
                  activeTab === 'badges'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Значки ({profileData.badges.count})</span>
              </button>
            </div>

            {/* Active Tab Content */}
            <div className="pt-2">
              {activeTab === 'games' && <GamesSection games={profileData.games} />}
              {activeTab === 'analytics' && <TimeAnalytics games={profileData.games} summary={profileData.summary} />}
              {activeTab === 'badges' && <BadgesSection badges={profileData.badges} level={profileData.level} />}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
        onRemoveKey={handleRemoveApiKey}
      />
    </div>
  );
}
