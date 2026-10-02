import React, { useState, useRef } from 'react';
import { toBlob } from 'html-to-image';
import {
  Download,
  Share2,
  Copy,
  Check,
  X,
  Sparkles,
  ExternalLink,
  Loader2,
  Music2,
  Smartphone,
  Square
} from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import TikTokIcon from './TikTokIcon';
import { getTheme } from '../config/themes';

export default function BragModal({
  isOpen,
  onClose,
  themeId = 'flores-amarillas',
  recipientName = 'Mi Persona Favorita',
  senderName = 'Alguien que te quiere'
}) {
  const activeTheme = getTheme(themeId);
  const [format, setFormat] = useState('story'); // 'story' (9:16) or 'post' (1:1)
  const [cardStyle, setCardStyle] = useState('spring'); // 'spring', 'night', 'sunset'
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const cardRef = useRef(null);

  if (!isOpen) return null;

  const getCustomUrl = () => {
    const url = new URL(window.location.origin + window.location.pathname);
    if (themeId && themeId !== 'flores-amarillas') url.searchParams.set('theme', themeId);
    if (recipientName) url.searchParams.set('to', recipientName);
    if (senderName) url.searchParams.set('from', senderName);
    return url.toString();
  };

  // Generate PNG Blob from the Card
  const generateBlob = async () => {
    if (!cardRef.current) return null;
    return await toBlob(cardRef.current, {
      quality: 0.98,
      pixelRatio: 3, // HD sharpness (1080p equivalent)
      cacheBust: true,
    });
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // 📲 Native Share for Mobile (Instagram, TikTok, WhatsApp, etc.)
  const handleNativeShare = async (platformName = 'Redes') => {
    try {
      setIsGenerating(true);
      setStatusMessage(`Generando formato para ${platformName}...`);

      const blob = await generateBlob();
      if (!blob) throw new Error('No se pudo generar la imagen');

      const fileName = `${activeTheme.id}-${recipientName.toLowerCase().replace(/\s+/g, '-')}-${format}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        setStatusMessage('Abriendo menú de compartir...');
        await navigator.share({
          files: [file],
          title: `${activeTheme.brag.title} ${activeTheme.emoji}`,
          text: `${activeTheme.brag.title} ${activeTheme.brag.hashtags} ${getCustomUrl()}`,
        });
        setStatusMessage('¡Compartido con éxito!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        // Fallback: Automatic download on desktop or unsupported devices
        downloadBlob(blob, fileName);
        setStatusMessage('¡Imagen HD descargada lista para compartir!');
        setTimeout(() => setStatusMessage(''), 3500);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Share error, downloading instead:', err);
        try {
          const blob = await generateBlob();
          if (blob) {
            downloadBlob(blob, `${activeTheme.id}-${recipientName}-${format}.png`);
            setStatusMessage('¡Imagen descargada!');
          }
        } catch (e) {}
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // 📥 Download Direct HD PNG
  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setStatusMessage('Generando imagen en alta resolución...');
      const blob = await generateBlob();
      if (blob) {
        downloadBlob(
          blob,
          `${activeTheme.id}-${recipientName.toLowerCase().replace(/\s+/g, '-')}-${format}.png`
        );
        setStatusMessage('¡Descarga completada con éxito!');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error al descargar');
    } finally {
      setIsGenerating(false);
    }
  };

  // 📋 Copy Image to Clipboard (Desktop)
  const handleCopyImage = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateBlob();
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedImage(true);
        setStatusMessage('¡Imagen copiada al portapapeles! Pégala con Ctrl+V');
        setTimeout(() => {
          setCopiedImage(false);
          setStatusMessage('');
        }, 3000);
      } else {
        handleDownload();
      }
    } catch (err) {
      console.warn('Clipboard write failed, downloading instead:', err);
      handleDownload();
    } finally {
      setIsGenerating(false);
    }
  };

  // 🔗 Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(getCustomUrl());
    setCopiedLink(true);
    setStatusMessage('¡Enlace copiado para pegarlo en tu historia o biografía!');
    setTimeout(() => {
      setCopiedLink(false);
      setStatusMessage('');
    }, 2500);
  };

  // Theme Styles Configuration
  const styleVariants = {
    spring: {
      background: 'radial-gradient(circle at 50% 20%, #FFFDF5 0%, #FEF9C3 50%, #FDE047 100%)',
      titleColor: 'text-stone-900',
      accentColor: 'text-amber-600',
      tagBg: 'bg-white/90 text-amber-950 border-amber-300/80',
      quoteColor: 'text-stone-800',
      footerColor: 'text-amber-900 border-amber-300/70',
      border: 'border-amber-300',
      glow: 'bg-amber-400/35',
      isDark: false
    },
    night: {
      background: 'radial-gradient(circle at 50% 25%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
      titleColor: 'text-white',
      accentColor: 'text-yellow-400',
      tagBg: 'bg-slate-800/90 text-yellow-300 border-yellow-500/40',
      quoteColor: 'text-amber-100',
      footerColor: 'text-amber-200/90 border-slate-700/80',
      border: 'border-yellow-500/40',
      glow: 'bg-yellow-400/25',
      isDark: true
    },
    sunset: {
      background: 'radial-gradient(circle at 50% 25%, #fff1f2 0%, #fde047 50%, #fb923c 100%)',
      titleColor: 'text-stone-900',
      accentColor: 'text-rose-700',
      tagBg: 'bg-white/90 text-rose-950 border-rose-300/80',
      quoteColor: 'text-stone-900',
      footerColor: 'text-rose-950 border-rose-300/60',
      border: 'border-rose-300',
      glow: 'bg-orange-400/35',
      isDark: false
    }
  };

  const currentStyle = styleVariants[cardStyle];

  // Helper for Centerpiece Graphic inside Card
  const renderCardGraphic = () => {
    if (activeTheme.id === 'cumpleanos') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-md">
          <ellipse cx="50" cy="85" rx="35" ry="6" fill="#E2E8F0" />
          <rect x="25" y="55" width="50" height="28" rx="4" fill="#FFF1F2" stroke="#FB7185" strokeWidth="1.5" />
          <path d="M25 60 Q32 68 40 60 Q48 68 56 60 Q64 68 75 60 L75 55 L25 55 Z" fill="#F43F5E" />
          <rect x="33" y="38" width="34" height="20" rx="3" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" />
          {/* Candles */}
          <rect x="42" y="24" width="3" height="15" fill="#FEF08A" />
          <ellipse cx="43.5" cy="20" rx="2" ry="4" fill="#F97316" />
          <rect x="55" y="24" width="3" height="15" fill="#FEF08A" />
          <ellipse cx="56.5" cy="20" rx="2" ry="4" fill="#F97316" />
        </svg>
      );
    }
    if (activeTheme.id === 'logro-profesional') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-md">
          {/* Trophy & Laurel */}
          <ellipse cx="50" cy="80" rx="22" ry="5" fill="#1E293B" />
          <rect x="42" y="65" width="16" height="15" fill="#F59E0B" />
          <path d="M30 30 Q30 65 50 68 Q70 65 70 30 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M30 35 Q18 35 22 50 Q25 58 35 56" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M70 35 Q82 35 78 50 Q75 58 65 56" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="45" r="7" fill="#FFFBEB" />
          <path d="M22 25 Q15 45 22 65" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M78 25 Q85 45 78 65" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    }
    if (activeTheme.id === 'aniversario') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-md">
          {/* Roses & Hearts */}
          <path d="M44 65 L50 85 L56 65" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          <circle cx="38" cy="48" r="16" fill="#F43F5E" />
          <circle cx="62" cy="48" r="16" fill="#E11D48" />
          <circle cx="50" cy="38" r="20" fill="#BE123C" stroke="#881337" strokeWidth="1" />
          <circle cx="50" cy="38" r="9" fill="#FB7185" />
          {/* Heart */}
          <path d="M68 24 Q62 16 68 12 Q74 16 68 24 Z" fill="#FACC15" />
        </svg>
      );
    }

    // Default: Sunflower Bouquet
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 drop-shadow-md">
        <path d="M35 70 Q20 50 15 65 Q25 80 40 75 Z" fill="#22C55E" />
        <path d="M85 70 Q100 50 105 65 Q95 80 80 75 Z" fill="#22C55E" />
        <path d="M50 80 L60 115 L70 80 Z" fill="#D97706" opacity="0.8" />
        <g transform="translate(60, 52)">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <ellipse key={deg} cx="0" cy="-22" rx="5.5" ry="14" fill="#FACC15" stroke="#EAB308" strokeWidth="0.6" transform={`rotate(${deg})`} />
          ))}
          <circle cx="0" cy="0" r="14" fill="#78350F" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="10" fill="#451A03" />
        </g>
        <g transform="translate(60, 84)">
          <ellipse cx="-9" cy="0" rx="9" ry="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" transform="rotate(-15 -9 0)" />
          <ellipse cx="9" cy="0" rx="9" ry="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" transform="rotate(15 9 0)" />
          <circle cx="0" cy="0" r="4" fill="#EAB308" />
        </g>
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-stone-100/90 hover:bg-stone-200 text-stone-600 transition-colors shadow-xs"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Visual Preview of the Card */}
        <div className="flex-1 bg-gradient-to-b from-stone-50 via-cream-100/60 to-stone-100/50 p-4 sm:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-100 min-h-[460px]">
          
          {/* Format & Aspect Ratio Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-900 text-xs font-semibold uppercase tracking-wider shadow-2xs">
              {format === 'story' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Historia / TikTok (9:16)</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5 text-amber-700" />
                  <span>Post / Feed (1:1)</span>
                </>
              )}
            </span>
          </div>

          {/* ================= ACTUAL CARD CAPTURED BY HTML-TO-IMAGE ================= */}
          <div
            ref={cardRef}
            className={`transition-all duration-300 rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl border-2 select-none ${
              currentStyle.border
            } ${
              format === 'story'
                ? 'w-[280px] sm:w-[310px] h-[498px] sm:h-[551px]'
                : 'w-[290px] sm:w-[340px] h-[290px] sm:h-[340px]'
            }`}
            style={{
              background: currentStyle.background,
              fontFamily: "'Cormorant Garamond', Georgia, serif"
            }}
          >
            {/* Ambient Corner Glows */}
            <div className={`absolute -top-10 -left-10 w-28 h-28 ${currentStyle.glow} rounded-full blur-xl pointer-events-none`} />
            <div className={`absolute -bottom-10 -right-10 w-28 h-28 ${currentStyle.glow} rounded-full blur-xl pointer-events-none`} />

            {/* Corner Decorative Icons */}
            <div className="absolute top-3 left-3 text-base sm:text-lg opacity-80 animate-pulse">{activeTheme.emoji}</div>
            <div className="absolute top-3 right-3 text-base sm:text-lg opacity-80 animate-pulse" style={{ animationDelay: '500ms' }}>✨</div>
            <div className="absolute bottom-3 left-3 text-sm sm:text-base opacity-75">💛</div>
            <div className="absolute bottom-3 right-3 text-base sm:text-lg opacity-80">{activeTheme.emoji}</div>

            {/* Top Date & Event Tag */}
            <div className="pt-0.5 flex flex-col items-center z-10">
              <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full border shadow-2xs ${currentStyle.tagBg}`}>
                <span className="text-[11px]">{activeTheme.emoji}</span>
                <span className="text-[10px] font-sans font-bold tracking-widest uppercase">
                  {activeTheme.categoryBadge}
                </span>
                <span className="text-[11px]">✨</span>
              </div>
              {format === 'story' && (
                <p className={`text-[10px] font-sans tracking-wide mt-1 font-medium ${currentStyle.isDark ? 'text-yellow-200/80' : 'text-stone-700'}`}>
                  {activeTheme.shortName}
                </p>
              )}
            </div>

            {/* Main Content Area */}
            <div className="my-auto px-1 flex flex-col items-center z-10 w-full">
              <h3 className={`text-xl sm:text-2xl font-bold leading-tight tracking-tight ${currentStyle.titleColor}`}>
                {activeTheme.brag.title}
              </h3>

              <div className="mt-1.5 flex items-center justify-center gap-1.5 flex-wrap">
                <span className={`text-xs font-serif italic ${currentStyle.isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  Para:
                </span>
                <span
                  className={`text-xl sm:text-2xl font-bold tracking-wide ${currentStyle.accentColor}`}
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {recipientName} {activeTheme.emoji}
                </span>
              </div>

              {/* Graphic Centerpiece */}
              <div className={`relative flex items-center justify-center ${format === 'story' ? 'my-2 w-28 h-28 sm:w-32 sm:h-32' : 'my-1 w-20 h-20 sm:w-24 sm:h-24'}`}>
                <div className={`absolute inset-0 ${currentStyle.glow} rounded-full blur-lg animate-pulse`} />
                {renderCardGraphic()}
              </div>

              {/* Trending Sound Tag */}
              {format === 'story' && (
                <div className="mb-1.5 flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full bg-black/15 backdrop-blur-xs text-[10px] font-sans font-medium">
                  <Music2 className="w-3 h-3 text-amber-500 animate-pulse" />
                  <span className={currentStyle.isDark ? 'text-yellow-200' : 'text-stone-800'}>
                    {activeTheme.brag.audio}
                  </span>
                </div>
              )}

              {/* Occasion Quote */}
              <p
                className={`text-xs sm:text-sm italic leading-snug px-2 mt-0.5 ${currentStyle.quoteColor}`}
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {activeTheme.brag.quote}
              </p>
            </div>

            {/* Bottom Signature & Safe Zone Branding */}
            <div className={`w-full pt-1.5 border-t flex flex-col items-center z-10 ${currentStyle.footerColor}`}>
              <span className="text-[10px] font-sans font-bold flex items-center gap-1">
                <span>regala-flores-amarillas.vercel.app</span>
              </span>
              <span className={`text-[9px] font-sans ${currentStyle.isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                {activeTheme.brag.hashtags}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Controls, Formats, Themes & Social Action Buttons */}
        <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                  Presumir en Redes
                </h2>
                <div className="flex items-center gap-2 text-stone-500 text-xs font-sans mt-0.5">
                  <span className="flex items-center gap-1 text-pink-600 font-semibold">
                    <InstagramIcon className="w-3.5 h-3.5" /> Instagram
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-stone-800 font-semibold">
                    <TikTokIcon className="w-3.5 h-3.5" /> TikTok
                  </span>
                </div>
              </div>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm font-sans mt-2 leading-relaxed">
              Descarga o comparte esta postal en formato vertical 9:16 o cuadrado para presumir este hermoso detalle de {activeTheme.shortName}.
            </p>

            {/* 1. Format Switcher (9:16 Story vs 1:1 Post) */}
            <div className="mt-4">
              <label className="block text-[11px] font-bold text-stone-700 font-sans uppercase tracking-wider mb-1.5">
                1. Elige el Formato
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('story')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    format === 'story'
                      ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-semibold shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-xs font-sans font-bold">Historia / TikTok</div>
                    <div className="text-[10px] text-stone-500 font-sans">9:16 Pantalla completa</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('post')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    format === 'post'
                      ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-semibold shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <Square className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-xs font-sans font-bold">Post / Feed</div>
                    <div className="text-[10px] text-stone-500 font-sans">1:1 Cuadrado clásico</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Style Switcher */}
            <div className="mt-3.5">
              <label className="block text-[11px] font-bold text-stone-700 font-sans uppercase tracking-wider mb-1.5">
                2. Elige el Estilo Visual
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'spring', label: '🌻 Dorado Sol' },
                  { id: 'night', label: '🌙 TikTok Glow' },
                  { id: 'sunset', label: '🌸 Romance' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCardStyle(t.id)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-sans font-medium border transition-all ${
                      cardStyle === t.id
                        ? 'ring-2 ring-amber-500 border-amber-500 font-semibold shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status message */}
            {statusMessage && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-sans font-medium flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Social Share Buttons */}
            <div className="mt-4 space-y-2 font-sans">
              <button
                onClick={() => handleNativeShare('Redes')}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-rose-600 hover:from-amber-600 hover:via-pink-600 hover:to-rose-700 text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
                <span>Compartir / Presumir en Redes</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNativeShare('TikTok')}
                  disabled={isGenerating}
                  className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-black text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Compartir o guardar para subir a TikTok"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                  <span>Para TikTok</span>
                </button>

                <button
                  onClick={() => handleNativeShare('Instagram')}
                  disabled={isGenerating}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Compartir o guardar para subir a Instagram Stories"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Para Instagram</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="py-2 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-stone-600" />
                  <span>Descargar (HD)</span>
                </button>

                <button
                  onClick={handleCopyImage}
                  disabled={isGenerating}
                  className="py-2 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedImage ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                  )}
                  <span>{copiedImage ? '¡Copiada!' : 'Copiar (Ctrl+V)'}</span>
                </button>
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedLink ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace para Sticker / Biografía'}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-stone-500">
            <span>Abrir app:</span>
            <div className="flex items-center gap-3">
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-stone-900 hover:text-black hover:underline"
              >
                <TikTokIcon className="w-3 h-3" />
                <span>TikTok</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-pink-600 hover:text-pink-700 hover:underline"
              >
                <InstagramIcon className="w-3 h-3" />
                <span>Instagram</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
