import React from 'react';
import { Award, Sparkles } from 'lucide-react';

export function BadgesSection({ badges, level }) {
  if (!badges || !badges.list || badges.list.length === 0) {
    return (
      <div className="bg-[#0e1424] border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
        Значки профиля скрыты настройками приватности Steam.
      </div>
    );
  }

  return (
    <div className="bg-[#0e1424] border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Значки и достижения</h3>
        </div>
        <span className="text-xs text-slate-400">
          Всего значков: <strong className="text-cyan-400">{badges.count}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.list.map((badge, idx) => (
          <div
            key={badge.badgeid || idx}
            className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 p-1 border border-slate-700/60 overflow-hidden">
              {badge.icon ? (
                <img src={badge.icon} alt={badge.name} className="w-full h-full object-contain" />
              ) : (
                <Sparkles className="w-5 h-5 text-amber-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-xs text-slate-100 truncate" title={badge.name}>
                {badge.name}
              </h4>
              <p className="text-[11px] text-slate-400 truncate" title={badge.description}>
                {badge.description || `Уровень ${badge.level}`}
              </p>
              <div className="mt-1 flex items-center justify-between text-[10px]">
                <span className="text-cyan-400 font-medium">+{badge.xp} XP</span>
                <span className="text-slate-400">Ур. {badge.level}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
