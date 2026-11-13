import fs from 'node:fs';
import path from 'node:path';
import { inflateRawSync } from 'node:zlib';
import {
  fromCompactTuple,
  normalizeDedication,
  resolveThemeMeta
} from '../shared/dedication.js';
import { isStoreConfigured, isValidShortId, loadShortDedication } from './_lib/store.js';

const MAX_TOKEN_LENGTH = 4096;
const MAX_INFLATED_BYTES = 16 * 1024;

let cachedHtmlTemplate = null;

function firstParam(query, key) {
  const value = query?.[key];
  return Array.isArray(value) ? value[0] : value;
}

function getOrigin(req) {
  const protoHeader = req.headers['x-forwarded-proto'];
  const proto = (Array.isArray(protoHeader) ? protoHeader[0] : protoHeader || 'https')
    .split(',')[0]
    .trim();
  const hostHeader = req.headers['x-forwarded-host'] || req.headers.host;
  const host = (Array.isArray(hostHeader) ? hostHeader[0] : hostHeader || 'flores.modlovelace.com')
    .split(',')[0]
    .trim();
  return `${proto}://${host}`;
}

function escapeHtmlAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeJsonForScript(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function decodeCompressedToken(token) {
  if (!token || typeof token !== 'string' || token.length > MAX_TOKEN_LENGTH) {
    return null;
  }
  try {
    const compressed = Buffer.from(token, 'base64url');
    if (compressed.length === 0) return null;
    const inflated = inflateRawSync(compressed, { maxOutputLength: MAX_INFLATED_BYTES });
    const parsed = JSON.parse(inflated.toString('utf8'));
    return fromCompactTuple(parsed);
  } catch {
    return null;
  }
}

async function getHtmlTemplate(origin) {
  if (cachedHtmlTemplate) return cachedHtmlTemplate;

  try {
    const distPath = path.join(process.cwd(), 'dist', 'index.html');
    const content = fs.readFileSync(distPath, 'utf8');
    if (content && !content.includes('/src/main.jsx')) {
      cachedHtmlTemplate = content;
      return content;
    }
  } catch {
    // Continuar con fallback HTTP hacia el CDN estático
  }

  const res = await fetch(`${origin}/`, { signal: AbortSignal.timeout(2500) });
  if (!res.ok) {
    throw new Error(`TEMPLATE_FETCH_${res.status}`);
  }
  const fetched = await res.text();
  if (!fetched || fetched.includes('/src/main.jsx')) {
    throw new Error('INVALID_TEMPLATE_HTML');
  }
  cachedHtmlTemplate = fetched;
  return cachedHtmlTemplate;
}

function injectDedicationIntoHtml(template, dedication, origin, currentUrl) {
  const meta = resolveThemeMeta(dedication.theme);
  const title = `${meta.shortName} para ${dedication.to}`;
  const ogTitle = meta.ogTitle(dedication.to, dedication.from);
  const ogDescription = meta.ogDescription(dedication.to, dedication.from);
  const ogImage = `${origin}${meta.ogImagePath}`;

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtmlAttr(title)}</title>`);
  html = html.replace(
    /<meta name="theme-color" content="[^"]*"\s*\/?>/,
    `<meta name="theme-color" content="${escapeHtmlAttr(meta.themeColor)}" />`
  );
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtmlAttr(ogDescription)}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtmlAttr(ogTitle)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtmlAttr(ogDescription)}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${escapeHtmlAttr(ogImage)}" />`
  );

  const ogUrlTag = `<meta property="og:url" content="${escapeHtmlAttr(currentUrl)}" />`;
  const hydrateTag = `<script>window.__INITIAL_DEDICATION__=${safeJsonForScript(dedication)};</script>`;

  if (html.includes('<!-- __DEDICATION_HYDRATE__ -->')) {
    html = html.replace('<!-- __DEDICATION_HYDRATE__ -->', hydrateTag);
    return html.replace('</head>', `    ${ogUrlTag}\n  </head>`);
  }

  return html.replace('</head>', `    ${ogUrlTag}\n    ${hydrateTag}\n  </head>`);
}

export default async function handler(req, res) {
  const origin = getOrigin(req);
  const query = req.query || {};

  let dedication = null;
  let cachePolicy = 'no-store';

  const shortId = firstParam(query, 'id');
  const rawToken = firstParam(query, 'r') || firstParam(query, 'd');

  if (shortId) {
    if (isValidShortId(shortId) && isStoreConfigured()) {
      try {
        dedication = await loadShortDedication(shortId);
        if (dedication) {
          cachePolicy = 'public, s-maxage=3600, stale-while-revalidate=86400';
        }
      } catch (err) {
        console.error('Error resolving /s/:id:', err?.message || err);
      }
    }
  } else if (rawToken) {
    dedication = decodeCompressedToken(rawToken);
    if (dedication) {
      cachePolicy = 'public, s-maxage=86400, stale-while-revalidate=604800';
    }
  } else if (
    firstParam(query, 'theme') ||
    firstParam(query, 'tema') ||
    firstParam(query, 't') ||
    firstParam(query, 'to') ||
    firstParam(query, 'para') ||
    firstParam(query, 'from') ||
    firstParam(query, 'de') ||
    firstParam(query, 'msg') ||
    firstParam(query, 'mensaje')
  ) {
    dedication = normalizeDedication({
      theme: firstParam(query, 'theme') || firstParam(query, 'tema') || firstParam(query, 't'),
      to: firstParam(query, 'to') || firstParam(query, 'para'),
      from: firstParam(query, 'from') || firstParam(query, 'de'),
      message: firstParam(query, 'msg') || firstParam(query, 'mensaje'),
      date: firstParam(query, 'date') || firstParam(query, 'fecha')
    });
    cachePolicy = 'public, s-maxage=3600, stale-while-revalidate=86400';
  }

  try {
    const template = await getHtmlTemplate(origin);
    const currentUrl = shortId
      ? `${origin}/s/${shortId}`
      : rawToken
        ? `${origin}/r/${rawToken}`
        : `${origin}${req.url || '/'}`;

    const html = dedication ? injectDedicationIntoHtml(template, dedication, origin, currentUrl) : template;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', cachePolicy);
    return res.status(200).send(html);
  } catch (err) {
    console.error('Error serving HTML:', err?.message || err);
    return res.status(500).send('Internal Server Error');
  }
}
