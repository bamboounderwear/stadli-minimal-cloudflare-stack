export type NavItem = { id: string; label: string; path: string };
export type TopCreate = { id: string; label: string; target: string };

export function layout(opts: {
  title: string;
  sidebar: NavItem[];
  active: string;
  body: string;
  appName: string;
}) {
  const nav = sidebar(opts.sidebar, opts.active);
  return /*html*/ `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="/favicon.svg">
<link rel="stylesheet" href="/css/styles.css">
<title>${escapeHtml(opts.title)} • ${escapeHtml(opts.appName)}</title>
<body>
  <div class="wrapper">
    <aside class="sidebar">
      <h1>🏟️ ${escapeHtml(opts.appName)}</h1>
      <nav class="nav">${nav}</nav>
      <div class="muted" style="margin-top:12px;">Minimal Cloudflare Stack</div>
    </aside>
    <main>
      <div class="topbar">
        <div class="badge"><span>🔎</span> Global Search (stub)</div>
        <div class="badge">Signed Out</div>
      </div>
      <div class="content">${opts.body}</div>
    </main>
  </div>
</body>
</html>`;
}

export function sidebar(items: NavItem[], active: string) {
  return items.map(i => {
    const cls = i.id === active ? "active" : "";
    return `<a class="${cls}" href="${i.path}">${escapeHtml(i.label)}</a>`;
  }).join("");
}

export function card(title: string, body: string, footer = "") {
  return `<div class="card"><h3 style="margin-top:0">${escapeHtml(title)}</h3><div>${body}</div>${footer ? `<div class="muted" style="margin-top:8px">${footer}</div>` : ""}</div>`;
}

export function grid(children: string[]) {
  return `<div class="grid">${children.join("")}</div>`;
}

export function jsonBlock(obj: unknown) {
  return `<pre>${escapeHtml(JSON.stringify(obj, null, 2))}</pre>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c] as string));
}
