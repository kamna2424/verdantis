# VERDANTIS — System Architecture, ML Models and RAG Design

Reference architecture document for the research paper. Pairs with
`MVP_SPECIFICATION.md` and `TECHNICAL_SPECIFICATIONS.md`.

---

## 1. Architectural Style

Three-tier, serverless, ML-inference-oriented:

1. **Presentation tier** — React SPA, route-level code splitting, TanStack Query
   as the single server-state cache.
2. **Application tier** — Deno edge function acting as an inference gateway and
   prompt/RAG orchestrator. All secrets and system prompts live here.
3. **Intelligence tier** — Lovable AI Gateway fronting multimodal and language
   models; plus a deterministic local ML layer running in the browser for
   scoring and ranking.

Rationale: no hardware, no persistent server, and no client-visible credentials,
while keeping heavy generative work off the client and cheap scoring on it.

---

## 2. Layered Diagram

```text
┌───────────────────────── CLIENT (browser) ─────────────────────────┐
│ React 18 + TypeScript + Tailwind + shadcn/ui                       │
│                                                                     │
│  Pages: PlantAI · Dashboard · Suggestions · Maintenance             │
│  Hooks: use-plant-ai · use-api · use-plants                         │
│  Local ML layer: plantDataset.ts                                    │
│    - weighted health scoring                                        │
│    - Gaussian + categorical similarity ranking                      │
│    - priority-queue scheduling                                      │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS (JSON, base64 images)
┌──────────────────────────────▼──────────────────────────────────────┐
│              EDGE FUNCTION  supabase/functions/plant-ai              │
│  ┌──────────┬──────────┬──────────┬──────────┐                      │
│  │ identify │ disease  │  chat    │  care    │  task routing        │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┘                      │
│       │          │          │          │                            │
│   RAG retrieval over curated plant corpus (grounding context)        │
│       └──────────┴─────┬────┴──────────┘                            │
│                        ▼                                            │
│              prompt assembly + guardrails                           │
│              (system prompt, schema, safety)                        │
└────────────────────────┬────────────────────────────────────────────┘
                         │  Lovable-API-Key header
┌────────────────────────▼────────────────────────────────────────────┐
│                     LOVABLE AI GATEWAY                              │
│   multimodal vision-language model  ·  transformer LLM              │
│   rate limiting · credit accounting · error contract                │
└────────────────────────┬────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────────┐
│  LOVABLE CLOUD: Postgres (RLS) · Auth · Storage · Secrets           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Request Flow — Vision Path (Identification / Disease)

```text
Image file
  → ImageUploader: MIME + size validation, downscale, base64 encode
  → use-plant-ai hook: mutation, optimistic UI, error mapping
  → edge function: task routing, RAG retrieval, prompt assembly
  → gateway: vision-language inference (streamed for long generations)
  → edge function: normalise to { content, model }
  → ResultDisplay: markdown render
```

Long generations stream inside the function (`streamText` consumed server-side)
so no request stalls past the platform's ~2 minute no-byte cutoff.

## 4. Request Flow — Local ML Path (Dashboard / Suggestions / Maintenance)

```text
User plants + environment inputs
  → plantDataset.ts algorithms (pure functions, no network)
  → memoised results
  → cards, ranked lists, task buckets
```

Deterministic, offline-capable, and cheap — which is why these features never
call the gateway.

---

## 5. ML / DL Model Design

### 5.1 Model inventory

| Component | Model family | Modality | Where it runs |
|-----------|--------------|----------|---------------|
| Plant identification | CNN / Vision Transformer (ViT) | image → text | Gateway |
| Disease detection | Transfer-learned CNN classifier | image → text | Gateway |
| Plant assistant | Transformer decoder LLM | text → text | Gateway |
| Care recommendation | Transformer decoder LLM + RAG | text → text | Gateway |
| Health prediction | Weighted linear penalty model | tabular → score | Client |
| Species matching | Gaussian kernel + categorical similarity | tabular → ranking | Client |
| Scheduling | Priority queue with temporal urgency | tabular → buckets | Client |

### 5.2 Vision pipeline (formal)

```text
x ∈ ℝ^{H×W×3}
  → resize 224×224, normalise                       (preprocessing)
  → patch embedding P: x → {p_1..p_N} ∈ ℝ^{N×d}     (ViT) or conv stack (CNN)
  → L × [ MHSA(LN(h)) + h ; MLP(LN(h)) + h ]        (encoder blocks)
  → pooled representation z ∈ ℝ^d
  → softmax(W z + b)                                (species / disease class)
```

Convolutional path: convolution → ReLU → pooling stacks build a spatial
hierarchy from edges and textures to leaf morphology and lesion patterns.
Transfer learning freezes the ImageNet-pretrained backbone, adds global average
pooling and dense heads, then fine-tunes on plant-disease data.

### 5.3 Language pipeline (formal)

```text
Attention(Q,K,V) = softmax(QKᵀ / √d_k) · V
MultiHead(h)     = Concat(head_1..head_H) W_O
h_0              = Embed(tokens) + PositionalEncoding
h_{l+1}          = h_l + MLP(LN(h_l + MHSA(LN(h_l))))
```

Domain conditioning comes from a horticulture system prompt plus retrieved
grounding passages; conversation memory is the full prior turn list replayed
each request.

### 5.4 Local scoring models

Health penalty model — linear with clamped output:

```
S = clamp( S0 − 5·max(0, d_w − f_w) − 10·[d_f > 30] − Σ w_i·issue_i , 0, 100 )
```

Similarity model — mixed kernel:

```
score = exp(−ΔT²/200) + 0.3·m(humidity) + 0.3·m(light) + 0.2·b(season)
m(·) ∈ {0, 0.5, 1.0}
```

---

## 6. RAG (Retrieval-Augmented Generation) Design

### 6.1 Why RAG

Generative models hallucinate botanical specifics — temperature envelopes,
toxicity, watering intervals. RAG binds every generated care claim to a curated
record so the output is auditable against the corpus.

### 6.2 Corpus

- Source: `src/data/plantDataset.ts` — 12+ species records, each carrying
  scientific name, care envelope, difficulty, growth rate, toxicity, benefits
  and known pathologies.
- Chunking: one chunk per species record (records are small and self-contained,
  so record-level chunking preserves full context and avoids split fields).
- Metadata per chunk: species name, difficulty, water/light/humidity class,
  temperature range, issue list.

### 6.3 Pipeline

```text
INDEXING (offline)
  species record → normalised text card → embedding model → vector + metadata
                                                        → vector store

QUERY (per request)
  user question / detected species
    → embed query
    → top-k nearest neighbours by cosine similarity (k = 3–5)
    → metadata filter (light/humidity/temperature when the user supplies them)
    → assemble grounding block
    → prompt = system prompt + grounding block + user turn(s)
    → LLM generation, instructed to cite the retrieved species records
    → answer + provenance
```

### 6.4 Retrieval mathematics

```
sim(q, d) = (q · d) / (‖q‖ ‖d‖)                 cosine similarity
Top-k     = argmax_{d ∈ D}^{k} sim(q, d)
Hybrid    = α · sim_dense(q,d) + (1−α) · BM25(q,d),  α ≈ 0.7
```

Hybrid retrieval is used because species names are rare lexical tokens that
dense vectors alone can under-weight; BM25 recovers exact-name matches.

### 6.5 Grounding contract

- If retrieval returns nothing above the similarity floor, the model is
  instructed to say the species is outside the corpus rather than invent care
  numbers.
- Vision outputs feed retrieval: the identified species name becomes the
  retrieval query for the follow-up care answer, chaining CV → RAG → NLG.
- Retrieved facts take precedence over model priors in the prompt ordering.

### 6.6 Evaluation plan for the paper

| Metric | What it measures |
|--------|------------------|
| Recall@k | Fraction of queries whose gold species appears in top-k |
| MRR | Rank quality of the correct record |
| Groundedness | Share of generated claims traceable to a retrieved chunk |
| Answer accuracy | Expert agreement on care correctness |
| Latency breakdown | retrieval vs generation contribution |

---

## 7. Cross-Cutting Concerns

| Concern | Design |
|---------|--------|
| Secrets | Server-only; `LOVABLE_API_KEY` never reaches the client |
| Auth | Email/password + leaked-password (HIBP) protection |
| Authorisation | `user_roles` table + `has_role()` SECURITY DEFINER function |
| Data access | RLS on every public table with explicit GRANTs |
| Caching | TanStack Query keys per task + input hash |
| Failure handling | Gateway status contract; only 429/5xx retried, bounded backoff |
| Observability | Edge function logs, network inspection, gateway request logs |
| Theming | Semantic design tokens in global CSS; no hardcoded colour utilities |

---

## 8. Deployment Topology

```text
Static SPA (CDN)  →  Edge function (Deno, regional)  →  AI Gateway  →  Model providers
                                  ↓
                        Postgres + Auth + Storage
```

Optional external service layer at `VITE_BACKEND_URL` (Render) is available for
future self-hosted model endpoints; the MVP does not depend on it.

---

## 9. Known Limitations (state these in the paper)

1. No formally held-out evaluation set; accuracy figures are indicative.
2. Corpus breadth is 12+ species — regional coverage is future work.
3. Vision inference is vendor-hosted, so exact architecture and weights are not
   under experimental control.
4. Health and urgency weights are expert-set heuristics, not learned parameters.
5. RAG index is small enough that retrieval quality is not yet the bottleneck;
   conclusions may not transfer to a large corpus.

---

## 10. Future Architecture Work

- Learn health-penalty weights from longitudinal user outcomes.
- Fine-tune a compact on-device CNN for offline identification.
- Expand the RAG corpus with expert-verified regional species and reciprocal
  rank fusion across dense, sparse and metadata retrievers.
- Add a reranker stage (cross-encoder) between retrieval and generation.
