export type Handler = (ctx: Ctx) => Promise<Response> | Response;

export interface Ctx {
  env: Env;
  url: URL;
  req: Request;
  params: Record<string, string>;
  state: Record<string, unknown>;
}

type Route = { method: string; pattern: RegExp; keys: string[]; handler: Handler };

export class Router {
  private routes: Route[] = [];

  on(method: string, path: string, handler: Handler) {
    const { regex, keys } = compile(path);
    this.routes.push({ method: method.toUpperCase(), pattern: regex, keys, handler });
    return this;
  }

  async handle(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    for (const r of this.routes) {
      if (r.method !== req.method && !(req.method === "HEAD" && r.method === "GET")) continue;
      const m = url.pathname.match(r.pattern);
      if (!m) continue;
      const params: Record<string, string> = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      const ctx: Ctx = { env, url, req, params, state: {} };
      return r.handler(ctx);
    }
    return new Response("Not Found", { status: 404 });
  }
}

// Converts /crm/fans/:id -> regex + keys
function compile(path: string) {
  const keys: string[] = [];
  const regex = new RegExp(
    "^" +
      path
        .replace(/\/+$/, "")
        .replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1")
        .replace(/:(\w+)/g, (_m, k) => {
          keys.push(k);
          return "([^/]+)";
        }) +
      "/?$"
  );
  return { regex, keys };
}
