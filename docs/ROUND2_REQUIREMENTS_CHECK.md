# Round 2 MVP — Requirement Traceability

**Project:** BusinessIntelligence.ai — Accenture Innovation Challenge 2026, Round 2 MVP
**Scope of this document:** Phase 4 requirements (role-based access, feedback loop, evidence/lineage completeness, telemetry completeness, LLM/non-LLM boundary, human decision control, demo reliability, traceability, validation).
**Build character:** Local, deterministic Next.js app. No backend, no database, no live APIs, **no live LLM call**. All figures are pre-computed deterministic data. Any LLM/token/cost numbers shown in the UI are explicitly labelled **Simulated / Illustrative**.

## Method legend

| Code | Meaning |
|------|---------|
| **D** | Deterministic — SQL-style aggregation, arithmetic, business-rule / threshold comparison |
| **ML** | Statistical / classical ML — variance analysis, correlation, sentiment classification |
| **R** | Retrieval — pulling unstructured records (feedback, incident reports, market intel) |
| **LLM** | Narrative synthesis + persona adaptation only. **Simulated** in this build — never the source of any quantitative value |

> **LLM boundary (explicit):** the LLM is used only to phrase narratives for a persona. Every number — KPI movement, driver contribution, confidence score, projected impact, telemetry — is produced deterministically or statistically **before** any narrative step. The LLM is **not** the source of quantitative truth. See the System page's Processing Boundary card.

## Scenarios exercised

| Scenario | `ScenarioType` | Confidence | Routing | Demo behavior |
|----------|----------------|-----------:|---------|---------------|
| West Revenue Investigation | `primary` | 78 | `recommend` | Confident, evidence-backed recommendation; approval enabled |
| Conflicting Evidence | `low_confidence` | 34 | `review` | **ABSTAIN** — conflicting/insufficient evidence; clarification requested; approval gated |
| New KPI / Sparse History | `sparse_history` | 15 | `review` | **MONITOR** — insufficient historical baseline; no confident diagnosis; approval gated |

> The routing model supports three states — **RECOMMEND / REVIEW / ESCALATE**. `RECOMMEND` and `REVIEW` are exercised by the three bundled scenarios above. `ESCALATE` is fully implemented in the recommendation card (red "Material risk — escalate to leadership" header + adapted actions) and in the `routing` type; no bundled scenario currently emits it, so it is available in the model but not shown by default.

---

## Requirement → Screen/Component → Scenario → Method

### 1. Role-based access / entitlements
Functional role switching. Same underlying analysis for every role; entitlements only change **visibility** (KPI filtering + supplier-field masking). Lightweight and local — no real auth.

| Where | File | Notes |
|-------|------|-------|
| Global role switcher ("Viewing as" BH / FC / R) | `src/components/navigation/Navigation.tsx` | Sets shared role state; drives every page |
| Entitlement model | `src/lib/permissions/entitlements.ts` | `ROLE_DEFINITIONS`, `canViewKPI`, `allowedKPIIds`, `maskField` (glyph `████████`) |
| Dashboard KPI filtering + hidden-count note | `src/app/dashboard/page.tsx` | `visibleMovements = filter(canViewKPI)`; shows "N KPI(s) hidden for the {role}" |
| Supplier-field masking (live) | `src/app/investigation/page.tsx` (`SupplierDetailCard`) | `maskField(role, …)`; "Restricted for {role}" badge when masked |
| Interactive role preview + live mask demo | `src/app/scenarios/page.tsx` | Clickable role cards wired to shared state; visible-KPI chips + masked supplier preview |

- **Roles:** Business Head (all KPIs, nothing masked) · Finance Controller (revenue / gross margin / ASP) · Restricted User (revenue / units / SLA; supplier name, margin, pricing **masked**).
- **Scenario:** any (masking uses `primary`'s `supplierDetail`). **Method:** D (visibility rules; no analytics changed).

### 2. Feedback loop
Helpful / Not Helpful + optional comment on a recommendation; persisted locally; visibly updates a local history.

| Where | File |
|-------|------|
| Widget (buttons, comment, confirmation, history list, clear) | `src/components/feedback/FeedbackWidget.tsx` |
| Local persistence (localStorage, cross-tab, SSR-safe) | `src/lib/feedback/store.ts` (key `bi.feedback`) |
| Mounted on the recommendation | `src/app/recommendations/page.tsx` |

- **Scenario:** any (feedback target key includes scenario id + driver). **Method:** D (local state only; no backend, no model).

### 3. Evidence + lineage completeness
Every evidence item exposes source, source type, freshness, method, supporting/counter/contextual status; drivers expose contribution + confidence; the full chain is made explicit.

| Where | File |
|-------|------|
| Evidence cards (source, type, freshness, method, **lineage** path, status group) | `src/components/evidence/EvidenceExplorer.tsx` |
| Driver contribution + confidence + method | `src/components/charts/DriverDecomposition.tsx` |
| **Analysis Chain** (KPI → driver → evidence → source → method → confidence) | `src/app/investigation/page.tsx` |
| Confidence with positive/negative factors + disclaimer | `src/components/confidence/ConfidenceMeter.tsx` |
| Underlying evidence/driver data | `src/data/scenarios/primary.ts` |

- Supporting **and** counter-signals **and** contextual/neutral notes are each rendered in their own group (neutral notes are no longer dropped — matters for `sparse_history`).
- **Scenario:** `primary` (rich chain, 9 evidence items, counter-signals) · `sparse_history` (single neutral "data availability" note). **Method:** D + ML + R (per evidence item's stated method).

### 4. Telemetry completeness
System page shows source count, freshness, latency, processing-method counts (D / ML / R / LLM), LLM call count, input/output tokens, estimated cost — all from a **single shared telemetry object**.

| Where | File |
|-------|------|
| Shared telemetry object (single source of truth) | `src/data/scenarios/index.ts` (`runAnalysis().telemetry`) |
| System page (sources, latency, processing boundary) | `src/app/system/page.tsx` |
| LLM usage / token / cost panel | `src/components/telemetry/TelemetryPanel.tsx` |

- Telemetry is read from `analysis.telemetry` on every screen, so numbers never drift between pages.
- LLM/token/cost values carry a **"Simulated / Illustrative"** badge and a footnote that no live LLM call is made. **Method:** D (deterministic telemetry).

### 5. LLM / non-LLM boundary
System page explains the DETERMINISTIC / STATISTICAL-ML / RETRIEVAL / LLM separation and states the LLM is not the source of quantitative truth.

| Where | File |
|-------|------|
| Four-quadrant Processing Boundary (D / ML / R / LLM) + "LLM is NOT the quantitative source of truth" note | `src/app/system/page.tsx` |
| Simulated-LLM labelling | `src/components/telemetry/TelemetryPanel.tsx` |

- **Method:** D (explanatory); demonstrates all four categories with per-scenario counts.

### 6. Human decision control
Explicit RECOMMEND / REVIEW / ESCALATE routing and a human decision gate; user can review/override locally.

| Where | File |
|-------|------|
| Routing header + routing-adaptive actions | `src/components/recommendations/RecommendationCard.tsx` |
| Decision Gate (Defer / Test / Approve) + abstain gating | `src/app/recommendations/page.tsx` |
| Human override (approve against an abstain, logged as a human decision) | `src/app/recommendations/page.tsx` |

- When the system abstains (`review`), **Approve is disabled** unless the user explicitly ticks **Human override**, which is then recorded as a human decision at the shown confidence. Keeps the human in control and the abstain honest.
- **Scenario:** `primary` (approve enabled) · `low_confidence` / `sparse_history` (approve gated behind override). **Method:** D (routing from confidence/evidence thresholds).

### 7. Demo reliability
See the demo runbook below. Persona, role, and scenario are shared state; switching any of them updates every page with no stale values (state adjusted during render on scenario change — no effects, no cascading renders).

| Where | File |
|-------|------|
| Shared scenario / persona / role state | `src/lib/state/app-context.tsx` |
| Per-page reset on scenario change | `src/app/recommendations/page.tsx` (`prevScenario` pattern) |

### 8. Small polish only
No redesign. Fixes limited to demo-hurting issues surfaced during Phase 4:
- Neutral/contextual evidence no longer disappears (own group in `EvidenceExplorer`).
- Evidence card status class reflects real status (was hardcoded).
- Telemetry unified to one object so figures reconcile across pages.
- Scenarios page role preview made interactive + consistent with the global switcher.

### 9. Requirement traceability
This document — `docs/ROUND2_REQUIREMENTS_CHECK.md`.

### 10. Validation
See **Validation performed** at the bottom of the final report. Commands: `npx tsc --noEmit`, `npm run build`.

---

## Demo runbook (Req 7)

1. **Primary journey** — Dashboard (`primary`) → click a KPI → Investigation: read the Analysis Chain, drivers, supporting + counter evidence with lineage → Recommendations: RECOMMEND, approve the action → leave feedback.
2. **Conflicting → abstain / clarify** — switch scenario to **Conflicting Evidence**: confidence 34, REVIEW, ABSTAIN banner, Approve disabled until Human override; "Request Clarification" surfaces the clarification question.
3. **Sparse → MONITOR** — switch scenario to **New KPI / Sparse History**: confidence 15, MONITOR banner, "Continue Monitoring"; Investigation shows the single contextual note (no false drivers).
4. **Persona switching** — toggle Business Head / Finance Controller / Business Analyst on Recommendations or Scenarios: narrative + focus change, numbers do not.
5. **Role switching** — toggle Viewing-as BH / FC / R in the top bar: Dashboard KPIs filter, supplier detail masks (`████████`) with a visible restriction label. Same data, visibility only.

## Route inventory

| Route | File |
|-------|------|
| `/dashboard` | `src/app/dashboard/page.tsx` |
| `/investigation` | `src/app/investigation/page.tsx` |
| `/recommendations` | `src/app/recommendations/page.tsx` |
| `/scenarios` | `src/app/scenarios/page.tsx` |
| `/system` | `src/app/system/page.tsx` |
