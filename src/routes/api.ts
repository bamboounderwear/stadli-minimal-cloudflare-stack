export async function health(env: Env): Promise<Response> {
  // D1
  const d1 = await env.DB.prepare("select 1 as ok").first<{ ok: number }>();
  // KV
  await env.CONFIG.put("last_health", String(Date.now()), { expirationTtl: 3600 });
  // R2 (list only; bucket may be empty)
  const r2 = await env.BUCKET.list({ limit: 1 });
  // Analytics (do not await)
  env.LOGS.writeDataPoint({ blobs: ["health"], doubles: [1], indexes: [Date.now()] });

  const detail = {
    d1_ok: d1?.ok === 1,
    kv_ok: true,
    r2_ok: r2.objects !== undefined,
    ai_bound: !!env.AI
  };
  return new Response(JSON.stringify({ ok: true, detail }, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export async function aiEcho(req: Request, env: Env): Promise<Response> {
  try {
    const body = await req.json<any>().catch(() => ({}));
    const userText = body?.prompt ?? "Say hello";
    // Workers AI — simple echo with small model; replace with any model you enable
    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { messages: [{ role: "user", content: userText }] });
    return new Response(JSON.stringify({ model: "@cf/meta/llama-3.1-8b-instruct", result }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
