### 발견

`node scripts/validate-lecture-cuts-contract.js`의 `source coverage` 경고는 slide registry의 해당 슬라이드에 `sources`가 없고, export된 `slide-spec.json`에는 `sources.html`의 deck-global appendix 6개만 붙은 경우를 세는 경고다. 현재 실패는 아니며, `source-sensitive slide coverage`는 통과한다.

경고 대상 10개 슬라이드는 아래와 같다.

- 6. `02-2-failure-example-read-before-edit.html` - 읽지 않고 고치면 API를 상상합니다
- 8. `02-4-failure-example-context-drift.html` - 오래된 가정은 현재 작업을 오염시킵니다
- 17. `13-1-vibe-vs-spec.html` - 명세 기반 작업은 즉흥 구현을 줄입니다
- 20. `13-4-spec-plan-review-flow.html` - Spec은 plan과 review로 이어져야 합니다
- 25. `05-1-persona-weak.html` - "시니어처럼"은 너무 넓은 지시입니다
- 26. `05-2-persona-rubric.html` - 페르소나는 역할보다 판단 기준으로 씁니다
- 37. `09-1-context-budget.html` - 컨텍스트는 무한한 창고가 아니라 작업대입니다
- 55. `15-1-parallel-safe.html` - 병렬화는 안전한 경우와 위험한 경우를 나눕니다
- 73. `21-final-workflow.html` - HTML/CSS Deck Automation Harness v1
- 75. `21-10-practice-few-shot-placement.html` - Few-shot은 slide-spec.json 바로 다음에 둡니다

현재 `sources.html` / `lecture-cuts-source-map.json`의 deck-global source card는 다음 6개다.

- Claude Code Hooks - https://docs.anthropic.com/en/docs/claude-code/hooks
- Claude Code Subagents - https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code Skills - https://docs.anthropic.com/en/docs/claude-code/skills
- Claude Code Memory - https://docs.anthropic.com/en/docs/claude-code/memory
- Model Context Protocol Server Features - https://modelcontextprotocol.io/specification/draft/server/tools, https://modelcontextprotocol.io/specification/draft/server/resources, https://modelcontextprotocol.io/specification/draft/server/prompts
- OpenAI Evaluation Best Practices - https://developers.openai.com/api/docs/guides/evaluation-best-practices

### 슬라이드별 판정

| # | Slide | 판정 | 이유 | 후보 source card |
|---:|---|---|---|---|
| 6 | `02-2-failure-example-read-before-edit.html` | Allowlist 후보 | "파일을 먼저 읽어라"는 이 덱의 작업 절차/강의 사례다. 특정 Claude Code 기능, MCP 스키마, OpenAI eval API claim이 아니다. | 보강하지 않음. 정책 예시로만 둔다. |
| 8 | `02-4-failure-example-context-drift.html` | 보강 권장 | 긴 대화의 오래된 가정, 최신 목표 오염, 필요한 자료만 남긴다는 설명은 context 관리 claim이다. 현재 6개 appendix 중 직접 대응은 약하다. | 새 카드 권장: `Anthropic Long Context Prompting Tips` - https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/long-context-tips |
| 17 | `13-1-vibe-vs-spec.html` | Allowlist 후보 | 파일로 남는 합의, 목표/제외 범위 고정은 워크숍 방법론이다. 외부 제품 기능 설명이 아니라 내부 하네스 운영 원칙이다. | 보강하지 않음. |
| 20 | `13-4-spec-plan-review-flow.html` | 선택 보강 | Spec -> Plan -> Execution -> Review 흐름은 내부 방법론이다. 다만 "review를 기준과 대조한다"는 품질 루프는 eval best practice와 맞닿는다. | 필요 시 기존 카드 `OpenAI Evaluation Best Practices`를 slide-level로 연결. |
| 25 | `05-1-persona-weak.html` | 보강 권장 | "역할 이름만 주면 문체로 해석될 수 있고, 우선순위를 명시해야 한다"는 prompt engineering claim이다. 기존 source appendix에는 role prompting/명확한 지시 source가 없다. | 새 카드 권장: `Anthropic Be Clear, Direct, and Detailed` - https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct / 보조: `Anthropic Role Prompting` - https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts |
| 26 | `05-2-persona-rubric.html` | 보강 권장 | persona를 판단 기준/rubric으로 쓰고 P1/P2/P3 우선순위를 둔다는 주장은 prompt design + evaluation criteria claim이다. | 새 카드 `Anthropic Be Clear, Direct, and Detailed`; 기존 카드 `OpenAI Evaluation Best Practices`를 함께 연결. |
| 37 | `09-1-context-budget.html` | 보강 권장 | 항상 필요한 기억은 작게, 큰 자료는 필요할 때만, 도구 설명도 context 비용이라는 source-sensitive context/memory/skill/tool claim이다. | 기존 카드 `Claude Code Memory`, `Claude Code Skills`, `Model Context Protocol Server Features`; 새 카드 `Anthropic Long Context Prompting Tips` 추가 권장. |
| 55 | `15-1-parallel-safe.html` | 선택 보강 | 안전/위험 병렬화 기준은 이 덱의 orchestration 정책이다. 단, subagent가 별도 context/tool permission을 갖는다는 배경을 암시한다. | 필요 시 기존 카드 `Claude Code Subagents`를 slide-level로 연결. |
| 73 | `21-final-workflow.html` | 보강 권장 | source -> spec -> few-shot -> review -> verification -> handoff workflow 자체는 내부 워크숍 산출물이지만, 구성요소가 Skills/Memory/Hooks/Evaluation으로 이어진다. final workflow overview라 deck-global만으로 둘 수도 있으나, 경고 축소 목적이면 핵심 카드 연결이 자연스럽다. | 기존 카드 `Claude Code Hooks`, `Claude Code Skills`, `Claude Code Memory`, `OpenAI Evaluation Best Practices`. |
| 75 | `21-10-practice-few-shot-placement.html` | 보강 권장 | few-shot의 위치와 출력 형식 안정화는 prompt engineering claim이다. 기존 source appendix에는 few-shot/multishot source가 없다. | 새 카드 권장: `Anthropic Multishot Prompting` - https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting / 보조: `OpenAI Prompt Engineering` - https://platform.openai.com/docs/guides/prompt-engineering/strategies-for-better-results |

### 권장 보강

우선순위 1: 새 source card 3개를 `sources.html`에 추가하고 관련 슬라이드에 slide-level source로 연결한다.

- `Anthropic Long Context Prompting Tips` - slide 8, 37
  - 이유: long context에서 문서 배치, 구조화, 근거 인용을 다루므로 "컨텍스트는 필요한 자료만 관리해야 한다"는 설명의 근거로 가장 직접적이다.
- `Anthropic Be Clear, Direct, and Detailed` - slide 25, 26
  - 이유: 구체적이고 단계적인 지시, task context, 성공 기준을 명시하라는 내용이 persona를 rubric으로 바꾸는 주장과 직접 연결된다.
- `Anthropic Multishot Prompting` - slide 75
  - 이유: examples/few-shot이 정확도, 일관성, 구조 준수에 효과적이라는 설명이 slide 75의 핵심 claim과 직접 연결된다.

우선순위 2: 기존 source card만으로 보강 가능한 항목을 slide-level로 승격한다.

- slide 20: `OpenAI Evaluation Best Practices`
  - 이유: review를 기준 대조로 운영한다는 품질 루프 설명에 대응한다.
- slide 37: `Claude Code Memory`, `Claude Code Skills`, `Model Context Protocol Server Features`
  - 이유: 항상 켜진 기억, 필요할 때 여는 자료, tool/resource/prompt 노출이 각각 slide claim의 하위 요소다.
- slide 55: `Claude Code Subagents`
  - 이유: 독립 context/tool permission을 가진 subagent 개념을 병렬 작업 분리의 배경 source로 연결할 수 있다.
- slide 73: `Claude Code Hooks`, `Claude Code Skills`, `Claude Code Memory`, `OpenAI Evaluation Best Practices`
  - 이유: final workflow overview가 해당 구성요소를 한 번에 요약한다.

우선순위 3: 아래 2개는 slide-level source를 붙이지 않는 allowlist 후보로 남긴다.

- slide 6 `02-2-failure-example-read-before-edit.html`
- slide 17 `13-1-vibe-vs-spec.html`

이 둘은 제품 기능이나 공식 schema 설명보다 "작업 전 파일을 읽고, 명세로 합의를 고정한다"는 강의 방법론에 가깝다. source coverage 경고를 0으로 만드는 것이 목적이라면 `OpenAI Evaluation Best Practices`를 약하게 연결할 수는 있지만, source 의미가 흐려진다.

### 정책 제안

- `deck-global-only` 경고를 모두 같은 위험으로 보지 말고, registry 또는 별도 policy 파일에 `sourcePolicy`를 둘 수 있다.
- 권장 분류:
  - `requires-slide-source`: 공식 기능, API/schema, prompt engineering 효과, context/window 운영처럼 외부 근거가 필요한 claim.
  - `allow-deck-global`: 오프닝, 전환, 요약, 워크숍 실습 지시, 내부 하네스 방법론.
  - `internal-method`: 이 repo의 파일 구조나 워크플로우 자체를 설명하는 slide. 외부 source보다 repo artifact/source.md/spec/handoff를 근거로 삼는 편이 맞다.
- validator는 `allow-deck-global` 항목을 warning count에서 제외하고, 대신 별도 PASS/WARN로 "allowlisted deck-global-only slides"를 보고하는 방식이 좋다.
- source card를 억지로 연결하지 않기 위해 "후보 source가 claim을 직접 지지하지 않으면 allowlist로 분류"하는 정책이 필요하다.

### 검증 명령

이번 작업에서는 slide/spec/source map을 수정하지 않았으므로 export는 실행하지 않았다. 현재 경고 재현과 계약 상태 확인 명령은 아래와 같다.

```sh
node scripts/validate-lecture-cuts-contract.js
```

현재 결과:

- `PASS source-sensitive slide coverage - all slides marked with per-slide sources retain slide-level evidence`
- `WARN source coverage - 10 slides rely on deck-global source appendix only`

실제 보강 후에는 아래 순서로 확인한다.

```sh
node scripts/export-lecture-cuts-contract.js
node scripts/validate-lecture-cuts-contract.js
node scripts/audit-lecture-cuts.js
node scripts/verify-lecture-cuts-harness.js
```

Korean copy나 speaker script를 같이 바꾸는 경우에는 추가로 실행한다.

```sh
node scripts/audit-lecture-cuts-korean-copy.js
node scripts/audit-lecture-cuts-speaker-sync.js
```

### 미해결

- 실제 보강은 다른 에이전트와 충돌하지 않도록 owner를 정한 뒤 `lecture-cuts/assets/slides.js`, `lecture-cuts/sources.html`, export 산출물(`slide-spec.json`, source map)을 한 번에 갱신해야 한다.
- 새 후보 source card 3개는 공식 문서 URL 기준으로 제안했지만, 발표 전 최신 페이지명/URL을 다시 확인해야 한다.
- slide 6, 17을 allowlist로 둘지, 경고 0개를 목표로 약한 source를 붙일지는 정책 결정이 필요하다.
