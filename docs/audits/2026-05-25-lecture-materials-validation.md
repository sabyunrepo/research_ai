# 2026-05-25 Lecture Materials Validation

## Scope

- Main lecture deck: `lecture-cuts/` (`87` registered slides)
- Sample automation harness deck: `lecture-deck/` (`2` registered slides)
- Machine audit harness added: `scripts/audit-lecture-cuts.js`
- Raw audit output: `docs/audits/2026-05-25-lecture-cuts-audit-output.txt`

## 발견

### 1. `lecture-cuts`는 4시간 워크숍으로는 성립하지만, 짧은 발표용으로는 과하다.

`lecture-cuts/index.html`은 4시간 deck이라고 설명하고, 실제 `lecture-cuts/assets/slides.js`에는 87장이 등록되어 있다. 큰 흐름은 `Prompt -> Context -> Skill -> Agent/Tool -> Hook -> Evaluation -> Loop`로 이어져 교육적으로 자연스럽다.

다만 20~30분 발표로 쓰면 정보량이 과하다. 특히 `13-*`, `04-*`, `05-*`, `06-*`, `07-*`가 이어지는 Spec/Prompt 구간은 초보자에게 한 번에 너무 많은 개념을 준다.

### 2. 공식 문서와 다르게 보이는 슬라이드가 있다.

- `lecture-cuts/16-2-hook-command.html`: Claude Code hook 예시가 실제 schema와 다르다. 공식 문서의 hook command는 `hooks: [{ type: "command", command: "..." }]` 구조 안에 들어간다.
- `lecture-cuts/17-hook-advanced.html`: "Prompt Hook", "Agent Hook"이 공식 이벤트명처럼 보일 수 있다. 실제로는 hook event와 handler/실행 방식의 조합으로 설명하는 편이 안전하다.
- `lecture-cuts/18-1-mcp-bridge.html`: MCP를 `Model -> MCP Server -> Tool Call`로 단순화한다. 입문용으로는 괜찮지만, 실제 구조는 host/client/server 관계이며 MCP에는 tools 외에 resources, prompts도 있다.
- `lecture-cuts/10-*`, `11-*`, `21-1-final-artifact-structure.html`: 강의용 `skills/deck-builder/SKILL.md`와 Claude Code 공식 skill discovery 경로(`.claude/skills/<name>/SKILL.md`)가 섞여 보일 수 있다.

### 3. 브라우저/구조 검증은 통과했지만 경고가 있다.

`scripts/audit-lecture-cuts.js` 결과:

- PASS: slide registry 87개, 등록 파일 87개 존재, `.slide` markup 존재, broken local links/assets 0개
- PASS: desktop/mobile deck render 87 frames loaded
- PASS: deck 내 `.note` 노출 0개
- PASS: visible slide images loaded
- PASS: presenter review scripts 87개 resolve
- WARN: standalone HTML `Prev/Next` 링크가 `assets/slides.js` 순서와 맞지 않는 곳 다수
- WARN: 일부 제목/visual/pre에서 desktop/mobile overflow 가능성
- WARN: 21개 섹션 시작 슬라이드는 inline `speaker`가 없고 `presenter-preview.html` fallback에 의존

추가 visual review에서 1280x720 발표 환경의 하단 잘림 가능성이 확인됐다. 대표적으로 `#slide-77`은 headless Chrome 기준 frame bottom이 `774px`이고 viewport height가 `720px`이라 약 `54px`이 화면 밖으로 나갔다. 1440x900에서는 안전했다. 원인은 toolbar 높이와 `.deck-stage height: calc(100vh - 112px)` 계산이 실제 렌더링 높이와 딱 맞지 않는 점이다.

모바일/좁은 폭에서는 "접근 가능"과 "발표 가능"을 구분해야 한다. 500x757 기준 일부 슬라이드 body가 900~1450px까지 늘어나며, CSS visual이 `transform: scale(.60)`로 줄어 읽기보다 모양 확인 수준이 된다.

### 4. `lecture-deck`은 샘플 하네스로는 잘 동작하지만 강의 본편은 아니다.

`lecture-deck/scripts/run-hook.js pre-handoff`는 통과했다.

결과:

```text
PASS missing files
PASS slide count - 2 slides
PASS slide spec shape
PASS broken links
PASS desktop overflow
PASS mobile overflow
PASS deck note exposure
PASS presenter script
```

하지만 `lecture-deck/source.md`의 30분 timebox와 달리 현재 `slide-spec.json`은 2장뿐이라, 실제 강의 자료라기보다 샘플 harness starter다. 또한 `00-title`은 source/spec의 6단계와 화면의 6단계가 다르다. 화면에는 `Few-shot`이 들어가고 `Verify + Handoff`가 합쳐져 있다.

## 수행

- 기존 프로젝트 규칙 확인: `lecture-deck/AGENTS.md`, `lecture-deck/skills/deck-builder/SKILL.md`, `lecture-deck/evaluation-template.md`
- 기존 역할 기준 확인: `lecture-deck/agents/researcher.md`, `slide-reviewer.md`, `visual-reviewer.md`
- 병렬 검증 에이전트 실행:
  - 근거/사실성 reviewer
  - 흐름/교육 설계 reviewer
  - 시각/렌더링 reviewer
- 로컬 검증 실행:
  - `node scripts/run-hook.js pre-handoff` in `lecture-deck/`
  - `node scripts/audit-lecture-cuts.js` in repo root
- 브라우저 확인:
  - `http://127.0.0.1:8766/deck.html#slide-1`
  - 87 frames loaded, active slide rendered, deck error 없음
- 외부 근거 대조:
  - [reveal.js](https://revealjs.com/)는 HTML presentation framework이며 speaker notes, PDF export 등을 제공한다.
  - [Slidev](https://sli.dev/)는 developer-focused slide tool이며 Markdown, code highlighting, live coding, export workflows를 제공한다.
  - [Marp](https://marp.app/)는 Markdown 기반으로 HTML/PDF/PowerPoint export를 제공한다.
  - [Claude Code hooks docs](https://docs.anthropic.com/en/docs/claude-code/hooks), [subagents docs](https://docs.anthropic.com/en/docs/claude-code/sub-agents), [MCP tools spec](https://modelcontextprotocol.io/specification/draft/server/tools)을 기준으로 공식 용어를 대조했다.

## 판단

### 자료의 근거성

큰 주장은 타당하다. "프롬프트만으로 품질을 보장하지 말고, context, skill, subagent, hook, MCP/tool, evaluation, loop를 묶어 harness로 만든다"는 방향은 현재 AI coding workflow와 맞다.

다만 몇 개 슬라이드는 입문자용 단순화가 공식 구조를 가릴 수 있다. 특히 Hook schema, MCP 구조, Skill 경로는 수강생이 복사하거나 프로젝트에 적용할 가능성이 높으므로 정확도를 우선해야 한다.

### 발표 순서

4시간 워크숍 기준으로는 성립한다. 실패 패턴을 먼저 보여 주고, 그 실패를 막는 레이어를 하나씩 소개하는 구조가 좋다.

짧은 발표 기준으로는 별도 condensed track이 필요하다. 추천 압축 슬라이드는 다음 정도다.

```text
00-1-workbench-preview
02-failure-patterns
03-2-harness-flow
04-1-prompt-anatomy
08-claude-md
10-skills
16-2-hook-command
19-evaluation
21-final-workflow
```

### 누락/부족

- 공식 출처 링크가 speaker note나 section appendix에 일관되게 붙어 있지 않다.
- `02-7 -> 13`, `09-3 -> 10`, `18-4 -> 16` 사이 bridge slide가 필요하다.
- `lecture-cuts` 실제 발표 순서와 standalone HTML `Prev/Next` 링크가 다르다.
- 20~30분 발표용과 4시간 워크숍용의 기준이 같은 파일 안에 섞여 있다.

### 실제와의 괴리

- "PPTX가 약하다"는 표현은 일반론으로 들리면 과하다. reveal.js, Slidev, Marp 모두 HTML 기반 authoring/presentation과 export를 함께 다룬다. 권장 문장은 "이 harness에서는 HTML을 canonical authoring/runtime output으로 두고, export는 공유용으로 분리한다"가 더 정확하다.
- "MCP = Tool Layer"는 강의용 shortcut으로는 괜찮지만, MCP의 resources/prompts를 누락한다.
- "Reviewer agent는 diff와 결함 기준만 봅니다"는 기본 동작이 아니라 설계 목표다. 도구 권한과 입력 범위를 제한해야 현실과 맞다.

### 비유와 설명

좋은 비유:

- 작업장: 전체 harness
- 작업대: context budget
- 검문소: hook/verification
- 다리: MCP

보강할 비유:

- `spec contract` -> 주문서/검수 기준서
- `rubric` -> 채점표
- `context isolation` -> 분리된 회의실/작업방

### 이미지/시각 자료

방향은 좋다. `디자인.md`의 hand-drawn minimal 방향과 `lecture-cuts/assets/handdrawn/` 자산은 강의 톤에 맞는다.

다만 실제 집계 기준으로 87장 중 `img` 사용 슬라이드는 8장이고, `css-visual` 사용 슬라이드는 78장이다. 반복도도 높다.

```text
expand-artifact-visual: 14
expand-matrix-visual: 13
expand-flow-visual: 13
expand-compare-visual: 11
```

따라서 장시간 발표에서는 시각 피로가 생길 수 있다. 중요한 공식 구조 슬라이드에는 hand-drawn 이미지보다 실제 schema/code diff, 파일 tree, 브라우저 검증 결과 캡처, before/after artifact 같은 자료형 visual이 더 낫다.

특히 `06-1-good-few-shot.html`, `08-2-good-claude-md.html`, `11-1-real-skill-folder.html`, `21-1-final-artifact-structure.html`, `21-6-handoff-template.html`은 "실제 파일/폴더/산출물"을 보여주는 쪽이 이해에 더 직접적이다.

## 미해결

1. `lecture-cuts/16-2-hook-command.html`의 hook JSON을 공식 schema로 고쳐야 한다.
2. `lecture-cuts/17-hook-advanced.html`의 "Prompt Hook / Agent Hook" 표현을 공식 이벤트명과 구분해야 한다.
3. `lecture-cuts/18-1-mcp-bridge.html`에 Host / MCP Client / MCP Server / tools / resources / prompts 구분을 넣어야 한다.
4. `lecture-cuts/21-1-final-artifact-structure.html`에 "강의용 harness path"와 "Claude Code 공식 skill path"를 분리해야 한다.
5. standalone HTML `Prev/Next` 링크를 `assets/slides.js` 순서에 맞추거나, standalone nav는 index-only로 단순화해야 한다.
6. 1280x720 발표 환경에서 `.deck-stage` 높이 계산을 수정해야 한다.
7. overflow warning이 나온 slide들을 실제 화면 기준으로 선별 수정해야 한다.
8. CSS visual 반복 구간 중 일부를 실제 파일 tree, screenshot, schema/code diff로 교체해야 한다.
9. 20~30분 condensed deck과 4시간 workshop deck을 분리할지 결정해야 한다.
