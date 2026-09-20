import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, Sparkles, Heart } from 'lucide-react';
import { buildShareUrl, saveDedicationToStorage } from '../utils/urlParams';

export default function ShareModal({ isOpen, onClose, dedication, onUpdateDedication }) {
  const [formData, setFormData] = useState(dedication);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    const text = `🌻 ¡Hola ${formData.to}! Te preparé un detalle especial por el Día de las Flores Amarillas: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-200">
        {/* Top Washi Tape */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-36 h-7 washi-tape rotate-[-1deg] rounded-sm pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-amber-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sunflower-100 text-sunflower-900 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sunflower-600" />
            <span>Personalizar Dedicatoria</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-stone-800 font-bold">
            Hazlo Único Para Ella
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Personaliza los nombres y la dedicatoria para generar un enlace único listo para enviar.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Para (Nombre de ella):
              </label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="Ej: Camila, Mi amor..."
                className="w-full px-3.5 py-2 rounded-xl bg-amber-50/60 border border-amber-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                De (Tu nombre o firma):
              </label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                placeholder="Ej: Tu chico, Mateo..."
                className="w-full px-3.5 py-2 rounded-xl bg-amber-50/60 border border-amber-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Mensaje en la carta secreta:
            </label>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="Escribe lo que sientes por ella en este día especial..."
              className="w-full px-3.5 py-2 rounded-xl bg-amber-50/60 border border-amber-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none font-serif"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-sunflower-400 hover:bg-sunflower-500 text-stone-900 font-sans font-semibold text-sm shadow-md transition-all"
            >
              Aplicar a esta página 🌻
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 py-2.5 px-3 rounded-full bg-white border border-amber-300 hover:bg-amber-50 text-stone-800 font-sans font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">¡Enlace copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-700" />
                    <span>Copiar Enlace Personalizado</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="py-2.5 px-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-sans font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                title="Compartir directo a WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
