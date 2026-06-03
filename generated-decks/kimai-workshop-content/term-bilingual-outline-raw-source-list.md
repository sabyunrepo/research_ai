# KimAI term bilingual outline raw source list

Checked date: 2026-06-03

| source id | path | role | notes |
|---|---|---|---|
| S1 | `docs/harness/kimai-content/AGENTS.md` | KimAI content source rules | Act source docs, metaphor dictionary, and generated deck inputs are the source of truth. |
| S2 | `deck-harness/AGENTS.md` | generated deck workflow rules | Fix source/spec/template/asset layers, then rebuild and validate. |
| S3 | `generated-decks/kimai-workshop-content/slide-spec.json` | slide source spec | Current outline, Act opener titles, slide 9 journey map, glossaryTerms, and visualAssetId mapping. |
| S4 | `generated-decks/kimai-workshop-content/section-plan.json` | section ordering | Act section labels and first slide IDs. |
| S5 | `generated-decks/kimai-workshop-content/glossary.json` | glossary registry | Current term entries and tooltip text. |
| S6 | `generated-decks/kimai-workshop-content/asset-pack.json` | visual asset contract | Existing `kimai-workflow-map` prompt and KimAI character constraints. |
| S7 | `generated-decks/kimai-workshop-content/assets/glossary-tooltips.js` | tooltip runtime | Runtime wraps glossary terms by exact/word matching only. |
| S8 | `generated-decks/kimai-workshop-content/review-screenshots/deck-1366x768-slide9.png` | render evidence | Current slide 9 image labels are short labels: 자료, 지시, 내규, 매뉴얼, 역할, 검증. |
