/**
 * Configuración compartida entre el cliente (Vite) y el backend serverless (Vercel).
 * Mantiene los códigos compactos, valores por defecto, validación y textos OpenGraph
 * sin duplicar lógica ni exponer el mensaje secreto en la vista previa de WhatsApp.
 */

export const DEFAULT_THEME_ID = 'flores-amarillas';

export const DEDICATION_LIMITS = {
  to: 80,
  from: 80,
  date: 80,
  message: 1500
};

export const THEME_BASE_META = {
  'flores-amarillas': {
    id: 'flores-amarillas',
    code: '0',
    shortName: 'Flores Amarillas',
    name: 'Flores Amarillas & Primavera',
    emoji: '🌻',
    themeColor: '#FEF9C3',
    defaultTo: 'Mi Persona Favorita',
    defaultFrom: 'Alguien que te adora',
    defaultDate: '21 de Septiembre',
    defaultMessage:
      'En este 21 de septiembre, quería recordarte lo especial que eres. Que nunca te falten motivos para sonreír, ni flores amarillas en tu vida. Eres la luz y la primavera más bonita de mis días.',
    ogImagePath: '/og/flores-amarillas.png',
    ogTitle: (to) => `🌻 Flores Amarillas para ${to}`,
    ogDescription: (_to, from) =>
      `${from} te envió un ramo de flores amarillas interactivo y una carta secreta sellada en cera. ¡Ábrelo!`,
    whatsappText: (to, url) =>
      `🌻 ¡Hola ${to}! Te preparé un detalle especial por el Día de las Flores Amarillas: ${url}`
  },
  cumpleanos: {
    id: 'cumpleanos',
    code: '1',
    shortName: 'Cumpleaños',
    name: 'Feliz Cumpleaños',
    emoji: '🎂',
    themeColor: '#FCE7F3',
    defaultTo: 'Cumpleañera(o) Estrella',
    defaultFrom: 'Quien te quiere con el alma',
    defaultDate: 'Hoy es tu Cumpleaños',
    defaultMessage:
      '¡Feliz Cumpleaños! Que esta nueva vuelta al sol esté repleta de bendiciones, metas cumplidas, viajes soñados, salud y amor infinito. Gracias por iluminar nuestros días con tu chispa inigualable. ¡A celebrar en grande!',
    ogImagePath: '/og/cumpleanos.png',
    ogTitle: (to) => `🎂 ¡Feliz Cumpleaños, ${to}!`,
    ogDescription: (_to, from) =>
      `${from} te preparó un pastel interactivo, música especial y una carta secreta para celebrar contigo. ¡Pide un deseo!`,
    whatsappText: (to, url) =>
      `🎂 ¡Hola ${to}! Te preparé un detalle muy especial para celebrar tu cumpleaños: ${url}`
  },
  'logro-profesional': {
    id: 'logro-profesional',
    code: '2',
    shortName: 'Logro Profesional',
    name: 'Logro Profesional & Nuevo Comienzo',
    emoji: '🎓',
    themeColor: '#D1FAE5',
    defaultTo: 'Gran Profesional & Triunfador(a)',
    defaultFrom: 'Tu mayor admirador(a)',
    defaultDate: 'Día de la Victoria',
    defaultMessage:
      '¡Muchísimas felicidades por este enorme logro! Tu dedicación, talento y perseverancia rinden frutos hoy. Que este éxito sea el primer escalón de una trayectoria llena de triunfos y grandes satisfacciones profesionales.',
    ogImagePath: '/og/logro-profesional.png',
    ogTitle: (to) => `🎓 ¡Felicidades por tu logro, ${to}!`,
    ogDescription: (_to, from) =>
      `${from} te dedicó este homenaje con laureles dorados, fanfarria de triunfo y una carta especial. ¡Descúbrelo!`,
    whatsappText: (to, url) =>
      `🎓 ¡Muchas felicidades ${to}! Te preparé este homenaje por tu gran logro profesional: ${url}`
  },
  aniversario: {
    id: 'aniversario',
    code: '3',
    shortName: 'Aniversario & Amor',
    name: 'Aniversario, Amor & Amistad',
    emoji: '💖',
    themeColor: '#FFE4E6',
    defaultTo: 'Mi Amor & Compañera(o) de Vida',
    defaultFrom: 'Quien te amará por siempre',
    defaultDate: 'Nuestro Aniversario',
    defaultMessage:
      '¡Feliz Aniversario! Gracias por cada momento, cada sonrisa cómplice y por caminar a mi lado. Contigo cada día es más bonito, más dulce y más especial. Te elijo hoy, mañana y siempre con todo mi corazón.',
    ogImagePath: '/og/aniversario.png',
    ogTitle: (to) => `💖 Detalle de Aniversario para ${to}`,
    ogDescription: (_to, from) =>
      `${from} te preparó un ramo de rosas eternas, melodía romántica y una carta sellada en cera. ¡Ábrelo!`,
    whatsappText: (to, url) =>
      `💖 ¡Hola mi amor ${to}! Te preparé un detalle especial por nuestro aniversario: ${url}`
  }
};

export const THEME_ID_BY_CODE = Object.fromEntries(
  Object.values(THEME_BASE_META).map((item) => [item.code, item.id])
);

export function resolveThemeMeta(idOrCode) {
  if (typeof idOrCode === 'number') {
    const byNum = THEME_ID_BY_CODE[String(idOrCode)];
    if (byNum && THEME_BASE_META[byNum]) return THEME_BASE_META[byNum];
  }
  if (typeof idOrCode === 'string') {
    const cleaned = idOrCode.trim();
    if (THEME_BASE_META[cleaned]) return THEME_BASE_META[cleaned];
    if (THEME_ID_BY_CODE[cleaned]) return THEME_BASE_META[THEME_ID_BY_CODE[cleaned]];
  }
  return THEME_BASE_META[DEFAULT_THEME_ID];
}

function clampString(val, maxLen) {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

export function normalizeDedication(raw = {}) {
  const themeMeta = resolveThemeMeta(raw.theme ?? raw.t);
  const to = clampString(raw.to ?? raw.para, DEDICATION_LIMITS.to) || themeMeta.defaultTo;
  const from = clampString(raw.from ?? raw.de, DEDICATION_LIMITS.from) || themeMeta.defaultFrom;
  const message =
    clampString(raw.message ?? raw.msg ?? raw.mensaje, DEDICATION_LIMITS.message) ||
    themeMeta.defaultMessage;
  const date = clampString(raw.date ?? raw.fecha, DEDICATION_LIMITS.date) || themeMeta.defaultDate;

  return {
    theme: themeMeta.id,
    to,
    from,
    message,
    date
  };
}

/**
 * Serializa una dedicatoria a tupla compacta omitiendo valores idénticos al tema
 * y recortando huecos vacíos al final: [themeCode, to?, from?, message?, date?].
 */
export function toCompactTuple(raw) {
  const normalized = normalizeDedication(raw);
  const meta = resolveThemeMeta(normalized.theme);

  const tuple = [
    meta.code,
    normalized.to === meta.defaultTo ? '' : normalized.to,
    normalized.from === meta.defaultFrom ? '' : normalized.from,
    normalized.message === meta.defaultMessage ? '' : normalized.message,
    normalized.date === meta.defaultDate ? '' : normalized.date
  ];

  while (tuple.length > 1 && tuple[tuple.length - 1] === '') {
    tuple.pop();
  }
  return tuple;
}

export function fromCompactTuple(tuple) {
  if (!Array.isArray(tuple) || tuple.length === 0) {
    return normalizeDedication({});
  }
  const [code, to, from, message, date] = tuple;
  return normalizeDedication({
    theme: code,
    to,
    from,
    message,
    date
  });
}

export function bytesToBase64Url(bytes) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64url');
  }
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlToBytes(str) {
  if (!str || typeof str !== 'string') return null;
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(str, 'base64url'));
  }
  const padLen = (4 - (str.length % 4)) % 4;
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLen);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
