# Lecture Cuts Few-Shots

Use these examples to keep `lecture-cuts/` contract edits, source mapping, handoff sections, and final reports consistent across workers.

## Good Slide-Spec Item

This is good because it has one message, projector-visible text, speaker separation, source provenance, extraction confidence, and a content hash tied to the actual slide file.

```json
{
  "index": 31,
  "id": "07-1-reasoning-output-pattern",
  "file": "07-1-reasoning-output-pattern.html",
  "sourceFile": "lecture-cuts/07-1-reasoning-output-pattern.html",
  "section": {
    "id": "02",
    "title": "Spec / Prompt",
    "index": 16,
    "total": 17,
    "isStart": false
  },
  "title": "결과 기준을 선명하게 요구합니다",
  "subtitle": "무엇을 만들고, 무엇으로 확인하고, 어떻게 보고할지를 정해 줍니다.",
  "bullets": [
    "최종 결과물의 모양을 먼저 정합니다.",
    "중간 확인 지점과 통과 기준을 적습니다.",
    "마지막 보고에 증거와 남은 위험을 포함시킵니다."
  ],
  "note": {
    "present": true,
    "text": "발표 포인트 생각 과정을 길게 요구하기보다 결과물, 확인 방법, 보고 기준을 선명하게 줍니다."
  },
  "speakerSource": "inline",
  "sources": [
    {
      "label": "Claude Code Hooks",
      "url": "https://docs.anthropic.com/en/docs/claude-code/hooks",
      "sourceScope": "deck-global"
    }
  ],
  "contentHash": "sha256:1b8490ed3bf401d020d4c58795bbd724f7445c692af68b0e347014d42091257a",
  "fieldSources": {
    "title": "lecture-cuts/07-1-reasoning-output-pattern.html:<h2>",
    "bullets": "lecture-cuts/07-1-reasoning-output-pattern.html:<ul.bullets>",
    "speaker": "lecture-cuts/assets/slides.js:speaker",
    "sources": "lecture-cuts/sources.html:deck-global",
    "contentHash": "lecture-cuts/07-1-reasoning-output-pattern.html"
  },
  "fieldConfidence": {
    "title": "high",
    "bullets": "high",
    "speaker": "high",
    "sources": "medium",
    "contentHash": "high"
  }
}
```

## Bad Slide-Spec Item

This is bad because it hides the file path, has no speaker source, embeds source details without provenance, omits `contentHash`, and leaves the claim impossible to verify.

```json
{
  "id": "hooks-are-safe",
  "title": "Hooks are always safe",
  "bullets": [
    "Hooks prevent every bad action.",
    "No need to run audit if hooks exist."
  ],
  "speakerNote": "",
  "sourceUrl": "some docs",
  "checkedDate": "",
  "confidence": "high"
}
```

Fix by mapping the slide to the existing `lecture-cuts/slide-spec.json` shape, adding a real `sourceFile`, `speakerSource`, field provenance, content hash, and source evidence in `docs/harness/lecture-cuts-source-map.json`.

## Good Source Map Entry

This is good because it records the slide id, exact slide file, official source URL, source scope, speaker source, field provenance, and contract hash in one evidence map entry.

```json
{
  "id": "16-2-hook-command",
  "file": "16-2-hook-command.html",
  "sourceFile": "lecture-cuts/16-2-hook-command.html",
  "section": {
    "id": "06",
    "title": "Hooks / Verification"
  },
  "title": "Hook의 command는 실제 실행되는 검문소입니다",
  "speakerSource": "inline",
  "speakerSourceFile": "lecture-cuts/assets/slides.js",
  "sources": [
    {
      "label": "Claude Code Hooks",
      "url": "https://docs.anthropic.com/en/docs/claude-code/hooks",
      "sourceScope": "slide"
    }
  ],
  "contentHash": "sha256:918cbe148faf...",
  "fieldSources": {
    "title": "lecture-cuts/16-2-hook-command.html:<h2>",
    "speaker": "lecture-cuts/assets/slides.js:speaker",
    "sources": "lecture-cuts/sources.html:slide",
    "contentHash": "lecture-cuts/16-2-hook-command.html"
  },
  "fieldConfidence": {
    "title": "high",
    "speaker": "high",
    "sources": "high",
    "contentHash": "high"
  }
}
```

## Good Agent Handoff Section

```md
## source-grounding-agent

Status: WARN
Severity: P2
Blocks handoff: no
Required follow-up: Promote slide-specific evidence for any new Claude Code API behavior before the next public export.
Evidence path: docs/harness/lecture-cuts-source-map.json

### 발견
`lecture-cuts/` has 87 slides and most slides currently inherit deck-global source references.

### 수행
Checked changed slide ids against `lecture-cuts/slide-spec.json` and `docs/harness/lecture-cuts-source-map.json`.

### 판단
The current deck is reproducible, but new technical claims must not rely on deck-global evidence only.

### 미해결
No blocking item for this task. Source-specific coverage should be tightened in the next source pass.

### 근거
- docs/harness/lecture-cuts-source-map.json - slide and source registry
- docs/harness/codex-session-decision-log.md - official-source preference and reproducible workflow requirement
```

## Good Final Report

```md
### 발견
Task 4 target files did not exist yet, and the current golden reference contract records 87 `lecture-cuts` slides.

### 수행
Created four local skill files under `lecture-cuts/skills/` and added `lecture-cuts/few-shots.md`. Verified required frontmatter, headings, and mandatory command references with `rg`.

### 판단
The local skills now encode the deck-builder, source-grounding, verification-gate, and handoff-maintainer boundaries from the Task 4 plan without changing slide content.

### 미해결
No blocking item for Task 4. Full harness verification still depends on later tasks that create `lecture-cuts/HANDOFF.md` and `docs/harness/lecture-cuts-agent-handoff.md`.
```
