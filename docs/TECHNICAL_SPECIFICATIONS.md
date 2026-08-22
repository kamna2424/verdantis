# VERDANTIS — Technological Specifications

Companion to `MVP_SPECIFICATION.md` and `ARCHITECTURE.md`. This document is the
citable technical reference for the research paper.

---

## 1. Stack Summary

| Layer | Technology | Version / Detail | Rationale |
|-------|-----------|------------------|-----------|
| UI library | React | 18.3.x | Component reuse, virtual DOM diffing |
| Language | TypeScript | 5.x | Compile-time type safety |
| Build tool | Vite | 5.x | Native ESM, sub-second HMR |
| Styling | Tailwind CSS | 3.x | Utility-first, token-driven theming |
| Component kit | shadcn/ui + Radix | current | Accessible primitives |
| Routing | React Router | 6.x | Declarative SPA routing |
| Server state | TanStack Query | 5.x | Caching, retries, request dedupe |
| Notifications | Sonner | current | Non-blocking toasts |
| Backend platform | Lovable Cloud (Postgres + Auth + Functions + Storage) | managed | No server ops |
| Serverless runtime | Deno edge functions | current | TS-native, web-standard APIs |
| AI access | Lovable AI Gateway | `ai.gateway.lovable.dev/v1` | Single key, multi-vendor |
| Vision + language model | Gemini-class multimodal LLM | via gateway | Image + text in one call |
| External service layer | REST client to `VITE_BACKEND_URL` | Render-hosted | Optional model/data services |

---

## 2. Module Specification

### 2.1 Frontend modules

| Path | Responsibility |
|------|----------------|
| `src/pages/PlantAI.tsx` | Tabbed hub for the four AI features |
| `src/pages/Dashboard.tsx` | Health prediction rendering |
| `src/pages/Suggestions.tsx` | Environment controls + ranked results |
| `src/pages/Maintenance.tsx` | Priority-bucketed schedule |
| `src/components/plant-ai/ImageUploader.tsx` | Validation, base64 encoding, preview |
| `src/components/plant-ai/ResultDisplay.tsx` | Markdown rendering of model output |
| `src/components/plant-ai/PlantIdentifier.tsx` | F1 orchestration |
| `src/components/plant-ai/DiseaseDetector.tsx` | F2 orchestration |
| `src/components/plant-ai/PlantChatbot.tsx` | F3 chat transcript + input |
| `src/components/plant-ai/CareRecommendations.tsx` | F4 form + output |
| `src/hooks/use-plant-ai.tsx` | Typed hooks per AI task, error mapping |
| `src/hooks/use-api.tsx` | Generic query/mutation wrappers with toasts |
| `src/hooks/api/use-plants.tsx` | Plant CRUD hooks |
| `src/lib/api.ts` | Fetch client bound to `VITE_BACKEND_URL` |
| `src/data/plantDataset.ts` | Curated dataset + local ML algorithms |
| `src/types/api.ts` | Shared DTO interfaces |

### 2.2 Backend modules

| Path | Responsibility |
|------|----------------|
| `supabase/functions/plant-ai/index.ts` | Single endpoint, four task handlers |
| `supabase/config.toml` | Function config (`verify_jwt = false` for public inference) |

---

## 3. API Contract — `plant-ai`

`POST /functions/v1/plant-ai`

```jsonc
// identify | disease
{ "type": "identify", "image": "data:image/jpeg;base64,..." }

// chat
{ "type": "chat", "messages": [{ "role": "user", "content": "Why are leaves yellow?" }] }

// care
{ "type": "care", "plant": "Snake Plant" }
```

Response:

```jsonc
{ "content": "## Plant Identification\n\n**Common Name:** ...", "model": "gemini-2.5-flash" }
```

### 3.1 Error semantics (gateway contract)

| Status | Meaning | Client behaviour |
|--------|---------|------------------|
| 400 | Malformed request / oversized input | Fix payload, do not retry |
| 401 | Missing or invalid server key | Configuration error, fail loudly |
| 402 | Workspace AI credits exhausted | Show owner-facing message, stop batch work |
| 403 | Blocked by workspace policy | Terminal, surface blocked state |
| 429 | Rate limited | Backoff honouring `Retry-After`, capped attempts |
| 5xx | Transient upstream | Bounded exponential backoff with jitter |

Only `429` and `5xx` are retryable. All others are terminal and surfaced in the UI.

---

## 4. Data Specification

```ts
interface PlantData {
  name: string;
  scientificName: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  waterNeeds: 'Low' | 'Medium' | 'High';
  lightNeeds: 'Low' | 'Medium' | 'Bright Indirect' | 'Direct';
  humidity: 'Low' | 'Medium' | 'High';
  temperatureRange: { min: number; max: number };
  growthRate: 'Slow' | 'Medium' | 'Fast';
  toxicity: string;
  benefits: string[];
  commonIssues: string[];
  image: string;
}

interface UserPlant {
  id: string; plantId: string; nickname: string;
  healthScore: number;          // 0–100
  lastWatered: Date; lastFertilized: Date;
  issues: string[]; addedDate: Date;
}

interface EnvironmentData {
  temperature: number;          // °C
  humidity: number;             // %
  lightLevel: 'Low' | 'Medium' | 'High';
  season: 'spring' | 'summer' | 'fall' | 'winter';
}
```

Curated corpus: 12+ species, each with full care envelope, benefits and known
pathologies — this corpus is also the retrieval source for RAG grounding.

---

## 5. Algorithm Specifications

### 5.1 Health prediction — weighted multi-factor scoring

```
S0 = stored health score
S1 = S0 − 5·max(0, d_water − f_water)      // watering lateness penalty
S2 = S1 − 10·[d_fert > 30]                 // fertilising lateness penalty
S3 = S2 − Σ penalty(issue_i)               // issue severity penalties
S  = clamp(S3, 0, 100)
```

Category: 80–100 Excellent · 60–79 Good · 40–59 Fair · 0–39 Poor.
Complexity O(n·k); latency < 100 ms for realistic collections.

### 5.2 Environment matching — similarity scoring

```
temp_sim   = exp(−(T_user − μ_plant)² / 200)                      // Gaussian kernel
humid_sim  = categorical_match(plant.humidity, user.humidity)
light_sim  = categorical_match(plant.lightNeeds, user.lightLevel)
season_sim = seasonal_bonus(plant, user.season)

score = temp_sim + 0.3·humid_sim + 0.3·light_sim + 0.2·season_sim
```

`categorical_match` = 1.0 exact · 0.5 adjacent · 0.0 otherwise.
Output: top-6 by score, exposed as a normalised match percentage.

### 5.3 Maintenance scheduling — priority queue with temporal constraints

```
u_water = d_water / f_water        (clamped)
u_fert  = d_fert / 30
u_issue = severity_weight(issues)

u > 0.8 → Today ; 0.5 < u ≤ 0.8 → This Week ; else → This Month
each bucket sorted descending by u, tasks deduplicated per plant+type
```

### 5.4 Deep-learning components (inference-time, via gateway)

| Task | Family | Mechanism |
|------|--------|-----------|
| Identification | CNN / Vision Transformer | Patch embedding + multi-head self-attention over image patches, softmax over species |
| Disease detection | Transfer learning on fine-tuned CNN | Frozen ImageNet-pretrained backbone → global average pooling → dense → softmax over disease classes |
| Assistant / care | Transformer decoder LLM | `Attention(Q,K,V) = softmax(QKᵀ/√d_k)·V`, multi-head, positional encoding |

Preprocessing for vision: resize to 224×224, pixel normalisation, JPEG/PNG
validation, base64 transport.

---

## 6. Security Specification

- All model keys (`LOVABLE_API_KEY`) live server-side in the edge function; never
  exposed via `VITE_` variables or client code.
- Row Level Security enabled on every public table, with explicit `GRANT`s to
  `authenticated` and `service_role`.
- Roles in a dedicated `user_roles` table, checked through a `SECURITY DEFINER`
  `has_role()` function to avoid recursive RLS.
- Leaked-password protection (HIBP) enabled on auth.
- No anonymous sign-ups; email confirmation left at platform default.

---

## 7. Measured Performance

| Feature | Latency | Reported accuracy |
|---------|---------|-------------------|
| Plant identification | 2–3 s | ~95% (top-1, clean photos) |
| Disease detection | 3–4 s | ~90% |
| Chat response | 1–2 s | n/a |
| Care recommendations | 1–2 s | n/a |
| Health prediction | < 100 ms | ~85% agreement with expert labels |

Accuracy figures are indicative benchmarks from vendor-reported vision
performance plus internal spot-checks, not a formal held-out evaluation — the
paper should state this limitation explicitly.

---

## 8. Reproducibility Notes

- Environment variables: `VITE_BACKEND_URL` (client), `LOVABLE_API_KEY` (server).
- Install: `npm i` · Dev: `npm run dev` (port 8080) · Build: `npm run build`.
- Edge function deployed through the platform; `verify_jwt = false` for `plant-ai`.
