# ReportAPI workstream

Updated 2026-10-01 IST. One bounded increment per run.

## Inspected baseline

- Default branch: `main`, commit `67a6db83b3420c9a5ac029b526366bd2db0c922c`.
- No repository `AGENTS.md`/`CLAUDE.md`, open issues or open PRs at inspection.
- Latest main CI [30902981078](https://github.com/utkarshmankad/ReportAPI/actions/runs/30902981078): success. Workflow uses Node 24, npm ci, typecheck, coverage tests and build.
- No GitHub releases. GitHub connector rejects the deployments collection, so deployment history could not be verified. No available connector creates GitHub releases or operates the existing deployment.
- `main` is protected and requires `build-and-test`; full branch protection read returns 403, so reviewer settings remain unverified. Empty rulesets do not mean unprotected.
- Observed history: feature/fix work on `develop`, then PR from `develop` to `main`. The existing `fix/report-request-validation` branch had no changes relative to `develop`; it is reused for this increment, targeting `develop`.
- Implemented engine is hosted Groq `llama-3.3-70b-versatile` in Next.js `/api/report/generate`. This repo does **not** implement a self-hosted LLM provider. Supabase handles session/API-key identity, quota reservations, report persistence and webhook configuration. Stripe billing and signed SSRF-protected webhooks exist.

## Prioritized roadmap

| Order | Issue | Evidence and next increment |
| --- | --- | --- |
| 1 | [#15 Request validation](https://github.com/utkarshmankad/ReportAPI/issues/15) | Malformed JSON and null throw before validation; current sprint below. |
| 2 | [#16 Accurate product docs](https://github.com/utkarshmankad/ReportAPI/issues/16) | Boilerplate README, unverified `/v1` URL and unimplemented privacy/trace claims. Audit claims and document actual hosted provider. |
| 3 | [#17 Persistence integrity](https://github.com/utkarshmankad/ReportAPI/issues/17) | Completion update errors ignored before success response/webhook. Define durable failure contract and test it. |
| 4 | [#18 Webhook latency](https://github.com/utkarshmankad/ReportAPI/issues/18) | Generation awaits best-effort network delivery. Verify runtime before selecting supported execution mechanism. |

## Current sprint: controlled report request errors

Branch: `fix/report-request-validation`. PR: linked from issue #15 and the pull request description after creation.

- [x] Malformed or empty JSON returns JSON 400.
- [x] Null, arrays, primitives and invalid/blank `data` return JSON 400.
- [x] Over 20,000 characters returns 413; exactly 20,000 remains accepted.
- [x] Invalid input never touches auth, quota, model or webhook dependencies.
- [x] 27 route tests retain anonymous/session/API-key flow, key rejection, quota exhaustion, persistence calls and model failure behavior.
- [x] Baseline regression reproduction: 4 failures on original route; 27/27 after change.
- [x] Full coverage suite: 198/198 tests across 19 suites, 97.78% lines and 90.52% branches (existing coverage scope).
- [x] Typecheck, lint and shell script tests (15/15).
- [ ] Production build and GitHub CI, recorded in PR progress.
- [ ] Full repository review rules verified; required reviews/CI satisfied.
- [ ] Merge through develop then protected main.
- [ ] Authorized release/deployment and live verification.
- [ ] Release notes and permitted, non-duplicative community publication with verified URL.

No schema, RLS, authentication, quota or provider behavior was changed. Route regressions mock services; they are not live database/model verification.

## Next action / blockers

Finish CI and review the focused draft PR. Verify complete protection/review settings before any merge; restore an authorized existing deployment/release path before release. Then verify invalid requests and a real report on that environment. The next new increment is issue #16. Announcement drafts are in [LAUNCH_DRAFT.md](LAUNCH_DRAFT.md); no publication is claimed.
