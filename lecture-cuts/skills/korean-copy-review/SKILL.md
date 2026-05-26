---
name: korean-copy-review
description: Use when reviewing or rewriting Korean slide copy, presenter scripts, and slide-script alignment for the lecture-cuts workshop deck.
---

# Lecture Cuts Korean Copy Review

## When to Use

Use this skill when a task changes or reviews Korean visible slide text, presenter scripts, terminology, section flow, or slide/script alignment in `lecture-cuts/`.

## Inputs

- `lecture-cuts/*.html`
- `lecture-cuts/assets/slides.js`
- `lecture-cuts/slide-spec.json`
- `docs/audits/2026-05-25-lecture-cuts-korean-copy-review.md`
- `scripts/audit-lecture-cuts-korean-copy.js`
- `scripts/audit-lecture-cuts-speaker-sync.js`

## Procedure

1. Read the target slide HTML and its matching entry in `lecture-cuts/assets/slides.js`.
2. Classify the change as visible copy, presenter script, terminology, or alignment.
3. Keep visible copy and presenter script synchronized in the same change.
4. Prefer Korean explanations for learner-facing text while preserving official product names, file names, commands, and code identifiers.
5. Remove generated-script phrasing such as "발표자는", "대본은", and "화면에서는 ...를 먼저 짚습니다" when the text should be spoken to learners.
6. If a slide shows concrete files, commands, bullets, or code examples, make the presenter script mention the same concrete objects.
7. Run the Korean copy audit and speaker sync audit before handoff.

## Terminology Defaults

- For official terms that learners must recognize in product docs, use Korean-first bilingual form on first teaching use, then Korean form in nearby prose: `스킬(Skill)`, `훅(Hook)`, `서브에이전트(Subagent)`, `검증/평가(Evaluation)`.
- Preserve literal artifact names, commands, paths, code identifiers, and product labels exactly: `SKILL.md`, `.claude/skills/`, `slide-spec.json`, `Stop event`, `MCP Tool`.
- `Context`: use "컨텍스트" in learner-facing Korean copy.
- `Persona`: use "페르소나" in learner-facing Korean copy.
- `Skill`: use "스킬" after the first bilingual introduction.
- `Hook`: use "훅" after the first bilingual introduction.
- `Subagent`: use "서브에이전트" after the first bilingual introduction.
- `Evaluation`: use "검증" or "평가" after the first bilingual introduction.
- `MCP`: keep `MCP` in visible labels; explain once as "모델 컨텍스트 프로토콜(Model Context Protocol)" in script.
- `spec`: use "명세" in prose; keep `slide-spec.json` as a file name.
- `handoff`: use `HANDOFF.md` for the file and "이어받기" for the concept.

## Agent Harness

For review work, split findings into three axes:

1. Screen copy reviewer: visible titles, subtitles, bullets, notes, terminology, line length.
2. Presenter script reviewer: spoken Korean, repeated templates, long sentences, learner-facing tone.
3. Slide-script alignment reviewer: whether the script explains the slide's concrete bullets, examples, files, and practice values.

Each reviewer reports with:

```text
### 발견
### 수행
### 판단
### 미해결
```

## Verification

Run from the repository root:

```sh
node scripts/audit-lecture-cuts-korean-copy.js
node scripts/audit-lecture-cuts-speaker-sync.js
node scripts/verify-lecture-cuts-harness.js
```

PASS requires all commands to exit 0. WARN output is allowed only when the final report names the owner and follow-up.

## Stop Conditions

- A visible slide change is made without checking the matching presenter script.
- A presenter script adds a teaching point that is not supported by visible slide text, `div.note`, or source metadata.
- A terminology change makes the same concept appear under conflicting Korean and English names in the same local section.
- A verification command exits non-zero.
