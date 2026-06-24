import { z } from "zod";

/**
 * Typed environment access. Every var is optional so the marketing app keeps
 * building in placeholder mode; tool code asserts what it needs via requireEnv()
 * to fail fast at the point of use.
 */
const envSchema = z.object({
  // Supabase (shared)
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  // LLM
  LLM_PROVIDER: z.string().optional(),
  LLM_API_KEY: z.string().optional(),
  LLM_MODEL: z.string().optional(),
  EMBEDDING_MODEL: z.string().optional(),
  // Temporary: bypass auth and act as this tenant until real sign-in ships.
  DEMO_TENANT_ID: z.string().optional(),
  // P3 data sources
  SENTINELHUB_CLIENT_ID: z.string().optional(),
  SENTINELHUB_CLIENT_SECRET: z.string().optional(),
  NASS_API_KEY: z.string().optional(),
  // P2 intake
  SPRAY_WEBHOOK_SECRET: z.string().optional(),
  // Cron protection
  CRON_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

/** Lazily parse and cache process.env against the schema. */
export function getEnv(): Env {
  if (!cached) cached = envSchema.parse(process.env);
  return cached;
}

/** Assert a set of env vars are present; throws (fail fast) if any are missing. */
export function requireEnv<K extends keyof Env>(
  keys: K[],
): Required<Pick<Env, K>> {
  const env = getEnv();
  const missing = keys.filter((k) => !env[k]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
  return env as Required<Pick<Env, K>>;
}
