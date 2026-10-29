import React from 'react';
import { Key, Sparkles, Gamepad2, ShieldCheck, ShieldAlert } from 'lucide-react';

export function Navbar({ onOpenApiKeyModal, apiKey, onSelectDemo, currentProfile }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0e17]/85 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectDemo('76561197960287930')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                SteamStats
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/50 text-cyan-300">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Полная статистика аккаунта Steam</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Profiles Dropdown / Buttons */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Демо:
            </span>
            <button
              onClick={() => onSelectDemo('76561197960287930')}
              className={`px-2.5 py-1 rounded transition-colors ${
                currentProfile?.summary?.steamid === '76561197960287930'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Gabe Newell
            </button>
            <button
              onClick={() => onSelectDemo('76561198034202275')}
              className={`px-2.5 py-1 rounded transition-colors ${
                currentProfile?.summary?.steamid === '76561198034202275'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              s1mple (CS2)
            </button>
            <button
              onClick={() => onSelectDemo('76561198123456789')}
              className={`px-2.5 py-1 rounded transition-colors ${
                currentProfile?.summary?.steamid === '76561198123456789'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Коллекционер
            </button>
          </div>

          {/* API Key settings button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
              apiKey
                ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/50 shadow-sm shadow-emerald-950'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title={apiKey ? "API Ключ подключен" : "Настроить Steam API Key"}
          >
            <Key className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">
              {apiKey ? 'API Ключ активен' : 'Steam API Key'}
            </span>
            {apiKey ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400/80" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
