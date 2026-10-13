/**
 * Actualiza dinámicamente el favicon del navegador según la temática activa.
 * - cumpleaños: 🎂 (torta de cumpleaños)
 * - flores-amarillas: 🌻 (girasol original /favicon.svg)
 * - logro-profesional: 🎓 (birrete de graduación)
 * - aniversario: 💖 (corazón romántico)
 */
export function setDynamicFavicon(themeId, emoji = '🎂') {
  if (typeof document === 'undefined') return;

  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }

  if (themeId === 'flores-amarillas') {
    link.type = 'image/svg+xml';
    link.href = '/favicon.svg';
    return;
  }

  // Generar SVG data URI con el emoji correspondiente para un renderizado nítido y colorido
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
  link.type = 'image/svg+xml';
  link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
