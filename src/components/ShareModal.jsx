import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Send, Sparkles, RefreshCw, Link2, Share2, Loader2 } from 'lucide-react';
import { THEMES, THEME_KEYS, getTheme } from '../config/themes';
import { resolveThemeMeta } from '../../shared/dedication.js';
import {
  buildCompactShareUrl,
  buildWhatsAppShareUrl,
  getCachedShortShareUrl,
  resolveShortShareUrl,
  saveDedicationToStorage
} from '../utils/urlParams';

export default function ShareModal({ isOpen, onClose, dedication, onUpdateDedication }) {
  const [formData, setFormData] = useState(dedication);
  const [copied, setCopied] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(dedication);
      setResolvedUrl(getCachedShortShareUrl(dedication));
      setCopied(false);
    }
  }, [isOpen, dedication]);

  if (!isOpen) return null;

  const currentTheme = getTheme(formData.theme);
  const cachedShort = resolvedUrl || getCachedShortShareUrl(formData);
  const compactUrl = buildCompactShareUrl(formData);
  const previewUrl = cachedShort || compactUrl;
  const isShortActive = Boolean(cachedShort);
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResolvedUrl(null);
    setCopied(false);
  };

  const handleThemeChange = (newThemeId) => {
    const newTheme = getTheme(newThemeId);
    const nextData = {
      ...formData,
      theme: newThemeId,
      message: newTheme.defaultMessage,
      date: newTheme.defaultDate
    };
    setFormData(nextData);
    setResolvedUrl(getCachedShortShareUrl(nextData));
    setCopied(false);
  };

  const handleResetDefaultMessage = () => {
    const nextData = {
      ...formData,
      message: currentTheme.defaultMessage,
      date: currentTheme.defaultDate
    };
    setFormData(nextData);
    setResolvedUrl(getCachedShortShareUrl(nextData));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateDedication(formData);
    saveDedicationToStorage(formData);
    onClose();
  };

  const resolveCurrentUrl = async () => {
    const existing = getCachedShortShareUrl(formData);
    if (existing) {
      setResolvedUrl(existing);
      return existing;
    }
    setIsShortening(true);
    try {
      const result = await resolveShortShareUrl(formData);
      if (result.mode === 'short') {
        setResolvedUrl(result.url);
      }
      return result.url;
    } finally {
      setIsShortening(false);
    }
  };

  const copyTextSafe = async (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    document.body.removeChild(helper);
  };

  const handleCopy = async () => {
    onUpdateDedication(formData);
    saveDedicationToStorage(formData);
    const finalUrl = await resolveCurrentUrl();
    try {
      await copyTextSafe(finalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleWhatsApp = async () => {
    onUpdateDedication(formData);
    saveDedicationToStorage(formData);

    const existing = getCachedShortShareUrl(formData);
    if (existing) {
      window.open(buildWhatsAppShareUrl(formData, existing), '_blank', 'noopener,noreferrer');
      return;
    }

    // Abrir pestaña dentro del gesto síncrono del usuario para evitar bloqueo de popups en Safari/Chrome
    const popup = window.open('about:blank', '_blank');
    if (popup && popup.document) {
      popup.document.write(
        '<p style="font-family:sans-serif;text-align:center;margin-top:40vh;color:#57534e">Preparando enlace corto para WhatsApp...</p>'
      );
    }

    const finalUrl = await resolveCurrentUrl();
    const waUrl = buildWhatsAppShareUrl(formData, finalUrl);
    if (popup && !popup.closed) {
      popup.location.replace(waUrl);
    } else {
      window.location.assign(waUrl);
    }
  };

  const handleNativeShare = async () => {
    onUpdateDedication(formData);
    saveDedicationToStorage(formData);
    const shareUrl = previewUrl;
    const meta = resolveThemeMeta(formData.theme);
    try {
      await navigator.share({
        title: meta.ogTitle(formData.to, formData.from),
        text: meta.whatsappText(formData.to, '').replace(/:\s*$/, ''),
        url: shareUrl
      });
    } catch {
      // Cancelado por el usuario
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FFFDF9] rounded-3xl p-5 sm:p-8 shadow-2xl border border-stone-200 my-auto">
        {/* Top Washi Tape */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-36 h-7 washi-tape rotate-[-1deg] rounded-sm pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Personalizar Detalle Virtual</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-stone-800 font-bold">
            Hazlo Único & Especial
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Elige la ocasión, los nombres y la dedicatoria para generar un enlace corto listo para compartir.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* 1. Theme / Occasion Selector */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              1. Selecciona la Ocasión:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEME_KEYS.map((key) => {
                const t = THEMES[key];
                const isSelected = formData.theme === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleThemeChange(key)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all text-xs font-sans ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold shadow-xs ring-2 ring-amber-300/50'
                        : 'border-stone-200 hover:border-stone-300 text-stone-600'
                    }`}
                  >
                    <span className="block text-lg">{t.emoji}</span>
                    <span className="truncate block mt-0.5">{t.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Para (Destinatario/a):
              </label>
              <input
                type="text"
                name="to"
                maxLength={80}
                value={formData.to}
                onChange={handleChange}
                placeholder="Ej: Camila, Mi amor..."
                className="w-full px-3.5 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                De (Tu nombre o firma):
              </label>
              <input
                type="text"
                name="from"
                maxLength={80}
                value={formData.from}
                onChange={handleChange}
                placeholder="Ej: Mateo, Tu amiga..."
                className="w-full px-3.5 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans"
                required
              />
            </div>
          </div>

          {/* 3. Message */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                Mensaje en la carta secreta:
              </label>
              <button
                type="button"
                onClick={handleResetDefaultMessage}
                className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-sans font-medium hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restaurar mensaje sugerido</span>
              </button>
            </div>
            <textarea
              name="message"
              rows={3}
              maxLength={1500}
              value={formData.message}
              onChange={handleChange}
              placeholder="Escribe tus palabras especiales..."
              className="w-full px-3.5 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none font-serif leading-relaxed"
            />
          </div>

          {/* Compact / Short URL Preview Pill */}
          <div className="rounded-2xl bg-stone-50 border border-stone-200/80 px-3.5 py-2.5 flex items-center justify-between gap-2">
            <div className="min-w-0 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-mono text-stone-700 truncate">{previewUrl}</p>
                <p className="text-[10px] text-stone-500">
                  {isShortActive
                    ? `⚡ Link ultra corto (${previewUrl.length} caracteres)`
                    : `📦 Enlace compacto (${previewUrl.length} caracteres) · se acorta al compartir`}
                </p>
              </div>
            </div>
            {!isShortActive && (
              <button
                type="button"
                onClick={resolveCurrentUrl}
                disabled={isShortening}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 border border-stone-200 text-[11px] font-semibold text-stone-700 transition-colors disabled:opacity-60"
              >
                {isShortening ? 'Acortando...' : 'Acortar'}
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-1 flex flex-col gap-2.5 font-sans">
            <button
              type="submit"
              className={`w-full py-3 rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-98 transition-all ${currentTheme.palette.buttonGradient}`}
            >
              Aplicar cambios a esta página {currentTheme.emoji}
            </button>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={isShortening}
                className="flex-1 py-2.5 px-3 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-60"
              >
                {isShortening ? (
                  <>
                    <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>Generando enlace...</span>
                  </>
                ) : copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">¡Enlace corto copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-500" />
                    <span>Copiar Enlace Corto</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={isShortening}
                className="flex-1 py-2.5 px-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Compartir por WhatsApp</span>
              </button>

              {canNativeShare && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  title="Compartir con otra app"
                  className="py-2.5 px-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="sm:hidden">Otras apps</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
