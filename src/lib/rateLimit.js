/**
 * In-memory IP rate limiter for sensitive backend endpoints
 */
const attemptsMap = new Map();

// Periodic cleanup every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attemptsMap.entries()) {
    if (now > record.resetTime) {
      attemptsMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function getClientIp(req) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
    return req.headers.get("x-real-ip") || "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

/**
 * Check if an IP has exceeded maximum attempts within the time window
 */
export function checkRateLimit(ip, action = "login", maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const key = `${action}:${ip}`;
  const now = Date.now();
  const record = attemptsMap.get(key);

  if (!record || now > record.resetTime) {
    return { isBlocked: false, remainingAttempts: maxAttempts };
  }

  if (record.attempts >= maxAttempts) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    return {
      isBlocked: true,
      retryAfterSec,
      remainingAttempts: 0,
    };
  }

  return {
    isBlocked: false,
    remainingAttempts: maxAttempts - record.attempts,
  };
}

/**
 * Record a failed attempt for an IP
 */
export function recordFailure(ip, action = "login", windowMs = 15 * 60 * 1000) {
  const key = `${action}:${ip}`;
  const now = Date.now();
  const record = attemptsMap.get(key);

  if (!record || now > record.resetTime) {
    attemptsMap.set(key, { attempts: 1, resetTime: now + windowMs });
  } else {
    record.attempts += 1;
  }
}

/**
 * Reset failed attempts on successful authentication
 */
export function resetLimit(ip, action = "login") {
  const key = `${action}:${ip}`;
  attemptsMap.delete(key);
}
