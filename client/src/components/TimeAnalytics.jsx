import React, { useState } from 'react';
import { Hourglass, BookOpen, Globe2, Briefcase, Share2, Check, Zap } from 'lucide-react';

export function TimeAnalytics({ games, summary }) {
  const [copied, setCopied] = useState(false);
  const totalHours = games.totalHours;

  // Real world equivalents
  const booksRead = Math.round(totalHours / 6); // ~6 hrs per book
  const languagesLearned = +(totalHours / 600).toFixed(1); // ~600 hrs to reach B2 in Spanish/French
  const workWeeks = +(totalHours / 40).toFixed(1); // 40-hr work weeks
  const flightsAroundEarth = +(totalHours / 45).toFixed(1); // ~45h flight

  const handleShare = () => {
    const text = `🎮 Статистика Steam игрока ${summary.personaname}:
⏱ Всего наиграно: ${totalHours.toLocaleString('ru-RU')} часов (${games.totalDays} дней непрерывной игры)
🕹 Библиотека: ${games.totalCount} игр (запущено ${games.playedCount})
💰 Оценка аккаунта: ~$${games.estimatedValue.avg}
🏆 Топ игра: ${games.topGames?.[0]?.name || 'Игры'} (${games.topGames?.[0]?.playtime_hours || 0} ч.)
Узнай свою статистику в SteamStats!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[#0e1424] border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Hourglass className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Анализ инвестиций времени</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            На что эквивалентны {totalHours.toLocaleString('ru-RU')} часов, проведённых в видеоиграх
          </p>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
          <span>{copied ? 'Скопировано в буфер!' : 'Скопировать визитку геймера'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-700/50 text-indigo-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">~{booksRead.toLocaleString('ru-RU')}</div>
            <p className="text-xs text-slate-400 mt-0.5">Прочитанных книг по 200–300 страниц</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">~{languagesLearned}</div>
            <p className="text-xs text-slate-400 mt-0.5">Иностранных языков до уровня B2</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-700/50 text-amber-400 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{workWeeks}</div>
            <p className="text-xs text-slate-400 mt-0.5">Полных рабочих 40-часовых недель</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-700/50 text-rose-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{flightsAroundEarth}</div>
            <p className="text-xs text-slate-400 mt-0.5">Кругосветных беспосадочных перелётов</p>
          </div>
        </div>
      </div>
    </div>
  );
}
