import { requireEnv } from "@/lib/shared/env";
import type { PolygonGeometry, StatisticalResponse } from "./schema";

/**
 * P3 — Copernicus Data Space (Sentinel-2) integration via the Sentinel Hub
 * Statistical API (project3-detailed-brief.md §3). OAuth2 client-credentials
 * token is cached in module scope and refreshed on expiry; fetchNdviStats
 * returns per-interval NDVI statistics for one field polygon as JSON.
 * Server-only.
 */

const TOKEN_URL =
  "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token";
const STATS_URL = "https://sh.dataspace.copernicus.eu/api/v1/statistics";

// NDVI + cloud/no-data mask (brief §3.4). dataMask excludes clouds, shadow,
// snow, saturated and out-of-polygon pixels so each interval's mean is clean.
const EVALSCRIPT = `//VERSION=3
function setup() {
  return {
    input: [{ bands: ["B04", "B08", "SCL", "dataMask"] }],
    output: [
      { id: "ndvi", bands: 1, sampleType: "FLOAT32" },
      { id: "dataMask", bands: 1 }
    ]
  };
}
function evaluatePixel(s) {
  let ndvi = (s.B08 - s.B04) / (s.B08 + s.B04);
  let bad = [0,1,3,8,9,10,11].includes(s.SCL);
  let valid = s.dataMask === 1 && !bad ? 1 : 0;
  return { ndvi: [ndvi], dataMask: [valid] };
}`;

let cachedToken: { value: string; expiresAt: number } | null = null;

/** Obtain (and cache) a CDSE bearer token via OAuth2 client credentials. */
export async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }
  const env = requireEnv(["SENTINELHUB_CLIENT_ID", "SENTINELHUB_CLIENT_SECRET"]);
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.SENTINELHUB_CLIENT_ID,
      client_secret: env.SENTINELHUB_CLIENT_SECRET,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `Copernicus token request failed: ${res.status} ${await res.text()}`,
    );
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.value;
}

/**
 * Request NDVI statistics for a field polygon over [from, to] in 5-day
 * windows. `from`/`to` are ISO timestamps (e.g. "2026-04-01T00:00:00Z").
 */
export async function fetchNdviStats(
  geometry: PolygonGeometry,
  from: string,
  to: string,
): Promise<StatisticalResponse> {
  const token = await getAccessToken();
  const body = {
    input: {
      bounds: {
        geometry,
        properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/4326" },
      },
      data: [{ type: "sentinel-2-l2a", dataFilter: { maxCloudCoverage: 60 } }],
    },
    aggregation: {
      timeRange: { from, to },
      aggregationInterval: { of: "P5D" },
      evalscript: EVALSCRIPT,
      // Bounds are EPSG:4326, so resx/resy are in DEGREES, not metres. ~0.0001°
      // ≈ 11 m, the closest match to Sentinel-2's native 10 m grid. Using 10
      // here collapsed each field to a single pixel (sampleCount: 1).
      resx: 0.0001,
      resy: 0.0001,
    },
    calculations: {
      ndvi: { statistics: { default: { percentiles: { k: [25, 50, 75] } } } },
    },
  };
  const res = await fetch(STATS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(
      `Sentinel Hub statistics request failed: ${res.status} ${await res.text()}`,
    );
  }
  return (await res.json()) as StatisticalResponse;
}
