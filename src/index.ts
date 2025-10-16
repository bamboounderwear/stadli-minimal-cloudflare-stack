import { Router } from "./router";
import { securityHeaders, corsHeaders } from "./utils/security";
import { Session } from "./utils/session";
import { pages } from "./routes/pages";
import { health, aiEcho } from "./routes/api";

const router = new Router()
  // Pages
  .on("GET", "/", ({ env }) => Response.redirect("/home", 302))
  .on("GET", "/home", ({ env, url }) => pages.home(url, env))
  .on("GET", "/web", ({ env, url }) => pages.web(url, env))
  .on("GET", "/crm", ({ env, url }) => pages.crm(url, env))
  .on("GET", "/campaigns", ({ env, url }) => pages.campaigns(url, env))
  .on("GET", "/analytics", ({ env, url }) => pages.analytics(url, env))
  .on("GET", "/commerce", ({ env, url }) => pages.commerce(url, env))
  .on("GET", "/settings", ({ env, url }) => pages.settings(url, env))
  // API
  .on("GET", "/api/health", ({ env }) => health(env))
  .on("POST", "/api/ai/echo", ({ env, req }) => aiEcho(req, env))
;

export default {
  async fetch(req: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);

    // Preflight CORS
    if (req.method === "OPTIONS") {
      const res = new Response(null, { status: 204 });
      mergeHeaders(res.headers, corsHeaders(req.headers.get("Origin")));
      return res;
    }

    // KV session
    const session = await Session.load(env, req);

    // Route handling
    let res = await router.handle(req, env);

    // Fallback to static assets for unknowns
    if (res.status === 404) {
      res = await env.ASSETS.fetch(req);
      if (res.status === 404) {
        res = new Response("Not Found", { status: 404 });
      }
    }

    // Security headers
    mergeHeaders(res.headers, securityHeaders(env.CSP_REPORT_ONLY === "true"));
    mergeHeaders(res.headers, corsHeaders(req.headers.get("Origin")));

    // Set session cookie if new
    const setCookie = session.toCookie();
    res.headers.append("Set-Cookie", setCookie);

    // Tiny access log (non-blocking)
    env.LOGS.writeDataPoint({
      blobs: ["req", url.pathname, req.method],
      indexes: [Date.now()]
    });

    return res;
  }
} satisfies ExportedHandler<Env>;

function mergeHeaders(dst: Headers, src: Headers) {
  for (const [k, v] of src) dst.set(k, v);
}
