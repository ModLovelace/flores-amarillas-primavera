import { DEFAULT_THEME_ID, getTheme } from '../config/themes';

/**
 * Helper to get initial theme and dedication from URL query params or localStorage
 */
export function getInitialDedication() {
  if (typeof window === 'undefined') {
    const defaultTheme = getTheme(DEFAULT_THEME_ID);
    return {
      theme: DEFAULT_THEME_ID,
      to: defaultTheme.defaultTo,
      from: defaultTheme.defaultFrom,
      message: defaultTheme.defaultMessage,
      date: defaultTheme.defaultDate
    };
  }

  const params = new URLSearchParams(window.location.search);
  const saved = localStorage.getItem('primavera_dedication');
  const savedData = saved ? JSON.parse(saved) : {};

  const themeId =
    params.get('theme') ||
    params.get('tema') ||
    params.get('t') ||
    savedData.theme ||
    DEFAULT_THEME_ID;

  const currentTheme = getTheme(themeId);

  return {
    theme: currentTheme.id,
    to: params.get('to') || params.get('para') || savedData.to || currentTheme.defaultTo,
    from: params.get('from') || params.get('de') || savedData.from || currentTheme.defaultFrom,
    message: params.get('msg') || params.get('mensaje') || savedData.message || currentTheme.defaultMessage,
    date: params.get('date') || params.get('fecha') || savedData.date || currentTheme.defaultDate
  };
}

export function saveDedicationToStorage(data) {
  try {
    localStorage.setItem('primavera_dedication', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save dedication:', e);
  }
}

export function buildShareUrl(data) {
  const origin = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  if (data.theme && data.theme !== DEFAULT_THEME_ID) params.set('theme', data.theme);
  if (data.to) params.set('to', data.to);
  if (data.from) params.set('from', data.from);
  if (data.message) params.set('msg', data.message);
  if (data.date) params.set('date', data.date);
  return `${origin}?${params.toString()}`;
}
