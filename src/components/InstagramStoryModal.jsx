import React, { useState, useRef } from 'react';
import { toPng, toBlob } from 'html-to-image';
import {
  Download,
  Share2,
  Copy,
  Check,
  X,
  Sparkles,
  Heart,
  ExternalLink,
  Loader2
} from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function InstagramStoryModal({
  isOpen,
  onClose,
  recipientName = 'Mi Persona Favorita',
  senderName = 'Alguien que te quiere'
}) {
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

  // Generate PNG Blob from the Story Card
  const generateBlob = async () => {
    if (!cardRef.current) return null;
    return await toBlob(cardRef.current, {
      quality: 0.98,
      pixelRatio: 3, // HD 1080p equivalent sharpness
      cacheBust: true,
    });
  };

  // 📲 Main Share / Brag Action
  const handleShareStory = async () => {
    try {
      setIsGenerating(true);
      setStatusMessage('Generando tu historia en alta resolución...');

      const blob = await generateBlob();
      if (!blob) throw new Error('No se pudo generar la imagen');

      const fileName = `flores-amarillas-${recipientName.toLowerCase().replace(/\s+/g, '-')}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Check if Web Share API can share files (iOS Safari, Android Chrome)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        setStatusMessage('Abriendo menú de compartir...');
        await navigator.share({
          files: [file],
          title: 'Mis Flores Amarillas 🌻',
          text: `¡Me regalaron mis flores amarillas! 💛🌻 ${getCustomUrl()}`,
        });
        setStatusMessage('¡Compartido con éxito!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        // Fallback: Automatic download + offer Instagram link
        downloadBlob(blob, fileName);
        setStatusMessage('¡Imagen guardada en tus descargas!');
        setTimeout(() => setStatusMessage(''), 3500);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Share error, falling back to download:', err);
        // Fallback download if user cancelled or share failed
        try {
          const blob = await generateBlob();
          if (blob) {
            downloadBlob(blob, `flores-amarillas-${recipientName}.png`);
            setStatusMessage('¡Imagen descargada!');
          }
        } catch (e) {}
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // 📥 Download Image to Device
  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setStatusMessage('Descargando imagen...');
      const blob = await generateBlob();
      if (blob) {
        downloadBlob(blob, `flores-amarillas-${recipientName.toLowerCase().replace(/\s+/g, '-')}.png`);
        setStatusMessage('¡Descarga completada!');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error al descargar');
    } finally {
      setIsGenerating(false);
    }
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

  // 📋 Copy Image to Clipboard (Desktop friendly)
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

  // 🔗 Copy Link for Instagram Link Sticker
  const handleCopyLink = () => {
    navigator.clipboard.writeText(getCustomUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden my-auto flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-stone-100/90 hover:bg-stone-200 text-stone-600 transition-colors shadow-xs"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Instagram Story Preview Container */}
        <div className="flex-1 bg-gradient-to-b from-amber-50/60 to-cream-100/80 p-4 sm:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-amber-100">
          
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold uppercase tracking-wider">
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Formato Historia (9:16)</span>
            </span>
          </div>

          {/* ================= ACTUAL STORY CARD (CAPTURED BY HTML-TO-IMAGE) ================= */}
          <div
            ref={cardRef}
            className="w-[280px] sm:w-[310px] h-[498px] sm:h-[551px] rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-xl border-2 border-amber-300 select-none"
            style={{
              background: 'radial-gradient(circle at 50% 25%, #FFFDF5 0%, #FEF9C3 55%, #FDE047 100%)',
              fontFamily: "'Cormorant Garamond', Georgia, serif"
            }}
          >
            {/* Top Floral & Sunburst Details */}
            <div className="absolute -top-10 -left-10 w-28 h-28 bg-sunflower-300/40 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-amber-400/40 rounded-full blur-xl pointer-events-none" />

            {/* Corner Decorative Sunflowers */}
            <div className="absolute top-3 left-3 text-lg opacity-80 animate-pulse">🌻</div>
            <div className="absolute top-3 right-3 text-lg opacity-80 animate-pulse" style={{ animationDelay: '500ms' }}>✨</div>
            <div className="absolute bottom-3 left-3 text-base opacity-70">💛</div>
            <div className="absolute bottom-3 right-3 text-lg opacity-80">🌻</div>

            {/* Header Tag */}
            <div className="pt-1 flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-amber-300/80 shadow-xs">
                <span className="text-xs">🌻</span>
                <span className="text-[10px] font-sans font-bold tracking-widest text-amber-950 uppercase">
                  21 de Septiembre
                </span>
                <span className="text-xs">✨</span>
              </div>
              <p className="text-[11px] text-amber-800/90 font-sans tracking-wide mt-1 font-medium">
                Día de las Flores Amarillas
              </p>
            </div>

            {/* Main Viral Title */}
            <div className="my-auto px-1 flex flex-col items-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight tracking-tight">
                ¡Me regalaron mis{' '}
                <span className="text-amber-600 underline decoration-amber-400 decoration-wavy underline-offset-4">
                  flores amarillas
                </span>!
              </h3>

              <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-xs font-serif italic text-stone-600">Para:</span>
                <span
                  className="text-xl sm:text-2xl text-amber-950 font-bold tracking-wide"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {recipientName} 💛
                </span>
              </div>

              {/* Bouquet Illustration Centerpiece */}
              <div className="my-2 relative w-36 h-36 flex items-center justify-center">
                {/* Glowing Sunburst */}
                <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-lg animate-pulse" />
                
                {/* SVG Sunflower Bouquet */}
                <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 drop-shadow-md">
                  {/* Leaves */}
                  <path d="M35 70 Q20 50 15 65 Q25 80 40 75 Z" fill="#22C55E" />
                  <path d="M85 70 Q100 50 105 65 Q95 80 80 75 Z" fill="#22C55E" />
                  
                  {/* Wrapper Stems */}
                  <path d="M50 80 L60 115 L70 80 Z" fill="#D97706" opacity="0.8" />
                  <path d="M45 80 Q60 115 58 118" stroke="#15803D" strokeWidth="3" />
                  <path d="M75 80 Q60 115 62 118" stroke="#15803D" strokeWidth="3" />
                  
                  {/* Sunflower Center Flower */}
                  <g transform="translate(60, 52)">
                    {/* Petals */}
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
                    {/* Sunflower Core */}
                    <circle cx="0" cy="0" r="14" fill="#78350F" stroke="#CA8A04" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="10" fill="#451A03" />
                    <circle cx="-3" cy="-3" r="2.5" fill="#CA8A04" opacity="0.6" />
                  </g>

                  {/* Golden Butterfly Fluttering */}
                  <g transform="translate(85, 28) rotate(15)">
                    <ellipse cx="-4" cy="-4" rx="4" ry="7" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.5" transform="rotate(-30 -4 -4)" />
                    <ellipse cx="4" cy="-4" rx="4" ry="7" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.5" transform="rotate(30 4 -4)" />
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

              {/* Romantic Tradition Quote */}
              <p
                className="text-sm text-stone-800 italic leading-snug px-2 mt-1"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                "Ella sabía que él sabía, que vendría a buscarla con sus flores amarillas..."
              </p>
            </div>

            {/* Bottom Signature & Branding */}
            <div className="w-full pt-2 border-t border-amber-300/70 flex flex-col items-center">
              <span className="text-[10px] font-sans font-semibold text-amber-900 flex items-center gap-1">
                <span>regala-flores-amarillas.vercel.app</span>
              </span>
              <span className="text-[9px] text-stone-500 font-sans mt-0.5">
                Hecho con amor para ti 🌻
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Sharing Options & Action Controls */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Presumir en Instagram
                </h2>
                <p className="text-stone-500 text-xs font-sans">
                  Comparte tu ramo amarillo en tu historia o feed
                </p>
              </div>
            </div>

            <p className="text-stone-600 text-sm font-sans mt-3 leading-relaxed">
              Descarga o comparte directamente esta postal para que todos en Instagram sepan que te consintieron con tus flores amarillas este 21 de septiembre.
            </p>

            {/* Status notification toast */}
            {statusMessage && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-sans font-medium flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 space-y-2.5 font-sans">
              {/* Primary: Share / Download for Story */}
              <button
                onClick={handleShareStory}
                disabled={isGenerating}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-600 hover:via-pink-600 hover:to-purple-700 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2.5"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
                <span>Compartir en Historia / Descargar</span>
              </button>

              {/* Secondary: Download PNG HD */}
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-amber-700" />
                <span>Descargar Imagen PNG (HD)</span>
              </button>

              {/* Tertiary: Copy Image to Clipboard (Desktop) */}
              <button
                onClick={handleCopyImage}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
              >
                {copiedImage ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-stone-500" />
                )}
                <span>{copiedImage ? '¡Imagen Copiada!' : 'Copiar Imagen (Ctrl+V)'}</span>
              </button>

              {/* Sticker Link Copy */}
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 font-medium text-xs transition-colors flex items-center justify-center gap-2"
              >
                {copiedLink ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace para Sticker de Instagram'}</span>
              </button>
            </div>
          </div>

          {/* Quick Instagram Web link */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-stone-500">
            <span>¿Listo para publicar?</span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-pink-600 hover:text-pink-700 hover:underline"
            >
              <span>Abrir Instagram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
