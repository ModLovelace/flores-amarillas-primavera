import { deflateSync, inflateSync, strFromU8, strToU8 } from 'fflate';
import {
  base64UrlToBytes,
  bytesToBase64Url,
  fromCompactTuple,
  normalizeDedication,
  resolveThemeMeta,
  toCompactTuple
} from '../../shared/dedication.js';

const STORAGE_KEY = 'primavera_dedication';
const SHORT_CACHE_KEY = 'primavera_short_links_v1';
const memoryShortCache = new Map();

export function encodeCompactToken(data) {
  const tuple = toCompactTuple(data);
  const json = JSON.stringify(tuple);
  const compressed = deflateSync(strToU8(json), { level: 9 });
  return bytesToBase64Url(compressed);
}

export function decodeCompactToken(token) {
  if (!token || typeof token !== 'string' || token.length > 4096) return null;
  try {
    const bytes = base64UrlToBytes(token);
    if (!bytes || bytes.length === 0) return null;
    const inflated = inflateSync(bytes);
    const parsed = JSON.parse(strFromU8(inflated));
    return fromCompactTuple(parsed);
  } catch {
    return null;
  }
}

export function getDedicationCacheKey(data) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}::${JSON.stringify(toCompactTuple(data))}`;
}

function readShortCache(cacheKey) {
  if (memoryShortCache.has(cacheKey)) {
    return memoryShortCache.get(cacheKey);
  }
  try {
    const raw = sessionStorage.getItem(SHORT_CACHE_KEY);
    if (!raw) return null;
    const store = JSON.parse(raw);
    const url = store?.[cacheKey];
    if (typeof url === 'string' && url) {
      memoryShortCache.set(cacheKey, url);
      return url;
    }
  } catch {
    // Ignorar storage restringido
  }
  return null;
}

export function writeShortCache(data, shortUrl) {
  if (!shortUrl) return;
  const cacheKey = getDedicationCacheKey(data);
  memoryShortCache.set(cacheKey, shortUrl);
  try {
    const raw = sessionStorage.getItem(SHORT_CACHE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const entries = Object.entries(store).slice(-25);
    entries.push([cacheKey, shortUrl]);
    sessionStorage.setItem(SHORT_CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    // Ignorar storage restringido
  }
}

export function getCachedShortShareUrl(data) {
  return readShortCache(getDedicationCacheKey(data));
}

export function getUnresolvedShortId() {
  if (typeof window === 'undefined') return null;
  if (window.__INITIAL_DEDICATION__) return null;
  const match = window.location.pathname.match(/^\/s\/([0-9A-Za-z]{5,24})\/?$/);
  return match ? match[1] : null;
}

/**
 * Obtiene la dedicatoria inicial respetando prioridad:
 * 1) Estado hidratado desde Vercel (/api/open)
 * 2) Ruta comprimida /r/<token> o parámetro ?d= / ?r=
 * 3) Parámetros legacy (?theme=...&to=...) sin mezclar con localStorage ajeno
 * 4) localStorage del navegador (solo al abrir la raíz limpia)
 */
export function getInitialDedication() {
  if (typeof window === 'undefined') {
    return normalizeDedication({});
  }

  if (window.__INITIAL_DEDICATION__ && typeof window.__INITIAL_DEDICATION__ === 'object') {
    const hydrated = normalizeDedication(window.__INITIAL_DEDICATION__);
    if (/^\/s\/[0-9A-Za-z]{5,24}\/?$/.test(window.location.pathname)) {
      writeShortCache(hydrated, `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}`);
    }
    return hydrated;
  }

  const pathMatch = window.location.pathname.match(/^\/r\/([A-Za-z0-9_-]+)\/?$/);
  if (pathMatch) {
    const decoded = decodeCompactToken(pathMatch[1]);
    if (decoded) return decoded;
  }

  const params = new URLSearchParams(window.location.search);
  const compressedParam = params.get('r') || params.get('d');
  if (compressedParam) {
    const decoded = decodeCompactToken(compressedParam);
    if (decoded) return decoded;
  }

  const hasExplicitQuery = [
    'theme',
    'tema',
    't',
    'to',
    'para',
    'from',
    'de',
    'msg',
    'mensaje',
    'date',
    'fecha'
  ].some((key) => params.has(key));

  if (hasExplicitQuery) {
    return normalizeDedication({
      theme: params.get('theme') || params.get('tema') || params.get('t'),
      to: params.get('to') || params.get('para'),
      from: params.get('from') || params.get('de'),
      message: params.get('msg') || params.get('mensaje'),
      date: params.get('date') || params.get('fecha')
    });
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return normalizeDedication(JSON.parse(saved));
    }
  } catch {
    // Ignorar localStorage corrupto
  }

  return normalizeDedication({});
}

export function saveDedicationToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeDedication(data)));
  } catch (e) {
    console.error('Failed to save dedication:', e);
  }
}

export function buildCompactShareUrl(data) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://flores.modlovelace.com';
  const token = encodeCompactToken(data);
  return `${origin}/r/${token}`;
}

export function buildShareUrl(data) {
  return getCachedShortShareUrl(data) || buildCompactShareUrl(data);
}

/**
 * Estrategia Híbrida:
 * Intenta obtener /s/<id> desde Vercel + Upstash Redis (con timeout rápido de 2.2s);
 * si no está configurado o falla la red, cae automáticamente al enlace comprimido /r/<token>.
 */
export async function resolveShortShareUrl(data) {
  const normalized = normalizeDedication(data);
  const cached = getCachedShortShareUrl(normalized);
  if (cached) {
    return { url: cached, mode: 'short' };
  }

  const compactUrl = buildCompactShareUrl(normalized);
  if (typeof window === 'undefined' || typeof fetch !== 'function') {
    return { url: compactUrl, mode: 'compact' };
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 2200);

  try {
    const response = await fetch('/api/s', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized),
      signal: controller.signal
    });

    if (!response.ok) {
      return { url: compactUrl, mode: 'compact' };
    }

    const payload = await response.json();
    if (payload?.ok && payload.shortUrl) {
      writeShortCache(normalized, payload.shortUrl);
      return { url: payload.shortUrl, mode: 'short' };
    }
  } catch {
    // Fallback silencioso al enlace comprimido
  } finally {
    window.clearTimeout(timeoutId);
  }

  return { url: compactUrl, mode: 'compact' };
}

export function buildWhatsAppShareUrl(data, shareUrl) {
  const normalized = normalizeDedication(data);
  const meta = resolveThemeMeta(normalized.theme);
  const text = meta.whatsappText(normalized.to, shareUrl);
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
