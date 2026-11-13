import { createHash, randomBytes } from 'node:crypto';
import { fromCompactTuple, toCompactTuple } from '../../shared/dedication.js';

const KEY_PREFIX = 'flores:s:';
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const SHORT_ID_PATTERN = /^[0-9A-Za-z]{5,24}$/;

function getRedisCredentials() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
  return url && token ? { url: url.replace(/\/+$/, ''), token } : null;
}

export function isStoreConfigured() {
  return Boolean(getRedisCredentials());
}

export function isValidShortId(id) {
  return typeof id === 'string' && SHORT_ID_PATTERN.test(id);
}

function toBase62(buffer, length) {
  let num = BigInt('0x' + buffer.subarray(0, 8).toString('hex'));
  let out = '';
  for (let i = 0; i < length; i++) {
    out = BASE62[Number(num % 62n)] + out;
    num /= 62n;
  }
  return out;
}

async function redisCommand(command) {
  const creds = getRedisCredentials();
  if (!creds) {
    throw new Error('STORE_UNCONFIGURED');
  }

  const response = await fetch(creds.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${creds.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(2500)
  });

  if (!response.ok) {
    throw new Error(`REDIS_HTTP_${response.status}`);
  }

  const payload = await response.json();
  if (payload?.error) {
    throw new Error(`REDIS_ERROR_${payload.error}`);
  }
  return payload?.result ?? null;
}

export async function saveShortDedication(rawInput) {
  const tuple = toCompactTuple(rawInput);
  const serialized = JSON.stringify(tuple);
  const digest = createHash('sha256').update(serialized, 'utf8').digest();
  const primaryId = toBase62(digest, 7);

  const inserted = await redisCommand(['SET', KEY_PREFIX + primaryId, serialized, 'NX']);
  if (inserted === 'OK') {
    return { id: primaryId, cached: false };
  }

  const existing = await redisCommand(['GET', KEY_PREFIX + primaryId]);
  if (existing === serialized) {
    return { id: primaryId, cached: true };
  }

  // Fallback para colisión improbable: ID aleatorio de 8 caracteres
  for (let attempt = 0; attempt < 3; attempt++) {
    const candidate = toBase62(randomBytes(8), 8);
    const ok = await redisCommand(['SET', KEY_PREFIX + candidate, serialized, 'NX']);
    if (ok === 'OK') {
      return { id: candidate, cached: false };
    }
  }

  throw new Error('SHORT_ID_ALLOCATION_FAILED');
}

export async function loadShortDedication(id) {
  if (!isValidShortId(id)) return null;

  const raw = await redisCommand(['GET', KEY_PREFIX + id]);
  if (!raw) return null;

  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return Array.isArray(parsed) ? fromCompactTuple(parsed) : null;
}
