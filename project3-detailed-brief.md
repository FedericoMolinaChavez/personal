# Project 3 — Detailed Brief: Field Health & Operations Dashboard

NDVI source locked to **Copernicus Data Space Ecosystem (Sentinel-2)** via the **Sentinel Hub Statistical API**. Free, global (full LATAM coverage), 10m resolution, ~5-day revisit, and the satellite data is free for commercial use. The Statistical API returns NDVI statistics per field polygon as JSON — no image downloading or pixel processing on your side.

Companion to `agriculture-project-briefs.md` and `architecture-plan.md`.

---

## 1. What the tool does

A grower defines field boundaries; the system pulls a per-field NDVI time series (crop health), weather, and commodity prices, then renders charts + a field-health map and an AI briefing: "which field is declining, why, and what to do this week" — grounded strictly in the fetched numbers.

---

## 2. Data sources (all global / LATAM-ready)

| Layer | Source | Access |
|---|---|---|
| Crop health (NDVI) | Copernicus Data Space — Sentinel Hub Statistical API | OAuth2 client-credentials, free tier |
| Weather | Open-Meteo | No key, free |
| Commodity prices | USDA NASS (US benchmark) or local exchange/ministry feeds for LATAM | API / scrape |

> Prices note: USDA NASS is US-centric. For LATAM, benchmark prices (CME/Chicago for soy, corn, wheat) are still the reference most LATAM growers track, but you may add a local source (e.g. Bolsa de Cereales in Argentina, CEPEA in Brazil) later. Start with a global benchmark to keep the MVP simple.

---

## 3. Copernicus / Sentinel Hub integration

### 3.1 Authentication (OAuth2 client credentials)

1. Register an OAuth client in the Copernicus Data Space dashboard → get `client_id` + `client_secret`.
2. Exchange for a bearer token at the CDSE identity endpoint:
   `POST https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token`
   body: `grant_type=client_credentials&client_id=...&client_secret=...`
3. Token is short-lived (~10 min) — cache it server-side and refresh on expiry.

### 3.2 Statistical API endpoint (Copernicus deployment)

`POST https://sh.dataspace.copernicus.eu/api/v1/statistics`

> The commercial Sentinel Hub deployment uses `services.sentinel-hub.com/api/v1/statistics`; for the free Copernicus data use the `sh.dataspace.copernicus.eu` host. Confirm the exact host in the CDSE docs when you wire it up.

### 3.3 Request shape

```jsonc
{
  "input": {
    "bounds": {
      "geometry": { "type": "Polygon", "coordinates": [[[lng,lat], ...]] },  // the field
      "properties": { "crs": "http://www.opengis.net/def/crs/EPSG/0/4326" }
    },
    "data": [{
      "type": "sentinel-2-l2a",                 // L2A = surface reflectance, has SCL for cloud masking
      "dataFilter": { "maxCloudCoverage": 60 }
    }]
  },
  "aggregation": {
    "timeRange": { "from": "2026-04-01T00:00:00Z", "to": "2026-06-29T00:00:00Z" },
    "aggregationInterval": { "of": "P5D" },      // one stat block per 5-day window
    "evalscript": "<see 3.4>",
    "resx": 10, "resy": 10
  },
  "calculations": {
    "ndvi": { "statistics": { "default": { "percentiles": { "k": [25, 50, 75] } } } }
  }
}
```

### 3.4 NDVI evalscript (computes NDVI + cloud/no-data mask)

```javascript
//VERSION=3
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
  // SCL classes to exclude: clouds (8,9,10), cloud shadow (3), snow (11), saturated (1), no-data (0)
  let bad = [0,1,3,8,9,10,11].includes(s.SCL);
  let valid = s.dataMask === 1 && !bad ? 1 : 0;
  return { ndvi: [ndvi], dataMask: [valid] };
}
```

This is the key to a clean signal: `dataMask` excludes cloud, shadow, snow, and out-of-polygon pixels so each interval's mean NDVI reflects only valid crop pixels.

---

## 4. Data model — what Copernicus returns

The Statistical API returns one block per aggregation interval. Representative response (trimmed):

```jsonc
{
  "data": [
    {
      "interval": { "from": "2026-04-01T00:00:00Z", "to": "2026-04-06T00:00:00Z" },
      "outputs": {
        "ndvi": {
          "bands": {
            "B0": {
              "stats": {
                "min": 0.21,
                "max": 0.83,
                "mean": 0.612,
                "stDev": 0.084,
                "sampleCount": 1450,     // pixels in the bounding box
                "noDataCount": 320,      // excluded by dataMask (clouds + outside polygon)
                "percentiles": { "25.0": 0.55, "50.0": 0.63, "75.0": 0.69 }
              }
            }
          }
        }
      },
      "geometryPixelCount": 1130          // pixels intersecting the field polygon
    },
    {
      "interval": { "from": "2026-04-06T00:00:00Z", "to": "2026-04-11T00:00:00Z" },
      "outputs": {}                        // empty = no valid data this interval (e.g. fully clouded)
    }
  ],
  "status": "OK"
}
```

Key fields and how to read them:

- **`interval.from` / `interval.to`** — the time window for this stat block.
- **`outputs.ndvi.bands.B0.stats.mean`** — the per-field mean NDVI for the window (your headline metric).
- **`min` / `max` / `stDev` / percentiles** — spread within the field (useful for spotting in-field variability / stressed zones).
- **`sampleCount`** — pixels in the request bounding box.
- **`noDataCount`** — pixels excluded by the mask (clouds + outside polygon).
- **`geometryPixelCount`** — pixels actually intersecting the field.
- **Valid coverage** ≈ `(sampleCount - noDataCount) / geometryPixelCount`. Use this to gauge confidence — discard intervals where valid coverage is too low (heavy cloud) rather than plotting a misleading mean.
- **`outputs: {}`** — interval had no usable data; skip it, don't store a null as if it were a reading.

### 4.1 TypeScript type for the raw response

```typescript
interface StatBlock {
  interval: { from: string; to: string };
  outputs: {
    ndvi?: { bands: { B0: { stats: NdviStats } } };
  };
  geometryPixelCount?: number;
}
interface NdviStats {
  min: number; max: number; mean: number; stDev: number;
  sampleCount: number; noDataCount: number;
  percentiles?: Record<string, number>;
}
interface StatisticalResponse { data: StatBlock[]; status: string; }
```

### 4.2 Normalize into the DB (`fields.ndvi_readings`)

Per the architecture plan, flatten each non-empty interval into one row:

```typescript
function toReadings(fieldId: string, tenantId: string, res: StatisticalResponse) {
  return res.data
    .filter(b => b.outputs.ndvi)                      // drop empty intervals
    .map(b => {
      const s = b.outputs.ndvi!.bands.B0.stats;
      const validPct = b.geometryPixelCount
        ? (s.sampleCount - s.noDataCount) / b.geometryPixelCount
        : null;
      return {
        field_id: fieldId,
        tenant_id: tenantId,
        captured_on: b.interval.from.slice(0, 10),     // date
        ndvi_mean: s.mean,
        ndvi_min: s.min,
        ndvi_max: s.max,
        ndvi_std: s.stDev,
        cloud_pct: 1 - (validPct ?? 0),                // proxy: invalid share
        valid_coverage: validPct
      };
    })
    .filter(r => (r.valid_coverage ?? 0) >= 0.5);      // keep only well-covered intervals
}
```

Suggested `fields.ndvi_readings` columns (extends the architecture plan): `ndvi_mean, ndvi_min, ndvi_max, ndvi_std, cloud_pct, valid_coverage`.

---

## 5. Caching & scheduling

- NDVI for a field changes at most every ~5 days — **don't fetch on page load**. A Vercel Cron job (`/api/cron/ndvi-refresh`) runs daily, requests only the new window since each field's last `captured_on`, and upserts readings.
- Statistical API has request quotas (processing units) even on the free tier — batch by requesting a multi-interval `timeRange` per field in one call rather than per-interval calls.
- Weather (Open-Meteo) and prices refresh on their own cron; all three land in `fields.*` tables so the UI and AI briefing read only from your DB, never live APIs.

---

## 6. AI briefing (grounded)

- Inputs to the model: **computed metrics as JSON only** — per-field NDVI trend (current vs previous interval, % change), valid coverage, recent weather (rain, heat, wind), and price moves for each field's crop. Never raw imagery.
- Prompt instruction: report only numbers present in the JSON; cite the field name and the value; flag fields with NDVI decline beyond a threshold; tie a likely driver from weather where present; suggest 1–2 concrete actions (scout, irrigate, hold/sell). If data is insufficient (low coverage), say so rather than guessing.
- Store each briefing in `fields.briefings` with the `metrics` JSON it was generated from (auditability + you can show the inputs beside the output in the demo).

---

## 7. Build steps

1. Set up the Copernicus OAuth client; build a token cache/refresh helper in `lib/fields/ndvi.ts`.
2. Build field-boundary input (draw on a map / upload GeoJSON) → store polygons in PostGIS (`fields.fields.geom`).
3. Implement the Statistical API call with the NDVI evalscript; parse the response with the types above.
4. Implement `toReadings` normalization + upsert into `fields.ndvi_readings`; verify valid-coverage filtering against a cloudy date.
5. Add Open-Meteo + price ingestion with period-over-period comparison.
6. Wire the daily cron jobs.
7. Build charts (NDVI trend per field), the color-coded field-health map, and metric cards.
8. Build the AI briefing from computed metric JSON; test across date ranges and a heavily-clouded period to confirm it never fabricates numbers and degrades gracefully.

---

## 8. Test approach

- Pick 2–3 **real LATAM field coordinates** (e.g. soy fields in Argentina/Brazil) and a 3-month range — Sentinel-2 covers them, so the demo is live.
- Verify NDVI sanity: growing-season fields should trend up then plateau; bare/harvested fields sit low (~0.1–0.2); healthy canopy ~0.6–0.85.
- Force a cloudy interval and confirm it's filtered (empty `outputs` or low coverage), not plotted as a dip.
- Eval the briefing: feed known metric JSON, check every number it states exists in the input and the suggested action matches the trend.

---

## 9. Headline for the case study

"Turns Sentinel-2 satellite, weather, and market data into a 30-second weekly briefing telling a grower which field needs attention and whether to sell — anywhere in LATAM, on free Copernicus data."
