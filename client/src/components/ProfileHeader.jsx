import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldCheck, ShieldAlert, Calendar, Clock, Gamepad, Award } from 'lucide-react';

export function ProfileHeader({ data }) {
  const [copied, setCopied] = useState(false);
  const { summary, bans, level, badges } = data;

  const handleCopyId = () => {
    navigator.clipboard.writeText(summary.steamid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#0e1424] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl overflow-hidden mb-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Avatar + Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
          {/* Avatar Container */}
          <div className="relative shrink-0">
            <div className={`p-1 rounded-2xl bg-gradient-to-b ${
              summary.inGame
                ? 'from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/30'
                : summary.status.label === 'В сети'
                ? 'from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20'
                : 'from-slate-700 to-slate-800'
            }`}>
              <img
                src={summary.avatar}
                alt={summary.personaname}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover bg-slate-900"
              />
            </div>

            {/* Status dot */}
            <span
              className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-[#0e1424] ${
                summary.inGame
                  ? 'bg-emerald-400'
                  : summary.status.label === 'В сети'
                  ? 'bg-cyan-400'
                  : 'bg-slate-500'
              }`}
            />
          </div>

          {/* User Names & Status */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {summary.personaname}
              </h2>
              {summary.countryCode && (
                <span className="text-sm px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                  🌍 {summary.countryCode}
                </span>
              )}
            </div>

            {summary.realname && (
              <p className="text-sm text-slate-400 font-medium">
                {summary.realname}
              </p>
            )}

            {/* Current Activity Status */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              {summary.inGame ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 text-xs font-semibold">
                  <Gamepad className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  В игре: {summary.inGame.name}
                </span>
              ) : (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${summary.status.badgeBg} ${summary.status.border} ${summary.status.color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {summary.status.label}
                </span>
              )}

              {/* SteamID copy button */}
              <button
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition-colors"
                title="Скопировать SteamID64"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                <span className="font-mono">{summary.steamid}</span>
              </button>

              {/* External Profile link */}
              {summary.profileurl && (
                <a
                  href={summary.profileurl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>В Steam</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Level & Bans */}
        <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-4 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          {/* Steam Level Card */}
          <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl min-w-[200px]">
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0d1322] rounded-full flex flex-col items-center justify-center">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">LVL</span>
                <span className="text-xl font-black text-white leading-none">{level.level}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400">Опыт Steam</span>
                <span className="font-bold text-slate-200">{level.xp.toLocaleString('ru-RU')} XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, level.progressPercent)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                До уровня {level.level + 1}: <span className="text-cyan-400 font-medium">{level.xpNeededToNextLevel} XP</span>
              </p>
            </div>
          </div>

          {/* Ban status box */}
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-center">
            <span className="text-xs text-slate-400 mb-1 flex items-center gap-1">
              Блокировки:
            </span>
            {bans.hasAnyBan ? (
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                <span>
                  {bans.vacBanned ? `VAC-бан (${bans.numberOfVACBans})` : 'Имеется блокировка'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Чистый аккаунт (No VAC)</span>
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Дней с последнего бана: <span className="text-slate-200">{bans.daysSinceLastBan}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar: Registration & Friends */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>
              Регистрация: <strong className="text-slate-200 font-medium">{summary.createdDateFormatted}</strong>
            </span>
          </div>
          {summary.accountAgeYears > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>
                Возраст аккаунта: <strong className="text-slate-200 font-medium">{summary.accountAgeYears} года</strong> ({summary.accountAgeDays.toLocaleString('ru-RU')} дн.)
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Значков: <strong className="text-slate-200 font-medium">{badges.count}</strong></span>
          </div>
          <div>
            <span>Друзей: <strong className="text-slate-200 font-medium">{data.friends?.count || 0}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
