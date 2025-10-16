import { layout, card, grid, jsonBlock } from "../utils/html";
export const NAV = [
  {
    "id": "home",
    "label": "Home",
    "path": "/home"
  },
  {
    "id": "web",
    "label": "Web App / Website",
    "path": "/web"
  },
  {
    "id": "crm",
    "label": "CRM / 360 Fan Profile",
    "path": "/crm"
  },
  {
    "id": "campaigns",
    "label": "Campaign Engine & Playbooks",
    "path": "/campaigns"
  },
  {
    "id": "analytics",
    "label": "Narratives & Analytics",
    "path": "/analytics"
  },
  {
    "id": "commerce",
    "label": "Commerce & Ticketing",
    "path": "/commerce"
  },
  {
    "id": "settings",
    "label": "Settings & Admin",
    "path": "/settings"
  }
] as const;
export type Nav = typeof NAV;

export function renderPage(active: typeof NAV[number]["id"], title: string, body: string, env: Env) {
  return new Response(
    layout({
      title,
      sidebar: NAV as unknown as any,
      active,
      body,
      appName: env.APP_NAME
    }),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export const pages = {
  home(_: URL, env: Env) {
    const body = grid([
      card("Revenue Summary", "<div class='muted'>Placeholder widget</div>"),
      card("Upcoming Events Readiness", "<div class='muted'>Placeholder widget</div>"),
      card("Active Campaigns", "<div class='muted'>Placeholder widget</div>"),
      card("Segment Movers", "<div class='muted'>Placeholder widget</div>"),
      card("Orders & Refunds", "<div class='muted'>Placeholder widget</div>"),
      card("Integration Health", "<div class='muted'>Placeholder widget</div>")
    ]);
    return renderPage("home", "Home", body, env);
  },
  web(_: URL, env: Env) {
    const body = grid([
      card("Pages & Navigation", "<div class='muted'>/web/pages</div>"),
      card("Blocks & Slots", "<div class='muted'>/web/blocks</div>"),
      card("Offer Surfaces", "<div class='muted'>/web/offers-surfaces</div>"),
      card("Sponsor Surfaces", "<div class='muted'>/web/sponsor-surfaces</div>"),
      card("Push Entrypoints", "<div class='muted'>/web/push-entrypoints</div>")
    ]);
    return renderPage("web", "Web App / Website", body, env);
  },
  crm(_: URL, env: Env) {
    const body = grid([
      card("Fans", "<div class='muted'>/crm/fans</div>"),
      card("Segments", "<div class='muted'>/crm/segments</div>"),
      card("Segment Builder", "<div class='muted'>/crm/segments/new</div>"),
      card("Data Mgmt", "<div class='muted'>/crm/data</div>")
    ]);
    return renderPage("crm", "CRM / 360° Fan Profile", body, env);
  },
  campaigns(_: URL, env: Env) {
    const body = grid([
      card("Campaigns", "<div class='muted'>/campaigns/list</div>"),
      card("Calendar", "<div class='muted'>/campaigns/calendar</div>"),
      card("Builder", "<div class='muted'>/campaigns/new</div>"),
      card("Playbooks", "<div class='muted'>/campaigns/playbooks</div>")
    ]);
    return renderPage("campaigns", "Campaign Engine & Playbooks", body, env);
  },
  analytics(_: URL, env: Env) {
    const body = grid([
      card("Narratives", "<div class='muted'>/analytics/narratives</div>"),
      card("Overview", "<div class='muted'>/analytics/overview</div>"),
      card("Attribution", "<div class='muted'>/analytics/attribution</div>"),
      card("Funnel", "<div class='muted'>/analytics/funnel</div>"),
      card("Segments", "<div class='muted'>/analytics/segments</div>"),
      card("Web Tag", "<div class='muted'>/analytics/web-tag</div>")
    ]);
    return renderPage("analytics", "Narratives & Analytics", body, env);
  },
  commerce(_: URL, env: Env) {
    const body = grid([
      card("Tickets & Packs", "<div class='muted'>/commerce/catalog/tickets</div>"),
      card("Products & Bundles", "<div class='muted'>/commerce/catalog/products</div>"),
      card("Offers", "<div class='muted'>/commerce/catalog/offers</div>"),
      card("Orders & Refunds", "<div class='muted'>/commerce/orders</div>"),
      card("Promotions", "<div class='muted'>/commerce/promotions</div>"),
      card("Checkout & Payments", "<div class='muted'>/commerce/checkout</div>")
    ]);
    return renderPage("commerce", "Commerce & Ticketing", body, env);
  },
  settings(_: URL, env: Env) {
    const body = grid([
      card("Users & Roles", "<div class='muted'>/settings/users</div>"),
      card("Integrations", "<div class='muted'>/settings/integrations</div>"),
      card("Data & Privacy", "<div class='muted'>/settings/privacy</div>"),
      card("Customization", "<div class='muted'>/settings/customization</div>"),
      card("Environments", "<div class='muted'>/settings/environments</div>")
    ]);
    return renderPage("settings", "Settings & Admin", body, env);
  }
};
