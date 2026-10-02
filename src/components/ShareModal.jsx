import React, { useState } from 'react';
import { X, Copy, Check, Send, Sparkles, RefreshCw } from 'lucide-react';
import { THEMES, THEME_KEYS, getTheme } from '../config/themes';
import { buildShareUrl, saveDedicationToStorage } from '../utils/urlParams';

export default function ShareModal({ isOpen, onClose, dedication, onUpdateDedication }) {
  const [formData, setFormData] = useState(dedication);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentTheme = getTheme(formData.theme);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (newThemeId) => {
    const newTheme = getTheme(newThemeId);
    setFormData((prev) => ({
      ...prev,
      theme: newThemeId,
      message: newTheme.defaultMessage,
      date: newTheme.defaultDate
    }));
  };

  const handleResetDefaultMessage = () => {
    setFormData((prev) => ({
      ...prev,
      message: currentTheme.defaultMessage,
      date: currentTheme.defaultDate
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateDedication(formData);
    saveDedicationToStorage(formData);
    onClose();
  };

  const shareUrl = buildShareUrl(formData);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleWhatsApp = () => {
    let text = `🌻 ¡Hola ${formData.to}! Te preparé un detalle especial por el Día de las Flores Amarillas: ${shareUrl}`;
    if (formData.theme === 'cumpleanos') {
      text = `🎂 ¡Hola ${formData.to}! Te preparé un detalle muy especial para celebrar tu cumpleaños: ${shareUrl}`;
    } else if (formData.theme === 'logro-profesional') {
      text = `🎓 ¡Muchas felicidades ${formData.to}! Te preparé este homenaje por tu gran logro profesional: ${shareUrl}`;
    } else if (formData.theme === 'aniversario') {
      text = `💖 ¡Hola mi amor ${formData.to}! Te preparé un detalle especial por nuestro aniversario: ${shareUrl}`;
    }
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
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
            Elige la ocasión, los nombres y la dedicatoria para generar un enlace listo para compartir.
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
              value={formData.message}
              onChange={handleChange}
              placeholder="Escribe tus palabras especiales..."
              className="w-full px-3.5 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none font-serif leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col gap-2.5 font-sans">
            <button
              type="submit"
              className={`w-full py-3 rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-98 transition-all ${currentTheme.palette.buttonGradient}`}
            >
              Aplicar cambios a esta página {currentTheme.emoji}
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="py-2.5 px-3 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">¡Enlace copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-500" />
                    <span>Copiar Enlace Personalizado</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="py-2.5 px-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Compartir por WhatsApp</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
