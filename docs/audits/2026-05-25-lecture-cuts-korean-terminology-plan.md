# lecture-cuts Korean terminology WARN triage

검토 기준: `lecture-cuts/AGENTS.md`, `lecture-cuts/skills/korean-copy-review/SKILL.md`, `lecture-cuts/slide-spec.json`, `scripts/audit-lecture-cuts-korean-copy.js`.

### 발견

현재 명령 `node scripts/audit-lecture-cuts-korean-copy.js`는 실패 없이 종료하지만 WARN 3종을 보고한다.

- `long visible titles`: 5건
  - P2 `13-3-spec-bad-good.html`: title 35자. `spec`을 learner-facing prose에서 "명세"로 바꾸면 길이와 용어가 함께 정리된다.
  - P2 `08-2-good-claude-md.html`: title 40자. `Deck automation`은 공식 파일명이 아니므로 한국어로 줄이는 편이 좋다.
  - P2 `11-2-skill-frontmatter-fields.html`: title 44자. `Skill` 혼용도 같이 발생하므로 "스킬"로 바꾸는 편이 좋다.
  - P3 `21-final-workflow.html`: title 35자. 첫 섹션/최종 산출물명 성격의 영문 라벨이라 허용 가능하다.
  - P2 `21-10-practice-few-shot-placement.html`: title 36자. `slide-spec.json`은 파일명이므로 유지하되 문장만 압축한다.
- `long subtitles`: 1건
  - P2 `11-1-real-skill-folder.html`: subtitle 75자. `SKILL.md`, `references`, `scripts`, `assets`는 공식 경로/폴더명이므로 유지하되 한국어 설명을 줄인다.
- `mixed Korean/English terms`: 감사 스크립트 출력은 앞 20건만 요약하지만 실제 탐지 대상은 25건이다.
  - P3 `02-3-failure-example-skip-test.html`: `Evaluation/평가`. 발표 스크립트의 `평가(Evaluation)`는 개념 소개로 허용 가능하다.
  - P2 `03-layer-map.html`: `Hook/훅`, `Skill/스킬`, `Evaluation/평가`. 화면은 한국어, 발표는 영어라 같은 개요 슬라이드 안에서 표기가 갈린다.
  - P3 `08-claude-md.html`: `Hook/훅`, `Skill/스킬`. 뒤쪽 개념을 예고하는 발표 스크립트 혼용이며 즉시 화면 수정 대상은 아니다.
  - P2 `09-context-engineering.html`: `Skill/스킬`. bullet의 `Skill reference`는 공식 구조처럼 보이나 발표는 "스킬"로 말한다. `Skill reference`를 정책상 허용하거나 `스킬 reference`로 정리해야 한다.
  - P3 `09-2-always-vs-needed.html`: `Skill/스킬`. 첫 소개형 `스킬(Skill)`이라 허용 가능하다.
  - P2 `10-skills.html`: `Skill/스킬`. 제목과 bullet은 `Skill`, 발표는 `Skill(스킬)`이라 섹션 시작 슬라이드에서 표기 기준을 고정해야 한다.
  - P3 `10-2-skill-body-procedure.html`: `Evaluation/평가`. "평가(Evaluation)" 소개형이므로 허용 가능하다.
  - P2 `11-skill-structure.html`: `Skill/스킬`. 제목은 `Skill`, 발표는 "스킬"이라 learner-facing 제목을 한국어로 맞추는 편이 좋다.
  - P2 `11-1-real-skill-folder.html`: `Skill/스킬`. 제목의 `deck-builder Skill`과 발표의 "deck-builder라는 스킬"이 갈린다.
  - P2 `11-2-skill-frontmatter-fields.html`: `Skill/스킬`. 제목/bullet의 `Skill`과 발표의 "스킬"이 갈리고 title 길이 WARN도 있다.
  - P3 `12-1-superpowers-as-harness.html`: `Skill/스킬`. `Superpowers`와 `Skill`은 공식 제품/개념 라벨 성격이라 허용 가능하다.
  - P2 `14-subagents.html`: `Subagent/서브에이전트`. 제목은 `Subagent`, 발표는 `Subagent, 즉 하위 에이전트`라 한국어 기본 표기를 고정해야 한다.
  - P2 `14-2-reviewer-subagent-example.html`: `Skill/스킬`, `Subagent/서브에이전트`. `Reviewer agent`, `Subagent` 같은 역할명은 유지 가능하지만 발표 스크립트의 "서브에이전트(Subagent)"와 맞춰야 한다.
  - P2 `18-4-practice-agent-tool-split.html`: `Subagent/서브에이전트`. subtitle의 역할 목록은 영문 라벨이지만 발표는 한국어+괄호 병기다. 실습 표기 기준이 필요하다.
  - P2 `17-hook-advanced.html`: `Subagent/서브에이전트`. bullet은 `Subagent review`, 발표는 "서브에이전트(Subagent)"라 같은 슬라이드 안에서 어긋난다.
  - P3 `17-1-hook-start-small.html`: `Evaluation/평가`. 발표 스크립트의 뒷부분 개념 언급으로 보이며 화면에는 `Evaluation`이 없다.
  - P2 `19-evaluation.html`: `Evaluation/평가`. 섹션 대표 슬라이드에서 개념명 표기를 한 번 정해야 한다.
  - P3 `19-3-human-checks.html`: `Evaluation/평가`. 발표 스크립트의 개념 연결부라 허용 가능하다.
  - P3 `20-1-loop-until-pass.html`: `Evaluation/평가`. 발표 스크립트의 보조 개념 언급이라 허용 가능하다.
  - P3 `21-1-final-artifact-structure.html`: `Skill/스킬`. `.claude/skills/`, `SKILL.md`는 공식 경로/파일명이므로 영문 유지가 맞다.
  - P2 `21-4-team-retrospective.html`: `Skill/스킬`. bullet의 회고 규칙에서 `Skill`, `Hook`, `Subagent`가 함께 나오므로 정책에 맞춘 표기 통일이 필요하다.

### 용어 정책

- 공식 파일명, 경로, 폴더명, 제품명, 명령어, 코드 식별자는 영문 유지: `CLAUDE.md`, `SKILL.md`, `slide-spec.json`, `source.md`, `few-shots.md`, `.claude/skills/`, `HTML/CSS`, `MCP Tool`, `Human Review`, `node scripts/audit-lecture-cuts-korean-copy.js`.
- learner-facing prose에서는 한국어 기본 표기를 쓴다: `spec` -> "명세", `handoff` -> "이어받기", `Context` -> "컨텍스트", `Persona` -> "페르소나".
- `Skill`, `Hook`, `Evaluation`, `Subagent`는 공식 개념명으로 남길 수 있지만, 한 슬라이드 안에서는 아래 중 하나를 선택한다.
  - 개념 첫 소개: `Skill(스킬)`, `Hook(훅)`, `Evaluation(평가)`, `Subagent(서브에이전트)`.
  - 설명/발표 prose: "스킬", "훅", "검증/평가", "서브에이전트".
  - literal artifact나 역할 라벨: `Skill reference`, `Subagent review`, `Stop event`, `Command handler`처럼 영문 유지 가능.
- 현재 감사 스크립트는 공식명 허용 맥락을 구분하지 못하므로, P3 항목은 "정책상 허용 WARN"으로 남기고 보고서/후속 owner를 명시하는 방식이 적절하다.

### 권장 수정 문구

- `13-3-spec-bad-good.html`
  - title: `나쁜 명세는 해석을, 좋은 명세는 확인을 남깁니다`
- `08-2-good-claude-md.html`
  - title: `덱 자동화용 CLAUDE.md는 순서를 고정합니다`
- `11-2-skill-frontmatter-fields.html`
  - title: `frontmatter는 deck-builder 스킬 호출 조건입니다`
  - bullet1: `name은 호출 가능한 스킬 식별자입니다.`
- `21-final-workflow.html`
  - title: 유지 허용. 필요 시 `HTML/CSS 덱 자동화 Harness v1`
  - subtitle: `Claude에게 자료를 주면 source brief부터 이어받기까지 반복 가능한 발표자료 제작 흐름으로 통과시킵니다.`
- `21-10-practice-few-shot-placement.html`
  - title: `Few-shot은 slide-spec.json 다음에 둡니다`
  - subtitle: `명세가 “무엇”을 고정한다면, few-shot은 “답변 모양”을 고정합니다.`
- `11-1-real-skill-folder.html`
  - title: `deck-builder 스킬은 폴더가 곧 작업 순서입니다`
  - subtitle: `HTML/CSS deck 절차는 SKILL.md, references, scripts, assets로 나누면 재사용하기 쉽습니다.`
- `03-layer-map.html`
  - speaker term pass: `Skill은` -> `스킬은`, `Agent와 Tool은` -> `에이전트와 도구는`, `Hook과 Evaluation은` -> `훅과 검증은`.
- `09-context-engineering.html`
  - bullet2: `가끔 필요한 지식은 스킬 reference로 둡니다.` 또는 정책상 `Skill reference`를 literal label로 허용.
- `10-skills.html`
  - title: `스킬은 반복 절차의 매뉴얼입니다`
  - bullet3: `검교정처럼 반복되는 리뷰도 스킬로 분리합니다.`
  - first mention in speaker: `Skill(스킬)` 유지, 이후 `Skill은` -> `스킬은`.
- `11-skill-structure.html`
  - title: `좋은 스킬은 작고 선명합니다`
- `12-1-superpowers-as-harness.html`
  - title: 유지 허용. 필요 시 `Superpowers는 스킬 묶음이 아니라 작업 규율입니다`
- `14-subagents.html`
  - title: `서브에이전트는 역할과 컨텍스트를 분리합니다`
  - speaker first mention: `Subagent, 즉 하위 에이전트` -> `Subagent(서브에이전트)입니다`
- `14-2-reviewer-subagent-example.html`
  - title: `리뷰어 에이전트는 기준 하나만 봅니다`
  - speaker term pass: `서브에이전트(Subagent)` 유지, 이후 `에이전트` 또는 `서브에이전트`로 통일.
- `18-4-practice-agent-tool-split.html`
  - subtitle: `하나의 자동화 업무를 Main, Subagent, MCP Tool, Human Review로 나눕니다.` 유지 허용. 필요 시 `하나의 자동화 업무를 메인, 서브에이전트, MCP Tool, Human Review로 나눕니다.`
- `17-hook-advanced.html`
  - bullet3: `Subagent review: 복잡한 검토는 별도 컨텍스트로 분리합니다.` 유지 허용. 필요 시 `서브에이전트 리뷰: 복잡한 검토는 별도 컨텍스트로 분리합니다.`
- `19-evaluation.html`
  - speaker first mention: `Evaluation` 첫 출현을 `Evaluation(평가)`로 두고 이후 `검증` 또는 `평가` 중 하나로 통일.
- `21-4-team-retrospective.html`
  - bullets: `두 번 반복한 절차는 스킬로`, `두 번 놓친 검증은 훅으로`, `두 번 필요한 판단은 서브에이전트로`.

### 수정 우선순위

- P1: 없음. 현재 WARN은 감사 스크립트 기준의 품질 경고이며, 실행 실패나 명백한 의미 오류는 확인되지 않았다.
- P2: 실제 수정 권장.
  - 길이/용어가 동시에 걸린 `11-2-skill-frontmatter-fields.html`, `11-1-real-skill-folder.html`, `10-skills.html`, `14-subagents.html`을 먼저 정리한다.
  - 그다음 섹션 대표 슬라이드인 `03-layer-map.html`, `19-evaluation.html`, 회고 규칙 슬라이드인 `21-4-team-retrospective.html`을 정리한다.
  - title/subtitle만 긴 `13-3-spec-bad-good.html`, `08-2-good-claude-md.html`, `21-10-practice-few-shot-placement.html`은 레이아웃 확인과 함께 수정한다.
- P3: 정책상 허용 또는 낮은 우선순위.
  - `02-3-failure-example-skip-test.html`, `08-claude-md.html`, `09-2-always-vs-needed.html`, `10-2-skill-body-procedure.html`, `12-1-superpowers-as-harness.html`, `17-1-hook-start-small.html`, `19-3-human-checks.html`, `20-1-loop-until-pass.html`, `21-1-final-artifact-structure.html`.
  - `21-final-workflow.html` title은 artifact label로 허용 가능하나, subtitle의 `handoff`는 "이어받기"로 바꾸면 용어 정책과 더 잘 맞는다.

### 검증 명령

이번 작업에서는 보고서만 작성했고 슬라이드/JS는 수정하지 않았다. 현재 확인한 명령:

```sh
node scripts/audit-lecture-cuts-korean-copy.js
```

후속 슬라이드/대본 수정 후에는 `lecture-cuts/AGENTS.md` 기준으로 아래를 실행한다.

```sh
node scripts/export-lecture-cuts-contract.js
node scripts/export-lecture-cuts-contract.js --check-confidence
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts.js
node scripts/audit-lecture-cuts-korean-copy.js
node scripts/audit-lecture-cuts-speaker-sync.js
node scripts/verify-lecture-cuts-harness.js
```

### 미해결

- 감사 스크립트가 공식 파일명/역할 라벨과 learner-facing prose를 구분하지 못해 `Skill/스킬`, `Hook/훅`, `Evaluation/평가`, `Subagent/서브에이전트`를 모두 같은 WARN으로 묶는다. 정책상 허용 목록을 스크립트에 반영할지, 보고서에서만 triage할지 결정이 필요하다.
- `Skill`, `Hook`, `Evaluation`, `Subagent`를 섹션 제목에서는 영문으로 유지할지, 화면 제목은 한국어로 바꾸고 첫 언급만 괄호 병기할지 최종 스타일 결정이 필요하다.
- 후속 실제 수정 시에는 visible copy와 `lecture-cuts/assets/slides.js` 발표 스크립트를 같은 변경에서 맞춰야 하며, `slide-spec.json` 재생성도 필요하다.
