import React, { useState } from 'react';
import { Calendar, TrendingUp, Zap, Clock, BarChart3, History } from 'lucide-react';

export function ActivityChart({ activity }) {
  const [period, setPeriod] = useState('week'); // 'week', 'month', 'year', 'fiveYears', 'allTime'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!activity) return null;

  const currentData = activity[period] || activity.week;
  const labels = currentData.labels || [];
  const data = currentData.data || [];
  const maxVal = Math.max(...data, 1);
  const totalHours = currentData.totalPeriodHours || 0;
  const avgHours = data.length > 0 ? (totalHours / data.length).toFixed(1) : 0;
  
  // Find peak index
  let peakIndex = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i] > data[peakIndex]) {
      peakIndex = i;
    }
  }
  const peakVal = data[peakIndex] || 0;
  const peakLabel = labels[peakIndex] || '';

  // SVG Chart Dimensions
  const chartHeight = 220;
  const chartWidth = 760;
  const paddingX = 45;
  const paddingY = 30;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  // Generate points for SVG path
  const points = data.map((val, idx) => {
    const x = paddingX + (data.length > 1 ? (idx / (data.length - 1)) * innerWidth : innerWidth / 2);
    const y = chartHeight - paddingY - (val / maxVal) * innerHeight;
    return { x, y, val, label: labels[idx] };
  });

  // SVG Path strings
  const linePath = points.length > 1
    ? points.reduce((acc, pt, i, arr) => {
        if (i === 0) return `M ${pt.x} ${pt.y}`;
        const prev = arr[i - 1];
        const cpX1 = prev.x + (pt.x - prev.x) / 2;
        const cpX2 = prev.x + (pt.x - prev.x) / 2;
        return `${acc} C ${cpX1} ${prev.y}, ${cpX2} ${pt.y}, ${pt.x} ${pt.y}`;
      }, '')
    : `M ${paddingX} ${points[0]?.y || 0} L ${chartWidth - paddingX} ${points[0]?.y || 0}`;

  const areaPath = points.length > 1
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      {/* Top Header & Period Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-800/60 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">График активности в часах</h3>
              <p className="text-xs text-slate-400 mt-0.5">Динамика наигранного времени по периодам</p>
            </div>
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex flex-wrap items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 self-start md:self-auto text-xs font-medium">
          <button
            onClick={() => { setPeriod('week'); setHoveredIndex(null); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              period === 'week'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => { setPeriod('month'); setHoveredIndex(null); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              period === 'month'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => { setPeriod('year'); setHoveredIndex(null); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              period === 'year'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Год
          </button>
          <button
            onClick={() => { setPeriod('fiveYears'); setHoveredIndex(null); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              period === 'fiveYears'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            5 лет
          </button>
          {activity.allTime && (
            <button
              onClick={() => { setPeriod('allTime'); setHoveredIndex(null); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                period === 'allTime'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>С создания</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats for Selected Period */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              {period === 'allTime' ? 'Всего за всё время' : 'Всего за период'}
            </span>
            <span className="text-xl font-black text-cyan-300 mt-0.5 block">{totalHours.toLocaleString('ru-RU')} ч.</span>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-800/40 text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Среднее значение</span>
            <span className="text-xl font-black text-indigo-300 mt-0.5 block">{avgHours} {currentData.unit}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-800/40 text-indigo-400">
            <BarChart3 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Пиковая активность</span>
            <span className="text-xl font-black text-amber-300 mt-0.5 block truncate" title={`${peakVal} ч. (${peakLabel})`}>
              {peakVal} ч.
            </span>
            <span className="text-[10px] text-slate-500 truncate block mt-0.5">{peakLabel}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-800/40 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* The SVG Graphic Container */}
      <div className="relative bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-4 overflow-hidden">
        {/* Active Hover Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-xl bg-slate-950/95 border border-cyan-500/60 shadow-xl shadow-cyan-950/80 text-center transition-all duration-100"
            style={{
              left: `${(points[hoveredIndex].x / chartWidth) * 100}%`,
              top: `${Math.max(30, (points[hoveredIndex].y / chartHeight) * 100 - 10)}%`
            }}
          >
            <div className="text-xs font-bold text-cyan-300">{points[hoveredIndex].val.toLocaleString('ru-RU')} ч.</div>
            <div className="text-[10px] text-slate-400 whitespace-nowrap">{points[hoveredIndex].label} г.</div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="chartLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = chartHeight - paddingY - ratio * innerHeight;
            const valLabel = Math.round(ratio * maxVal);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {valLabel}ч
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#chartAreaGradient)"
              className="transition-all duration-300"
            />
          )}

          {/* Main Line path */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#chartLineGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#glowEffect)"
              className="transition-all duration-300"
            />
          )}

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            const isPeak = idx === peakIndex;
            
            // For allTime with many years, skip some labels to avoid overcrowding
            let shouldShowLabel = true;
            if (period === 'allTime') {
              if (points.length > 15) {
                shouldShowLabel = idx === 0 || idx === points.length - 1 || idx % 3 === 0;
              } else if (points.length > 8) {
                shouldShowLabel = idx === 0 || idx === points.length - 1 || idx % 2 === 0;
              }
            }

            return (
              <g key={idx} className="cursor-pointer">
                {/* Touch / Hover target */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="16"
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Outer glow halo on hover */}
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="9"
                    fill="#38bdf8"
                    opacity="0.3"
                    className="animate-pulse"
                  />
                )}

                {/* Data point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "6" : isPeak ? "5" : "3.5"}
                  fill={isPeak ? "#fbbf24" : isHovered ? "#38bdf8" : "#0f172a"}
                  stroke={isPeak ? "#f59e0b" : isHovered ? "#ffffff" : "#38bdf8"}
                  strokeWidth={isHovered ? "2.5" : "2"}
                  className="transition-all duration-150"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Bottom X-axis label */}
                {shouldShowLabel && (
                  <text
                    x={pt.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fill={isHovered ? "#38bdf8" : isPeak ? "#fcd34d" : "#94a3b8"}
                    fontSize={period === 'fiveYears' ? '12' : period === 'allTime' ? '10' : period === 'year' ? '10' : '9'}
                    fontWeight={isHovered || isPeak ? '600' : '400'}
                    className="pointer-events-none transition-colors"
                  >
                    {period === 'week'
                      ? pt.label.split(',')[0]
                      : period === 'month'
                      ? `Н${idx + 1}`
                      : pt.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Insight Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 bg-slate-900/40 rounded-xl px-4 py-3 border border-slate-800">
        <div className="flex items-center gap-2 mb-1 sm:mb-0">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>
            {period === 'week' && 'Показана активность за последние 7 дней на основе недавнего времени Steam.'}
            {period === 'month' && 'Показана разбивка последних 4 недель игрового времени.'}
            {period === 'year' && 'Показана динамика за последние 12 месяцев с учетом сезонной активности.'}
            {period === 'fiveYears' && 'Показано суммарное игровое время по годам за последние 5 лет.'}
            {period === 'allTime' && (currentData.creationYear
              ? `Показана вся история активности по годам с момента регистрации в Steam (${currentData.creationYear} г.) по сей день.`
              : 'Показана вся история активности по годам с момента регистрации аккаунта.')}
          </span>
        </div>
        <span className="text-cyan-400 font-medium">Наведите на точки графика для деталей</span>
      </div>
    </div>
  );
}
