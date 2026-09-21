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

export default function BragModal({
  isOpen,
  onClose,
  recipientName = 'Mi Persona Favorita',
  senderName = 'Alguien que te quiere'
}) {
  const [format, setFormat] = useState('story'); // 'story' (9:16) or 'post' (1:1)
  const [theme, setTheme] = useState('spring'); // 'spring', 'night', 'sunset'
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const cardRef = useRef(null);

  if (!isOpen) return null;

  const getCustomUrl = () => {
    const url = new URL(window.location.origin + window.location.pathname);
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

      const fileName = `flores-amarillas-${recipientName.toLowerCase().replace(/\s+/g, '-')}-${format}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        setStatusMessage('Abriendo menú de compartir...');
        await navigator.share({
          files: [file],
          title: 'Mis Flores Amarillas 🌻💛',
          text: `¡Me regalaron mis flores amarillas! 💛🌻 #FloresAmarillas #21DeSeptiembre ${getCustomUrl()}`,
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
            downloadBlob(blob, `flores-amarillas-${recipientName}-${format}.png`);
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
          `flores-amarillas-${recipientName.toLowerCase().replace(/\s+/g, '-')}-${format}.png`
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
  const themeStyles = {
    spring: {
      background: 'radial-gradient(circle at 50% 20%, #FFFDF5 0%, #FEF9C3 50%, #FDE047 100%)',
      titleColor: 'text-stone-900',
      accentColor: 'text-amber-600',
      tagBg: 'bg-white/90 text-amber-950 border-amber-300/80',
      quoteColor: 'text-stone-800',
      footerColor: 'text-amber-900 border-amber-300/70',
      border: 'border-amber-300',
      glow: 'bg-amber-400/35',
      butterflyColor: '#FDE047',
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
      butterflyColor: '#FEF08A',
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
      butterflyColor: '#FED7AA',
      isDark: false
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden my-auto flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-stone-100/90 hover:bg-stone-200 text-stone-600 transition-colors shadow-xs"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Visual Preview of the Card */}
        <div className="flex-1 bg-gradient-to-b from-amber-50/50 via-cream-100/60 to-stone-100/50 p-4 sm:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-amber-100 min-h-[460px]">
          
          {/* Format & Aspect Ratio Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider shadow-2xs">
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
              currentTheme.border
            } ${
              format === 'story'
                ? 'w-[280px] sm:w-[310px] h-[498px] sm:h-[551px]' // 9:16 Aspect Ratio
                : 'w-[290px] sm:w-[340px] h-[290px] sm:h-[340px]' // 1:1 Aspect Ratio
            }`}
            style={{
              background: currentTheme.background,
              fontFamily: "'Cormorant Garamond', Georgia, serif"
            }}
          >
            {/* Ambient Corner Glows */}
            <div
              className={`absolute -top-10 -left-10 w-28 h-28 ${currentTheme.glow} rounded-full blur-xl pointer-events-none`}
            />
            <div
              className={`absolute -bottom-10 -right-10 w-28 h-28 ${currentTheme.glow} rounded-full blur-xl pointer-events-none`}
            />

            {/* Corner Decorative Icons */}
            <div className="absolute top-3 left-3 text-base sm:text-lg opacity-80 animate-pulse">🌻</div>
            <div className="absolute top-3 right-3 text-base sm:text-lg opacity-80 animate-pulse" style={{ animationDelay: '500ms' }}>✨</div>
            <div className="absolute bottom-3 left-3 text-sm sm:text-base opacity-75">💛</div>
            <div className="absolute bottom-3 right-3 text-base sm:text-lg opacity-80">🌻</div>

            {/* Top Date & Event Tag */}
            <div className="pt-0.5 flex flex-col items-center z-10">
              <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full border shadow-2xs ${currentTheme.tagBg}`}>
                <span className="text-[11px]">🌻</span>
                <span className="text-[10px] font-sans font-bold tracking-widest uppercase">
                  21 de Septiembre
                </span>
                <span className="text-[11px]">✨</span>
              </div>
              {format === 'story' && (
                <p className={`text-[10px] font-sans tracking-wide mt-1 font-medium ${currentTheme.isDark ? 'text-yellow-200/80' : 'text-amber-900/80'}`}>
                  Día de las Flores Amarillas
                </p>
              )}
            </div>

            {/* Main Content Area */}
            <div className="my-auto px-1 flex flex-col items-center z-10 w-full">
              <h3 className={`text-xl sm:text-2xl font-bold leading-tight tracking-tight ${currentTheme.titleColor}`}>
                ¡Me regalaron mis{' '}
                <span className={`${currentTheme.accentColor} underline decoration-amber-400 decoration-wavy underline-offset-4`}>
                  flores amarillas
                </span>!
              </h3>

              <div className="mt-1.5 flex items-center justify-center gap-1.5 flex-wrap">
                <span className={`text-xs font-serif italic ${currentTheme.isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  Para:
                </span>
                <span
                  className={`text-xl sm:text-2xl font-bold tracking-wide ${currentTheme.accentColor}`}
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {recipientName} 💛
                </span>
              </div>

              {/* Bouquet Illustration Centerpiece */}
              <div className={`relative flex items-center justify-center ${format === 'story' ? 'my-2 w-32 h-32 sm:w-36 sm:h-36' : 'my-1 w-24 h-24 sm:w-28 sm:h-28'}`}>
                {/* Glowing Sunburst */}
                <div className={`absolute inset-0 ${currentTheme.glow} rounded-full blur-lg animate-pulse`} />
                
                {/* SVG Sunflower Bouquet */}
                <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 drop-shadow-md">
                  {/* Leaves */}
                  <path d="M35 70 Q20 50 15 65 Q25 80 40 75 Z" fill="#22C55E" />
                  <path d="M85 70 Q100 50 105 65 Q95 80 80 75 Z" fill="#22C55E" />
                  
                  {/* Stems */}
                  <path d="M50 80 L60 115 L70 80 Z" fill="#D97706" opacity="0.8" />
                  <path d="M45 80 Q60 115 58 118" stroke="#15803D" strokeWidth="3" />
                  <path d="M75 80 Q60 115 62 118" stroke="#15803D" strokeWidth="3" />
                  
                  {/* Sunflower Center Flower */}
                  <g transform="translate(60, 52)">
                    {/* Petals Outer */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                      <ellipse
                        key={deg}
                        cx="0"
                        cy="-22"
                        rx="5.5"
                        ry="14"
                        fill="#FACC15"
                        stroke="#EAB308"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Mid Ring */}
                    {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
                      <ellipse
                        key={`m-${deg}`}
                        cx="0"
                        cy="-16"
                        rx="4"
                        ry="10"
                        fill="#FEF08A"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Core */}
                    <circle cx="0" cy="0" r="14" fill="#78350F" stroke="#CA8A04" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="10" fill="#451A03" />
                    <circle cx="-3" cy="-3" r="2.5" fill="#CA8A04" opacity="0.6" />
                  </g>

                  {/* Golden Butterfly */}
                  <g transform="translate(85, 28) rotate(15)">
                    <ellipse cx="-4" cy="-4" rx="4" ry="7" fill={currentTheme.butterflyColor} stroke="#CA8A04" strokeWidth="0.5" transform="rotate(-30 -4 -4)" />
                    <ellipse cx="4" cy="-4" rx="4" ry="7" fill={currentTheme.butterflyColor} stroke="#CA8A04" strokeWidth="0.5" transform="rotate(30 4 -4)" />
                    <ellipse cx="0" cy="0" rx="1.5" ry="5" fill="#78350F" />
                  </g>

                  {/* Ribbon Bow */}
                  <g transform="translate(60, 84)">
                    <ellipse cx="-9" cy="0" rx="9" ry="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" transform="rotate(-15 -9 0)" />
                    <ellipse cx="9" cy="0" rx="9" ry="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" transform="rotate(15 9 0)" />
                    <circle cx="0" cy="0" r="4" fill="#EAB308" stroke="#78350F" strokeWidth="0.8" />
                    <path d="M-3 4 Q-12 18 -8 24" stroke="#CA8A04" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M3 4 Q12 18 8 24" stroke="#CA8A04" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </g>
                </svg>
              </div>

              {/* TikTok / Instagram Trending Sound Tag */}
              {format === 'story' && (
                <div className="mb-1.5 flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full bg-black/15 backdrop-blur-xs text-[10px] font-sans font-medium text-stone-800 dark:text-stone-200">
                  <Music2 className="w-3 h-3 text-amber-500 animate-pulse" />
                  <span className={currentTheme.isDark ? 'text-yellow-200' : 'text-stone-800'}>
                    Floricienta · Flores Amarillas
                  </span>
                </div>
              )}

              {/* Romantic Tradition Quote */}
              <p
                className={`text-xs sm:text-sm italic leading-snug px-2 mt-0.5 ${currentTheme.quoteColor}`}
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                "Ella sabía que él sabía, que vendría a buscarla con sus flores amarillas..."
              </p>
            </div>

            {/* Bottom Signature & Safe Zone Branding */}
            <div className={`w-full pt-1.5 border-t flex flex-col items-center z-10 ${currentTheme.footerColor}`}>
              <span className="text-[10px] font-sans font-bold flex items-center gap-1">
                <span>regala-flores-amarillas.vercel.app</span>
              </span>
              <span className={`text-[9px] font-sans ${currentTheme.isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                {format === 'story' ? '#FloresAmarillas · #21DeSeptiembre' : 'Hecho con amor para ti 🌻'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Controls, Formats, Themes & Social Action Buttons */}
        <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                  Presumir mis Flores
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
              Elige tu formato preferido y comparte con tus amigos que este 21 de septiembre te consintieron con tus flores amarillas.
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

            {/* 2. Theme Switcher */}
            <div className="mt-3.5">
              <label className="block text-[11px] font-bold text-stone-700 font-sans uppercase tracking-wider mb-1.5">
                2. Elige el Estilo Visual
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'spring', label: '🌻 Sol Primavera', preview: 'bg-yellow-100 border-amber-300' },
                  { id: 'night', label: '🌙 TikTok Aesthetic', preview: 'bg-slate-900 border-yellow-500/50 text-white' },
                  { id: 'sunset', label: '🌸 Romance', preview: 'bg-rose-100 border-rose-300' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-sans font-medium border transition-all ${
                      theme === t.id
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
              {/* Primary: Native Share Sheet */}
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

              {/* Direct Platform Quick Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {/* TikTok Direct Action */}
                <button
                  onClick={() => handleNativeShare('TikTok')}
                  disabled={isGenerating}
                  className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-black text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Compartir o guardar para subir a TikTok"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                  <span>Para TikTok</span>
                </button>

                {/* Instagram Direct Action */}
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

              {/* Secondary Actions: Download HD & Copy Image */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-700" />
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

              {/* Link Sticker Copy */}
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

          {/* Quick External Links for TikTok & Instagram Web */}
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
