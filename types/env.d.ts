export interface Env {
  APP_NAME: string;
  SESSION_COOKIE_NAME: string;
  CSP_REPORT_ONLY: string;

  ASSETS: Fetcher;
  DB: D1Database;
  SESSIONS: KVNamespace;
  CONFIG: KVNamespace;
  BUCKET: R2Bucket;
  AI: Ai;
  LOGS: AnalyticsEngineDataset;
}
