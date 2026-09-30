# ReportAPI release and launch drafts

Status: unreleased candidate. Do not publish until the PR is merged through the repository flow, deployment is verified, product claims in issue #16 are corrected, and destination rules/existing posts are checked. No production/release/community URL has been verified in this run.

## GitHub release notes draft

Title: Report request validation hardening

ReportAPI now returns a controlled JSON HTTP 400 for malformed or empty JSON and for null, array, primitive, missing or invalid `data` request bodies. Invalid requests stop before authentication, quota reservations or hosted model calls. The 20,000-character input limit remains unchanged.

Added 27 route regression tests covering the invalid inputs and existing anonymous, session, API-key, quota and model-failure flows. Source: [ReportAPI](https://github.com/utkarshmankad/ReportAPI). Sprint: [#15](https://github.com/utkarshmankad/ReportAPI/issues/15). Related follow-up gaps: [docs #16](https://github.com/utkarshmankad/ReportAPI/issues/16), [persistence #17](https://github.com/utkarshmankad/ReportAPI/issues/17), [webhook latency #18](https://github.com/utkarshmankad/ReportAPI/issues/18).

Current report generation sends submitted data to hosted Groq, using Llama 3.3 70B. Self-hosted model inference is not implemented in this repository.

## Hacker News draft for a future verified product launch

Title: Show HN: ReportAPI – Generate short narrative reports from CSV or JSON

URL: https://github.com/utkarshmankad/ReportAPI

I built ReportAPI to turn CSV or JSON text into a short narrative covering trends, outliers and an actionable recommendation. The current Next.js app uses hosted Groq with Llama 3.3 70B; submitted data is sent to that provider. It has a browser demo, account/API-key flows, plan quotas, stored reports and HMAC-signed completion/failure webhooks.

I have been tightening the API behavior: malformed JSON now produces a controlled 400 without reserving quota or calling the model, backed by route regression tests. I would welcome feedback on the request/response contract and whether narrative summaries fit a reporting workflow you already use.

Code: https://github.com/utkarshmankad/ReportAPI
Validation work: https://github.com/utkarshmankad/ReportAPI/issues/15

Do not post a new Show HN solely for this maintenance fix. Use this product-launch draft only after confirming the app can be tried, earlier submissions do not duplicate it, and current Show HN rules permit it; otherwise choose a relevant permitted destination or retain the draft.
