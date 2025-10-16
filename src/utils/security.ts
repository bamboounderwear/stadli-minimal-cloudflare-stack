export function securityHeaders(reportOnly = false): Headers {
  const h = new Headers();
  const csp = [
    "default-src 'none'",
    "base-uri 'self'",
    "img-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self'",
    "font-src 'self' data:",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join("; ");
  h.set(reportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy", csp);
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("Permissions-Policy", "camera=(), geolocation=(), microphone=()");
  return h;
}

export function corsHeaders(origin: string | null): Headers {
  const h = new Headers();
  if (origin) {
    h.set("Access-Control-Allow-Origin", origin);
    h.set("Vary", "Origin");
  }
  h.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  h.set("Access-Control-Max-Age", "600");
  return h;
}
