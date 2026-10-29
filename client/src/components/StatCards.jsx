import React from 'react';
import { Clock, Gamepad2, DollarSign, Flame, Activity, Trophy } from 'lucide-react';

export function StatCards({ games }) {
  const topGame = games.topGames?.[0];
  const topGameShare = topGame && games.totalHours > 0
    ? Math.round((topGame.playtime_hours / games.totalHours) * 100)
    : 0;

  const cards = [
    {
      title: 'Всего наиграно',
      mainValue: `${games.totalHours.toLocaleString('ru-RU')} ч.`,
      subValue: `${games.totalDays} дн. (${games.totalMonths} мес. непрерывно)`,
      icon: Clock,
      gradient: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-400'
    },
    {
      title: 'Библиотека игр',
      mainValue: `${games.totalCount} игр`,
      subValue: `Запущено ${games.playedCount} (${games.playedPercentage}%), не запущено ${games.unplayedCount}`,
      icon: Gamepad2,
      gradient: 'from-indigo-500/10 to-purple-500/10 border-indigo-500/30 text-indigo-400'
    },
    {
      title: 'Оценка библиотеки',
      mainValue: `~$${games.estimatedValue.avg.toLocaleString('ru-RU')}`,
      subValue: `Диапазон: $${games.estimatedValue.min.toLocaleString('ru-RU')} – $${games.estimatedValue.max.toLocaleString('ru-RU')}`,
      icon: DollarSign,
      gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400'
    },
    {
      title: 'За последние 2 недели',
      mainValue: `${games.recent2WeeksHours} ч.`,
      subValue: games.recent2WeeksHours > 0
        ? `~${(games.recent2WeeksHours / 14).toFixed(1)} ч. в день`
        : 'Не запускал игры в Steam за 14 дней',
      icon: Flame,
      gradient: 'from-rose-500/10 to-orange-500/10 border-rose-500/30 text-rose-400'
    },
    {
      title: 'Среднее время на игру',
      mainValue: `${games.avgHoursPerGame} ч.`,
      subValue: 'Среди запущенных игр библиотеки',
      icon: Activity,
      gradient: 'from-amber-500/10 to-yellow-500/10 border-amber-500/30 text-amber-400'
    },
    {
      title: 'Топ-1 игра профиля',
      mainValue: topGame ? `${topGame.name}` : 'Нет данных',
      subValue: topGame ? `${topGame.playtime_hours.toLocaleString('ru-RU')} ч. (${topGameShare}% всего времени)` : '-',
      icon: Trophy,
      gradient: 'from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`relative bg-[#0d1322] border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-cyan-500/5 ${card.gradient}`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                {card.title}
              </span>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-white tracking-tight truncate" title={card.mainValue}>
                {card.mainValue}
              </div>
              <p className="text-xs text-slate-400 mt-1 truncate" title={card.subValue}>
                {card.subValue}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
