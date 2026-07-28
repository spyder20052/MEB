// Limitation de débit en mémoire par IP (fenêtre glissante).
// Suffisant pour un déploiement mono-instance ; sur une plateforme
// serverless multi-instances, prévoir un backend partagé (Upstash, etc.).

const hits = new Map<string, number[]>();

const MAX_KEYS = 10_000;

export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Purge grossière pour borner la mémoire.
  if (hits.size > MAX_KEYS) hits.clear();

  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "inconnu";
}
