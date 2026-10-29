import React from 'react';
import { Gamepad2, Heart, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#0a0e17] py-8 px-4 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">SteamStats Analytics</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <p className="max-w-md text-slate-400">
          Steam и логотип Steam являются зарегистрированными товарными знаками Valve Corporation. Данный сайт не аффилирован с Valve Corporation.
        </p>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Сделано с</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>для геймеров</span>
        </div>
      </div>
    </footer>
  );
}
