import { normalizeDedication } from '../shared/dedication.js';
import {
  isStoreConfigured,
  isValidShortId,
  loadShortDedication,
  saveShortDedication
} from './_lib/store.js';

const MAX_BODY_BYTES = 16 * 1024;
const ALLOWED_CORS_ORIGINS = new Set([
  'https://flores.modlovelace.com',
  'https://regalaflores.modlovelace.com',
  'https://regala-flores-web.vercel.app',
  'https://modlovelace.com'
]);

function applyCorsHeaders(req, res) {
  const origin = req.headers?.origin;
  if (!origin) return;
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  if (ALLOWED_CORS_ORIGINS.has(origin) || isLocal) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
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

async function readBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body, 'utf8') > MAX_BODY_BYTES) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    return JSON.parse(req.body);
  }

  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    chunks.push(chunk);
  }
  if (chunks.length === 0) return null;
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export default async function handler(req, res) {
  applyCorsHeaders(req, res);
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET') {
    const rawId = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id;
    if (!isValidShortId(rawId)) {
      return res.status(400).json({ ok: false, error: 'invalid_id' });
    }
    if (!isStoreConfigured()) {
      return res.status(503).json({ ok: false, error: 'shortener_unconfigured' });
    }

    try {
      const dedication = await loadShortDedication(rawId);
      if (!dedication) {
        res.setHeader('Cache-Control', 'no-store');
        return res.status(404).json({ ok: false, error: 'not_found' });
      }
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).json({ ok: true, id: rawId, dedication });
    } catch (err) {
      console.error('Error loading short dedication:', err?.message || err);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(503).json({ ok: false, error: 'storage_unavailable' });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  if (!isStoreConfigured()) {
    return res.status(503).json({ ok: false, error: 'shortener_unconfigured' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch (err) {
    const status = err?.message === 'PAYLOAD_TOO_LARGE' ? 413 : 400;
    return res.status(status).json({ ok: false, error: 'invalid_payload' });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }

  try {
    const dedication = normalizeDedication(body);
    const { id, cached } = await saveShortDedication(dedication);
    const path = `/s/${id}`;
    const shortUrl = `${getOrigin(req)}${path}`;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, id, path, shortUrl, cached });
  } catch (err) {
    console.error('Error saving short dedication:', err?.message || err);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ ok: false, error: 'storage_unavailable' });
  }
}
