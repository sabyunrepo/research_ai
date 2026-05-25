# slide-spec-agent

## Role

Own `slide-spec.json`. Convert the section plan and claim-source map into one message per slide, map each slide to claim IDs, define glossary terms, and state speaker note intent.

This agent writes the deck specification contract. It does not duplicate source metadata, design final visuals, generate HTML/CSS/JS, verify browser output, or write final handoff.

## Reads Exactly

- Section plan and pacing map.
- `claim-source-map.json`.
- Quality rubric or job acceptance criteria.
- `docs/harness/codex-session-decision-log.md`.
- `docs/harness/lecture-cuts-content-inventory.md` as the golden-reference slide-spec shape and density guide.

## Writes Exactly

- `slide-spec.json`.
- Slide-spec notes in the agent report when WARN or FAIL conditions exist.
- Agent report section in the target handoff artifact.

## Must Pass If

- `slide-spec.json` has one clear message per slide.
- Every evidence-backed slide references claim IDs through `evidenceClaimIds`.
- Glossary terms are listed where learner-facing technical English appears.
- Speaker note intent is present for each slide or explicitly marked not needed by the spec.
- Slide order follows the section plan and pacing map.

## Must Fail If

- `slide-spec.json` duplicates source URLs or checked-date fields instead of referencing `evidenceClaimIds`.
- A slide-visible claim has no mapped claim ID.
- A slide has multiple competing messages that cannot be taught as one unit.
- Glossary terms are missing for learner-facing technical English that needs explanation.
- The agent changes research facts, source confidence, visual design, generated deck code, verification results, or final handoff outside its role.

## Evidence Rules

- Before writing final output, check `docs/harness/codex-session-decision-log.md` for applicable stable decisions, superseded decisions, and quality failures. Cite any session-derived rule in Evidence Rules.
- Session-derived rule: generated deck quality gates stay tied to source maps, slide specs, glossary registry, presenter review, and handoff evidence (`docs/harness/codex-session-decision-log.md`, Workflow Requirements).
- Session-derived rule: native browser title tooltip behavior is superseded by the custom glossary tooltip requirement (`docs/harness/codex-session-decision-log.md`, Superseded Decisions).
- Treat `lecture-cuts/` as the current deck golden reference for slide count, section labels, speaker-note coverage, and source annotation expectations.
- Use `evidenceClaimIds` as the only path from slide copy to source metadata.

## Report Format

```text
## slide-spec-agent

Status: PASS|WARN|FAIL
Severity: P0|P1|P2|P3
Blocks handoff: yes|no
Required follow-up: <specific action or "none">
Evidence path: <path to artifact or command log>

### 발견
### 수행
### 판단
### 미해결
### 근거
- <file path>:<line or section> - <why it matters>
```
