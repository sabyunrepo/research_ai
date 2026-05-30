# Topic-To-Deck Workflow

01 Topic Intake
02 Research Dossier
03 Claim / Source Map
04 Audience + Workshop Goal
05 Storyline / Section Plan
06 Slide Spec
07 Structure Validation
08 Speaker Script
09 Visual System + Asset Plan
10 Visual Asset Generation + Review
11 Projector Validation
12 HTML/CSS Deck Build
13 Presenter Review
14 Verification Gates
15 Handoff + Next Prompt

## Source-Of-Truth Chain

```text
topic-intake.md
  -> research-dossier.md
  -> claim-source-map.json
  -> section-plan.json
  -> asset-pack.json
  -> asset-generation-prompts.md
  -> slide-spec.json
  -> asset-build-report.md
  -> generated HTML/CSS/JS deck
  -> presenter-review.html
  -> HANDOFF.md
```

## Blocking Rule

The workflow must not start slide HTML until research-dossier.md, claim-source-map.json, section-plan.json, glossary.json, job-manifest.json, and slide-spec.json exist.

The workflow must run structure validation before visual asset generation:

```sh
node deck-harness/scripts/validate-deck-contract.js --stage=structure generated-decks/<slug>
```

This stage may emit WARN lines for `planned` visual assets. Those warnings mean the lecture source, section plan, glossary, and slide contract can continue through content review, but projector build is still blocked.

After source images are generated or mapped, the workflow must materialize the asset pack before projector validation:

```sh
node deck-harness/scripts/prepare-asset-generation-prompts.js generated-decks/<slug>
```

This stage reads `디자인.md` and writes `asset-generation-prompts.md`. Image generation agents must use this queue instead of ad hoc prompts.

```sh
node deck-harness/scripts/build-asset-pack.js generated-decks/<slug>
```

This stage writes `asset-build-report.md`, creates crop-region files under `assets/visuals/`, and exits non-zero while any projector-referenced image or crop source is pending. Planned assets that no slide currently references are reported as pending unused items.

Immediately verify that crop-region files were cut from the intended source sheet cells:

```sh
node deck-harness/scripts/verify-asset-crops.js generated-decks/<slug>
```

This writes `asset-crop-review.json` and blocks stale or mismatched crop coordinates, sheet layouts, cell indexes, dimensions, and source/crop hashes.

For independent reviewer work, use the read-only variant:

```sh
node deck-harness/scripts/build-asset-pack.js --check generated-decks/<slug>
```

After any generated image, crop, split file, or `semanticRequirements` change, refresh `asset-review.json` for every affected projector-referenced asset. The review must record the current `sourcePath`, asset file SHA-256, and `semanticRequirements` SHA-256; stale review hashes are a quality-gate failure.

The workflow must not start projector HTML build until the default projector validation passes:

```sh
node deck-harness/scripts/validate-deck-contract.js generated-decks/<slug>
```

## Stage Contracts

- Topic Intake fixes topic, audience, timebox, must-cover items, must-avoid items, source preferences, visual preference, and success criteria.
- Research Dossier collects official sources, supporting sources, usable claims, claims to avoid, date-sensitive notes, examples, and analogies.
- Claim / Source Map is the only place for source URL, source type, checked date, use location, confidence, and source notes.
- Audience + Workshop Goal records beginner-facing assumptions and the declared timebox.
- Storyline / Section Plan owns learning objectives, pacing, practice placement, and slide ids per section.
- Slide Spec owns slide titles, messages, bullets, visual intent, speaker notes, evidence claim ids, glossary terms, and slide-level checks.
- Structure Validation proves source, section, glossary, slide, manifest, and asset-contract consistency before generated images exist. It does not claim projector readiness.
- Speaker Script expands presenter notes without adding unsupported claims.
- Visual System + Asset Plan defines layout, typography, color, motion, concrete artifacts, and accessibility expectations.
- Visual Asset Generation + Review materializes referenced assets, writes `asset-build-report.md`, verifies crop-region files in `asset-crop-review.json`, and records semantic review evidence with current asset and semantic-contract hashes.
- Projector Validation proves referenced assets are no longer planned and can be rendered.
- HTML/CSS Deck Build renders from the slide spec and visual plan without editing source evidence.
- Presenter Review separates screen text from speaker script and exposes evidence ids for review.
- Browser Render Evidence captures representative desktop, projector, and mobile screenshots after the latest deck build:

```sh
node deck-harness/scripts/run-browser-render-check.js generated-decks/<slug> --url=http://127.0.0.1:<port>/deck.html
```

- Verification Gates check schemas, source resolution, glossary resolution, render parity, links/assets, crop-region evidence, browser fit, screenshot evidence, design contract, layout variety, glossary depth, overflow, and handoff completeness.
- Kimai polished review can use `--all-slides` to capture every projector slide at desktop size plus required projector/mobile evidence.
- Handoff + Next Prompt records current state, verification evidence, blocking risk, non-blocking risk, and the next copy-ready prompt.
