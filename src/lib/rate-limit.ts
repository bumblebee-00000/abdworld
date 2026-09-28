const requestsByIp = new Map<string, { count: number; resetAt: number }>();

export function checkSubmissionRateLimit(
  ip: string,
  maxRequests = 10,
  windowMs = 60 * 60 * 1000
): boolean {
  const now = Date.now();
  const entry = requestsByIp.get(ip);

  if (!entry || now > entry.resetAt) {
    requestsByIp.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;

  entry.count += 1;
  return true;
}