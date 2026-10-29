import React, { useState } from 'react';
import { Search, Loader2, Sparkles, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';

export function SearchHero({ onSearch, loading, error, onSelectDemo }) {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  return (
    <div className="relative py-8 md:py-12 px-4 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/40 text-cyan-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Анализ игр, библиотеки, наигранных часов и стоимости</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
          Узнай всё о профиле <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Steam</span>
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-8">
          Введите SteamID, ссылку на профиль или кастомный никнейм, чтобы увидеть детальную статистику, недавнюю активность, значки и оценку библиотеки.
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-2xl shadow-cyan-950/50 rounded-2xl p-1.5 bg-[#0f1422] border border-slate-700/80 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <div className="pl-3.5 pr-2 text-slate-400">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Вставьте ссылку на профиль, SteamID64 или ник (напр. gabelogannewell)..."
              disabled={loading}
              className="w-full bg-transparent border-0 focus:outline-none text-white text-sm md:text-base placeholder-slate-500 py-2.5 px-2"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/25 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Загрузка...</span>
                </>
              ) : (
                <>
                  <span>Анализ</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Demo Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Или выберите готовый:
          </span>
          <button
            onClick={() => onSelectDemo('76561197960287930')}
            className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            👑 Gabe Newell
          </button>
          <button
            onClick={() => onSelectDemo('76561198034202275')}
            className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            🎯 s1mple (CS2)
          </button>
          <button
            onClick={() => onSelectDemo('76561198123456789')}
            className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            🏆 Коллекционер (320 lvl)
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-6 max-w-2xl mx-auto p-4 rounded-xl bg-red-950/40 border border-red-700/50 text-red-200 text-sm flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-300">Ошибка запроса</p>
              <p className="text-xs text-red-200/90 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
