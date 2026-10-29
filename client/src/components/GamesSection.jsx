import React, { useState, useMemo } from 'react';
import { Search, Trophy, ExternalLink, ArrowUpDown, Clock, CheckCircle2, CircleDashed } from 'lucide-react';

export function GamesSection({ games }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'played', 'unplayed'
  const [sortBy, setSortBy] = useState('playtime'); // 'playtime', 'name', 'recent'

  // Filter and sort games list
  const filteredGames = useMemo(() => {
    let list = games.allGames || [];

    if (filterMode === 'played') {
      list = list.filter(g => g.playtime_forever > 0);
    } else if (filterMode === 'unplayed') {
      list = list.filter(g => g.playtime_forever === 0);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(g => g.name.toLowerCase().includes(q));
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'playtime') {
        return b.playtime_forever - a.playtime_forever;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'recent') {
        return (b.rtime_last_played || 0) - (a.rtime_last_played || 0);
      }
      return 0;
    });
  }, [games.allGames, filterMode, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Top 4 Featured Games Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Самые запускаемые игры</h3>
          </div>
          <span className="text-xs text-slate-400">Топ по общему времени</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {games.topGames?.slice(0, 4).map((game, idx) => (
            <div
              key={game.appid}
              className="group bg-[#0d1322] border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="relative aspect-[460/215] w-full overflow-hidden bg-slate-900">
                <img
                  src={game.header_url}
                  alt={game.name}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if steam image fails
                    e.target.src = 'https://store.steampowered.com/favicon.ico';
                    e.target.className = 'w-12 h-12 m-auto opacity-50';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span>#{idx + 1}</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-cyan-300 transition-colors" title={game.name}>
                    {game.name}
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> Время:
                    </span>
                    <strong className="text-cyan-300 font-semibold">
                      {game.playtime_hours.toLocaleString('ru-RU')} ч.
                    </strong>
                  </div>
                  {game.playtime_2weeks_hours > 0 && (
                    <div className="mt-1 flex items-center justify-between text-[11px] text-emerald-400">
                      <span>За 2 недели:</span>
                      <span>+{game.playtime_2weeks_hours} ч.</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <a
                    href={`https://store.steampowered.com/app/${game.appid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                  >
                    <span>В магазин</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] text-slate-400 font-mono">AppID: {game.appid}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backlog & Pile of Shame Progress */}
      <div className="bg-[#0e1424] border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="font-bold text-sm text-white">Бэклог и процент пройденных игр</h4>
            <p className="text-xs text-slate-400">Сколько игр из библиотеки было запущено хотя бы раз</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Сыграно: {games.playedCount} ({games.playedPercentage}%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <CircleDashed className="w-3.5 h-3.5" /> Не тронуто: {games.unplayedCount} ({games.unplayedPercentage}%)
            </span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${games.playedPercentage}%` }}
            title={`Сыграно: ${games.playedPercentage}%`}
          />
          <div
            className="h-full bg-slate-700/60"
            style={{ width: `${games.unplayedPercentage}%` }}
            title={`Не запущено: ${games.unplayedPercentage}%`}
          />
        </div>
      </div>

      {/* Search & Filterable Table / List of All Games */}
      <div className="bg-[#0e1424] border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию игры..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filterMode === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Все ({games.totalCount})
              </button>
              <button
                onClick={() => setFilterMode('played')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filterMode === 'played' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Сыгранные ({games.playedCount})
              </button>
              <button
                onClick={() => setFilterMode('unplayed')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filterMode === 'unplayed' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Не запущено ({games.unplayedCount})
              </button>
            </div>

            {/* Sort by dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 text-white focus:outline-none cursor-pointer"
              >
                <option value="playtime" className="bg-slate-900">По времени (убыв.)</option>
                <option value="name" className="bg-slate-900">По алфавиту</option>
                <option value="recent" className="bg-slate-900">По недавним</option>
              </select>
            </div>
          </div>
        </div>

        {/* Games Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Игра</th>
                <th className="py-3 px-3 text-right">Наиграно</th>
                <th className="py-3 px-3 text-right hidden sm:table-cell">За 2 недели</th>
                <th className="py-3 px-3 text-right hidden md:table-cell">AppID</th>
                <th className="py-3 px-3 text-center">Магазин</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredGames.slice(0, 50).map((game) => (
                <tr key={game.appid} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-3">
                    {game.icon_url ? (
                      <img
                        src={game.icon_url}
                        alt=""
                        className="w-7 h-7 rounded shrink-0 bg-slate-800"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center shrink-0 text-slate-500">
                        🎮
                      </div>
                    )}
                    <span className="font-medium text-slate-200 line-clamp-1">{game.name}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-200">
                    {game.playtime_hours > 0 ? (
                      <span className="text-cyan-300">{game.playtime_hours.toLocaleString('ru-RU')} ч.</span>
                    ) : (
                      <span className="text-slate-500">0 ч.</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right hidden sm:table-cell">
                    {game.playtime_2weeks_hours > 0 ? (
                      <span className="text-emerald-400 font-medium">+{game.playtime_2weeks_hours} ч.</span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 font-mono hidden md:table-cell">
                    {game.appid}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <a
                      href={`https://store.steampowered.com/app/${game.appid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Открыть страницу игры в магазине Steam"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}

              {filteredGames.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">
                    Игры не найдены по заданным критериям
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredGames.length > 50 && (
          <p className="text-center text-xs text-slate-500 mt-4">
            Показаны первые 50 из {filteredGames.length} найденных игр. Используйте поиск для точного выбора.
          </p>
        )}
      </div>
    </div>
  );
}
