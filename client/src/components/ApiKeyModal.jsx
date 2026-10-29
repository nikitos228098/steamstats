import React, { useState } from 'react';
import { X, Key, ExternalLink, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export function ApiKeyModal({ isOpen, onClose, apiKey, onSaveKey, onRemoveKey }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (keyInput.trim()) {
      onSaveKey(keyInput.trim());
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    }
  };

  const handleRemove = () => {
    setKeyInput('');
    onRemoveKey();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1424] border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-cyan-950/70 border border-cyan-800/60 text-cyan-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Steam Web API Ключ</h3>
            <p className="text-xs text-slate-400">Для поиска любых публичных профилей в реальном времени</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Ключ сохраняется <strong>только в вашем браузере</strong> (LocalStorage) и используется напрямую для запросов к Steam API.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span>Получить бесплатный ключ можно за 1 минуту:</span>
              <a
                href="https://steamcommunity.com/dev/apikey"
                target="_blank"
                rel="noreferrer"
                className="block text-cyan-400 hover:underline font-semibold mt-0.5"
              >
                steamcommunity.com/dev/apikey &rarr;
              </a>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                (В поле "Domain Name" можно указать любое имя, например localhost).
              </span>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Ваш 32-значный ключ Steam API
            </label>
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-700/50 p-2.5 rounded-xl">
              <CheckCircle className="w-4 h-4" />
              <span>Ключ успешно сохранён! Загружаем профиль...</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            {apiKey ? (
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors border border-transparent hover:border-rose-800/40"
              >
                Удалить ключ
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!keyInput.trim()}
                className="px-5 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
              >
                Сохранить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
