# Corn (US) — RAG Corpus

A starter corpus of **open-access, redistributable** US corn agronomy content, captured as clean text ready for chunking and embedding. Chosen over the original sugarcane/Cenicaña idea because these sources are public-domain or openly licensed, bulk-downloadable, consistently structured, and abundant.

_Last updated: 2026-06-30_

## What's in here

```
corn-rag-corpus/
├── extension-guides/
│   ├── clemson-sc-corn-production-guide.txt        (full production guide, ~1,200 lines)
│   └── cornell-integrated-field-crop-management-2024.txt (full field crop guide, ~1,650 lines)
├── iowa-state/
│   └── isu-nitrogen-decisions-wet-spring-2026.txt  (in-season N / LSNT decision article)
├── usda-nass/
│   └── nass-crop-production-briefing-2026-05-12.txt (NASS statistical format sample)
├── purdue/        (empty — see expansion list)
└── reference/     (empty — see expansion list)
```

Each file starts with a metadata header (SOURCE / TITLE / URL / DATE / LICENSE / TOPIC) so provenance survives chunking — keep these as the first chunk's metadata when you ingest.

## Licensing (why these are safe to use)

- **USDA / NASS** — works of the US federal government, not subject to copyright (17 U.S.C. § 105). Effectively public domain; attribution requested ("U.S. Department of Agriculture").
- **University Cooperative Extension** (Iowa State, Cornell, Clemson, Purdue, Ohio State, UGA, etc.) — published for public redistribution. Iowa State's ICM, for example, explicitly permits republication with credit. Verify each publication's notice; most allow reuse with attribution.
- **FAO AGRIS Open Data Set** — CC BY 3.0 IGO.

## How to expand the corpus

### A. Bulk structured DATA — USDA NASS Quick Stats (best source of numbers)
- API home: https://www.nass.usda.gov/developer/
- API endpoint: https://quickstats.nass.usda.gov/api  (free API key required)
- Bulk download (entire dataset, daily gzip): https://www.nass.usda.gov/datasets
- Corn-specific query parameters: `commodity_desc=CORN`, `statisticcat_desc=YIELD|PRODUCTION|AREA HARVESTED`, `agg_level_desc=STATE|COUNTY`, `year__GE=2015`.
- This gives yields, acreage, production by state/county/year — ideal as a structured side-table alongside the text corpus.

### B. Dense TEXT guides (fetch as text, like the two already captured)
- Cornell Integrated Field Crop Management (annual): https://cropandpestguides.cce.cornell.edu/
- Clemson SC Corn Production Guide: https://www.clemson.edu/extension/agronomy/
- Ohio State Corn, Soybean, Wheat & Forages Field Guide: https://extensionpubs.osu.edu/
- Iowa State ICM — Corn hub: https://crops.extension.iastate.edu/crops/corn
- Iowa State Corn Encyclopedia: https://crops.extension.iastate.edu/encyclopedia?field_crop_target_id=130
- Purdue Corn Agronomy: https://www.agry.purdue.edu/ext/corn/
- Purdue field crops resources: https://extension.purdue.edu/anr/_teams/field-crops/resources/index.html
- University of Georgia grain guides: https://grains.caes.uga.edu/
- Penn State / University of Nebraska CropWatch are also strong, openly licensed sources.

### C. Global / multi-crop breadth (optional)
- FAO AGRIS Open Data Set (CC BY 3.0 IGO, ~8M records + full-text links): https://agris.fao.org/agris_ods/
- FAO Knowledge Repository: https://openknowledge.fao.org/

## Capture method (reproducible)

Content was pulled with the workspace web-fetch tool, which returns rendered **text** (HTML pages and PDFs both extract cleanly). The first metadata/redirect lines were stripped and the body saved as `.txt`. PDFs over the token limit are auto-saved to a file, then copied in. No binary downloads are needed — text is what the RAG pipeline consumes anyway.

## Suggested chunking notes

- These guides are long and section-structured. Chunk on headings (~500–800 tokens, ~10% overlap).
- Keep the metadata header as document-level metadata: `source`, `title`, `url`, `date`, `license`, `state/region`, `topic`.
- Tag by region (e.g., `IA`, `NY`, `SC`) since corn recommendations are state/climate specific — useful for filtered retrieval.
- Date-stamp chunks; refresh annually when new guide editions publish.
