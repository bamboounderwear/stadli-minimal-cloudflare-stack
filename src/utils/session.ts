const DAY = 60 * 60 * 24;

export type SessionData = Record<string, unknown> & { userId?: string };

export class Session {
  constructor(private env: Env, private sid: string, private data: SessionData, private ttl = DAY * 7) {}

  static cookieName(env: Env) {
    return env.SESSION_COOKIE_NAME || "sid";
  }

  static async load(env: Env, req: Request): Promise<Session> {
    const cookie = req.headers.get("Cookie") || "";
    const name = this.cookieName(env);
    const match = cookie.match(new RegExp(`${name}=([^;]+)`));
    const sid = match?.[1] ?? crypto.randomUUID();
    const raw = (await env.SESSIONS.get(sid)) || "{}";
    const data = JSON.parse(raw) as SessionData;
    return new Session(env, sid, data);
  }

  async commit(): Promise<string> {
    await this.env.SESSIONS.put(this.sid, JSON.stringify(this.data), { expirationTtl: this.ttl });
    return this.sid;
  }

  toCookie(): string {
    const name = Session.cookieName(this.env);
    const sid = this.sid;
    const attrs = [
      `${name}=${sid}`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      `Max-Age=${this.ttl}`
    ];
    return attrs.join("; ");
  }

  get<T = unknown>(k: string): T | undefined {
    return this.data[k] as T | undefined;
  }
  set(k: string, v: unknown) {
    this.data[k] = v;
  }
}
