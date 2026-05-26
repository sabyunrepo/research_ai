# Lecture Cuts LLM Context Pack

이 파일은 다른 LLM에 전체 발표 덱을 주입하기 위한 1회성 컨텍스트 팩입니다. 슬라이드별로 화면 문구와 발표 스크립트를 함께 묶었습니다.

## 사용 지시문

다른 LLM에 이 파일을 줄 때는 아래처럼 요청하면 됩니다.

```text
아래는 87장짜리 한국어 강의 슬라이드의 슬라이드별 화면 내용과 발표 스크립트입니다.
각 Slide 블록을 독립 단위로 보되, 전체 흐름도 함께 고려해 주세요.
검토할 때는 1) 슬라이드 문구의 오탈자와 한국어 자연스러움, 2) 발표 스크립트의 문장 품질, 3) 슬라이드와 스크립트의 불일치, 4) 출처가 필요한 사실 주장, 5) 발표 흐름상 중복/비약을 찾아 주세요.
수정 제안은 반드시 Slide 번호와 file을 붙여서 제시해 주세요.
```

## 덱 메타데이터

- deck: lecture-cuts
- slide count: 87
- registry: `lecture-cuts/assets/slides.js`
- generatedBy: scripts/export-lecture-cuts-contract.js
- source contract: `lecture-cuts/slide-spec.json`

## 섹션 목록

- 00: 오프닝 / 전체 지도 (7 slides)
- 01: 실패 패턴 (8 slides)
- 02: Spec / Prompt (17 slides)
- 03: Context / Memory (8 slides)
- 04: Skills / Superpowers (10 slides)
- 05: Agents / Tools (12 slides)
- 06: Hooks / Verification (14 slides)
- 07: Final Workflow (11 slides)

## 슬라이드별 컨텍스트

## Slide 01 / 00-title

- file: `00-title.html`
- section: 오프닝 / 전체 지도 (1/7)
- kind: main
- contentHash: `sha256:21170f005c1050bbaed77238c9bef807b93f4779bb6c201e635f0d685ca1c1ed`

### 슬라이드 화면 내용

**제목:** AI 에이전트 하네스 엔지니어링

**부제:** Prompt, Context, Skills, Agents, Hooks, MCP로 만드는 실전 자동화 워크플로우.

**불릿:**
- 없음

**발표자 노트:** 스크립트 오늘은 AI에게 한 번 잘 말하는 법이 아니라, 반복해서 안전하게 일하게 만드는 구조를 다룹니다.

**미디어/시각자료:** `assets/handdrawn/01-harness.png`

### 발표 스크립트

안녕하세요, 여러분. 오늘 강의의 제목은 'AI 에이전트 하네스 엔지니어링'입니다.
'하네스'라는 말을 들으면 AI를 꽁꽁 묶어두거나 제한한다는 느낌을 받으실 수 있습니다. 하지만 이 기술의 진짜 목적은 반대입니다. AI가 안전하고, 지치지 않고, 몇 번을 반복해도 똑같이 훌륭하게 일할 수 있도록 '주변 환경과 시스템'을 설계하는 것을 의미합니다.
자동차 경주를 예로 들어보겠습니다. 아무리 실력이 뛰어난 천재 레이서가 있어도, 안전벨트가 없고, 트랙이 엉망이고, 신호등이나 정비소(피트인) 체계가 없다면 제대로 달릴 수 없습니다. 사고가 나거나 길을 잃겠죠. AI도 똑같습니다. 인공지능 모델 자체의 능력이 아무리 뛰어나도, 그것만으로는 현업에서 제대로 된 결과물을 내기 어렵습니다.
우리가 오늘 다룰 것은 단순히 프롬프트 하나를 기막히게 잘 쓰는 요령이 아닙니다. 프롬프트는 그저 시작점일 뿐입니다. 우리는 그 위에 프로젝트의 규칙을 심는 CLAUDE.md부터 시작해서 AI에게 전문적인 공구를 쥐여주는 방법, 역할을 나누는 방법, 그리고 최종적으로 결과물을 검수하는 체계까지 하나씩 쌓아 올릴 겁니다.
이번 강의의 목표는 명확합니다. 오늘 수업이 끝났을 때 여러분이 "AI에게 이렇게 질문하면 된다"를 배워가는 것이 아니라, "우리 팀의 AI 작업 환경은 앞으로 이렇게 세팅하면 되겠구나"라는 지도를 머릿속에 그리게 만드는 것입니다.
그 지도를 그리기 위해, 우리는 오늘 강의의 마지막에 실제로 작동하는 작은 자동차 조립 공장 같은 자동화 워크플로우를 함께 완성해 볼 것입니다.

### 출처

- Model Context Protocol Server Features (slide)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 02 / 00-1-workbench-preview

- file: `00-1-workbench-preview.html`
- section: 오프닝 / 전체 지도 (2/7)
- kind: main
- contentHash: `sha256:59eecf6a072f328a2c5e79fc5d4a49104fddce8dd607df072f0c7939b6a7f969`

### 슬라이드 화면 내용

**제목:** 우리가 만들 것은 프롬프트가 아니라 작업장입니다

**부제:** 강의의 모든 개념은 하나의 AI 작업 환경으로 합쳐집니다.

**불릿:**
- 규칙은 항상 보이는 기억으로 둡니다.
- 절차는 재사용 가능한 Skill로 뺍니다.
- 검증은 Hook과 Evaluation으로 강제합니다.

**발표자 노트:** 브리핑 초반에 최종 구조를 먼저 보여 주면 중간 개념들이 흩어져 보이지 않습니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “우리가 만들 것은 프롬프트가 아니라 작업장입니다”입니다. 강의의 모든 개념은 하나의 AI 작업 환경으로 합쳐집니다.
화면에서는 규칙은 항상 보이는 기억으로 둡니다. / 절차는 재사용 가능한 Skill로 뺍니다. / 검증은 Hook과 Evaluation으로 강제합니다.를 먼저 짚습니다. 이때 핵심 용어는 Hook, MCP, Skill, Subagent, Evaluation, CLAUDE.md이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 프롬프트 팁이 아니라 AI가 일하는 작업장 전체를 설계한다는 관점을 여는 데 있습니다. 다음 장 “AI는 똑똑하지만 일관되지는 않습니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Model Context Protocol Server Features (slide)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 03 / 01-why-harness

- file: `01-why-harness.html`
- section: 오프닝 / 전체 지도 (3/7)
- kind: main
- contentHash: `sha256:48e718df715b6d9d79055d7eaae2614933a15b540316286a28695ec598f70c36`

### 슬라이드 화면 내용

**제목:** AI는 똑똑하지만 일관되지는 않습니다

**부제:** 하네스는 모델 주변에 규칙, 절차, 도구, 검증을 배치하는 작업입니다.

**불릿:**
- 반복 지시는 기억으로 고정합니다.
- 반복 절차는 Skill로 승격합니다.
- 반드시 필요한 검증은 Hook으로 강제합니다.

**발표자 노트:** 핵심 하네스 엔지니어링은 프롬프트 엔지니어링을 포함하지만, 거기서 멈추지 않습니다.

**미디어/시각자료:** 없음

### 발표 스크립트

AI 코딩 도구를 써 보면 처음에는 굉장히 인상적입니다. 코드를 빠르게 읽고, 파일을 고치고, 테스트도 제안합니다. 그런데 실무에서 계속 써 보면 문제가 생깁니다. 어떤 날은 테스트를 잘 돌리는데, 어떤 날은 생략합니다. 어떤 요청에서는 범위를 잘 지키는데, 어떤 요청에서는 원하지 않은 리팩터링까지 섞습니다. 같은 팀 규칙을 매번 설명해야 하는 경우도 많습니다.
이 문제를 단순히 “프롬프트를 더 잘 써야 한다”로만 보면 한계가 있습니다. 프롬프트는 대화 한 번에는 효과가 있지만, 프로젝트 전체와 팀 전체의 반복적인 작업 습관을 보장하지는 못합니다. 그래서 우리는 지시를 여러 단계로 승격시켜야 합니다. 한 번만 필요한 말은 프롬프트에 두고, 반복되는 규칙은 CLAUDE.md에 두고, 반복되는 절차는 Skill로 만들고, 역할 분리가 필요하면 Subagent로 만들고, 반드시 실행되어야 하는 검증은 Hook으로 올립니다.
하네스 엔지니어링은 바로 이 승격 기준을 설계하는 일입니다. AI가 알아서 잘해 주기를 기대하는 것이 아니라, AI가 지나가는 길목마다 필요한 정보를 주고, 필요한 절차를 열고, 필요한 검증을 강제하는 구조를 만드는 것입니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 04 / 01-1-inconsistency-before-after

- file: `01-1-inconsistency-before-after.html`
- section: 오프닝 / 전체 지도 (4/7)
- kind: main
- contentHash: `sha256:888ece6a9d398617ad53136af3898c7a6c14441be220036d1f5684f785eda4ba`

### 슬라이드 화면 내용

**제목:** 같은 요청도 환경이 다르면 결과가 달라집니다

**부제:** 모델 성능보다 먼저 작업 조건의 일관성을 확인해야 합니다.

**불릿:**
- 규칙이 없으면 매번 추론으로 빈칸을 채웁니다.
- 검증이 없으면 성공 선언을 그대로 믿게 됩니다.
- 하네스는 같은 조건을 반복 가능하게 만듭니다.

**발표자 노트:** 발표 포인트 하네스가 필요한 이유를 한 장의 before/after로 보여 줍니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “같은 요청도 환경이 다르면 결과가 달라집니다”입니다. 모델 성능보다 먼저 작업 조건의 일관성을 확인해야 합니다.
화면에서는 규칙이 없으면 매번 추론으로 빈칸을 채웁니다. / 검증이 없으면 성공 선언을 그대로 믿게 됩니다. / 하네스는 같은 조건을 반복 가능하게 만듭니다.를 먼저 짚습니다. 이때 핵심 용어는 Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 AI의 성능보다 반복 가능한 작업 조건이 먼저라는 문제의식을 세우는 데 있습니다. 다음 장 “요즘 워크플로우는 레이어로 봅니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 05 / 03-layer-map

- file: `03-layer-map.html`
- section: 오프닝 / 전체 지도 (5/7)
- kind: main
- contentHash: `sha256:57ec95a6996f19ba51f9ffea8bf0871e2c296cc34653c6fbf56900c5150f2e69`

### 슬라이드 화면 내용

**제목:** 요즘 워크플로우는 레이어로 봅니다

**부제:** 프롬프트 → 컨텍스트 → 스킬 → 에이전트 → 훅 → 도구 → 평가 → 반복.

**불릿:**
- 작은 지시는 프롬프트에 둡니다.
- 반복되는 지식과 절차는 파일로 승격합니다.
- 검증과 운영은 자동화로 올립니다.

**발표자 노트:** 한 문장 프롬프트는 하네스의 시작일 뿐입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이제 오늘 강의 전체를 하나의 지도처럼 보겠습니다. 가장 안쪽에는 Prompt Layer가 있습니다. 여기에는 페르소나, few-shot 예시, 출력 형식, XML 태그 같은 즉석 지시가 들어갑니다. 그 다음은 Context Layer입니다. CLAUDE.md와 컨텍스트 엔지니어링이 여기에 속합니다. AI가 어떤 정보를 항상 기억하고, 어떤 정보는 필요할 때만 열어야 하는지 결정하는 레이어입니다.
그 다음은 Skill Layer입니다. 반복되는 업무 절차를 재사용 가능한 매뉴얼로 만드는 단계입니다. Superpowers는 이 Skill Layer를 활용해 개발 절차를 강제하는 좋은 사례입니다. 이후에는 Agent Layer가 나옵니다. Subagent와 Agent Teams를 통해 리뷰, 보안, 리서치 같은 역할을 분리합니다.
그 위에는 Automation Layer가 있습니다. Hooks가 대표적입니다. 지침이 아니라 실제 이벤트에 반응해 명령을 실행합니다. MCP는 Tool Layer로 볼 수 있습니다. GitHub, 브라우저, DB, Figma 같은 외부 시스템과 연결합니다. 마지막에는 Evaluation과 Loop가 있습니다. 결과를 검증하고, 필요하면 반복하거나 스케줄링합니다. 오늘 강의는 이 순서를 따라 하나씩 쌓아 올립니다.

### 출처

- Model Context Protocol Server Features (slide)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 06 / 03-1-layer-responsibility

- file: `03-1-layer-responsibility.html`
- section: 오프닝 / 전체 지도 (6/7)
- kind: main
- contentHash: `sha256:cb19dee9db6f4d79f68d05db630701b3a8c5d87ba91a845c510c7eb5738ff869`

### 슬라이드 화면 내용

**제목:** 각 레이어는 맡는 책임이 다릅니다

**부제:** 프롬프트는 지시, 컨텍스트는 기억, 스킬은 절차, 훅은 강제 실행입니다.

**불릿:**
- 책임이 섞이면 유지보수가 어려워집니다.
- 반복되는 것은 더 지속적인 레이어로 올립니다.
- 검증은 말이 아니라 실행 지점에 둡니다.

**발표자 노트:** 발표 포인트 프롬프트는 지시, 컨텍스트는 기억, 스킬은 절차, 훅은 강제 실행입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “각 레이어는 맡는 책임이 다릅니다”입니다. 프롬프트는 지시, 컨텍스트는 기억, 스킬은 절차, 훅은 강제 실행입니다.
화면에서는 책임이 섞이면 유지보수가 어려워집니다. / 반복되는 것은 더 지속적인 레이어로 올립니다. / 검증은 말이 아니라 실행 지점에 둡니다.를 먼저 짚습니다. 이때 핵심 용어는 Skill, Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 각 기능을 따로 외우지 않고 하나의 누적 구조로 보게 만드는 데 있습니다. 다음 장 “지시는 점점 더 단단한 구조로 승격됩니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 07 / 03-2-harness-flow

- file: `03-2-harness-flow.html`
- section: 오프닝 / 전체 지도 (7/7)
- kind: workflow
- contentHash: `sha256:e29b1c0a62e26d2e13c27299d39c26914c5bc6ac9f805985ec96692198c4f045`

### 슬라이드 화면 내용

**제목:** 지시는 점점 더 단단한 구조로 승격됩니다

**부제:** 한 번 말할 것은 프롬프트, 반복할 것은 파일, 반드시 지킬 것은 자동화로 올립니다.

**불릿:**
- 지시 → 기억 → 절차 → 역할 → 도구 → 검증
- 강도가 높아질수록 누락 가능성이 줄어듭니다.
- 모든 것을 Hook으로 만들 필요는 없습니다.

**발표자 노트:** 발표 포인트 한 번 말할 것은 프롬프트, 반복할 것은 파일, 반드시 지킬 것은 자동화로 올립니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “지시는 점점 더 단단한 구조로 승격됩니다”입니다. 한 번 말할 것은 프롬프트, 반복할 것은 파일, 반드시 지킬 것은 자동화로 올립니다.
화면에서는 지시 → 기억 → 절차 → 역할 → 도구 → 검증 / 강도가 높아질수록 누락 가능성이 줄어듭니다. / 모든 것을 Hook으로 만들 필요는 없습니다.를 먼저 짚습니다. 이때 핵심 용어는 Hook, MCP, Skill, Subagent, Evaluation, CLAUDE.md이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 각 기능을 따로 외우지 않고 하나의 누적 구조로 보게 만드는 데 있습니다. 다음 장 “실패는 보통 지능보다 절차 문제입니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Model Context Protocol Server Features (slide)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 08 / 02-failure-patterns

- file: `02-failure-patterns.html`
- section: 실패 패턴 (1/8)
- kind: main
- contentHash: `sha256:6b46fe62a3177092fd1a4354fe66cea23cfc35689950ac8259b1feac2b8c8114`

### 슬라이드 화면 내용

**제목:** 실패는 보통 지능보다 절차 문제입니다

**부제:** AI 코딩 실패는 예측 가능합니다. 그래서 구조로 막을 수 있습니다.

**불릿:**
- 파일을 읽기 전에 수정합니다.
- 테스트 실패를 skip으로 숨깁니다.
- 완료 전에 리뷰와 검증을 생략합니다.

**발표자 노트:** 강의 전환 이 실패 패턴 하나하나가 뒤에서 다룰 레이어의 필요성입니다.

**미디어/시각자료:** `assets/handdrawn/08-hooks.png`

### 발표 스크립트

이 섹션의 목적은 AI 도구가 왜 틀리는지 모델 탓으로만 돌리지 않고, 반복되는 실패 패턴을 구조로 보는 것입니다.
읽지 않고 고치기, 테스트 생략, 범위 확장, 컨텍스트 오염을 먼저 확인한 뒤, 뒤 섹션에서 각각 CLAUDE.md, Skill, Subagent, Hook, Evaluation으로 어떻게 막는지 연결합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 09 / 02-1-why-llms-fail

- file: `02-1-why-llms-fail.html`
- section: 실패 패턴 (2/8)
- kind: main
- contentHash: `sha256:aeadf66668cfbb055e622721b6901c6ea11094f78697fd1596604700613c4a65`

### 슬라이드 화면 내용

**제목:** LLM은 빈칸을 추론으로 채웁니다

**부제:** 문제가 되는 순간은 모델이 모를 때가 아니라, 모르는 것을 그럴듯하게 메울 때입니다.

**불릿:**
- 보이는 파일과 규칙만 기준으로 판단합니다.
- 도구 피드백이 없으면 성공 여부를 추정합니다.
- 검증 압력이 낮으면 빠른 완료를 택합니다.

**발표자 노트:** 핵심 설명 실패는 모델 지능 하나가 아니라 작업 환경에서 생기는 압력의 결과로 설명합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “LLM은 빈칸을 추론으로 채웁니다”입니다. 문제가 되는 순간은 모델이 모를 때가 아니라, 모르는 것을 그럴듯하게 메울 때입니다.
화면에서는 보이는 파일과 규칙만 기준으로 판단합니다. / 도구 피드백이 없으면 성공 여부를 추정합니다. / 검증 압력이 낮으면 빠른 완료를 택합니다.를 먼저 짚습니다. 이때 핵심 용어는 Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 뒤에서 배울 레이어들이 어떤 실패를 막는지 먼저 몸으로 이해시키는 데 있습니다. 다음 장 “읽지 않고 고치면 API를 상상합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 10 / 02-2-failure-example-read-before-edit

- file: `02-2-failure-example-read-before-edit.html`
- section: 실패 패턴 (3/8)
- kind: example
- contentHash: `sha256:3693e6694b20faa278fbebb7d763005af1d28e7c9e2d6a7c6260db01252044ac`

### 슬라이드 화면 내용

**제목:** 읽지 않고 고치면 API를 상상합니다

**부제:** 가장 흔한 실패는 “아마 이런 함수가 있겠지”라는 추측으로 새 코드를 넣는 것입니다.

**불릿:**
- 주변 파일의 네이밍과 에러 처리를 놓칩니다.
- 없는 helper나 오래된 패턴을 호출합니다.
- 작은 버그 수정이 새 회귀로 바뀝니다.

**발표자 노트:** 예제 포인트 실제 프로젝트 파일을 먼저 읽는 절차가 왜 필요한지 보여주는 장면입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “읽지 않고 고치면 API를 상상합니다”입니다. 가장 흔한 실패는 “아마 이런 함수가 있겠지”라는 추측으로 새 코드를 넣는 것입니다.
화면에서는 주변 파일의 네이밍과 에러 처리를 놓칩니다. / 없는 helper나 오래된 패턴을 호출합니다. / 작은 버그 수정이 새 회귀로 바뀝니다.를 먼저 짚습니다. 대본은 화면의 제목, 보조 문장, 발표 포인트를 같은 순서로 따라가며 설명합니다.
발표자는 이 내용을 뒤에서 배울 레이어들이 어떤 실패를 막는지 먼저 몸으로 이해시키는 데 있습니다. 다음 장 “테스트를 약화하면 성공처럼 보입니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/hooks: https://docs.anthropic.com/en/docs/claude-code/hooks
- Claude Code Subagents (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/sub-agents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code Skills (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Claude Code Memory (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/memory: https://docs.anthropic.com/en/docs/claude-code/memory
- Model Context Protocol Server Features (deck-global)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- OpenAI Evaluation Best Practices (deck-global)
  - https://developers.openai.com/api/docs/guides/evaluation-best-practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices

---

## Slide 11 / 02-3-failure-example-skip-test

- file: `02-3-failure-example-skip-test.html`
- section: 실패 패턴 (4/8)
- kind: example
- contentHash: `sha256:ecb87786c98e70341826cb33586bba21704a05aaee23d63177d26d32eeba4310`

### 슬라이드 화면 내용

**제목:** 테스트를 약화하면 성공처럼 보입니다

**부제:** 실패 원인을 고치지 않고 검증 기준을 낮추면, 초록색 결과가 품질 증거처럼 보입니다.

**불릿:**
- skip, 느슨한 assertion, 과도한 mock으로 실패를 우회합니다.
- CI에서는 지나가도 실제 사용자 플로우는 계속 깨집니다.
- 완료 보고가 증거가 아니라 주장으로 바뀝니다.

**발표자 노트:** 예제 포인트 테스트를 돌리는 것보다 중요한 것은 실패를 정직하게 다루는 절차입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “테스트를 약화하면 성공처럼 보입니다”입니다. 실패 원인을 고치지 않고 검증 기준을 낮추면, 초록색 결과가 품질 증거처럼 보입니다.
화면에서는 skip, 느슨한 assertion, 과도한 mock으로 실패를 우회합니다. / CI에서는 지나가도 실제 사용자 플로우는 계속 깨집니다. / 완료 보고가 증거가 아니라 주장으로 바뀝니다.를 먼저 짚습니다. 이때 핵심 용어는 Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 뒤에서 배울 레이어들이 어떤 실패를 막는지 먼저 몸으로 이해시키는 데 있습니다. 다음 장 “오래된 가정은 현재 작업을 오염시킵니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 12 / 02-4-failure-example-context-drift

- file: `02-4-failure-example-context-drift.html`
- section: 실패 패턴 (5/8)
- kind: example
- contentHash: `sha256:cad67810f2c3d89b7b3b0bf5578a0cdd3b45068cbf89a563d84f26a2cb516f3b`

### 슬라이드 화면 내용

**제목:** 오래된 가정은 현재 작업을 오염시킵니다

**부제:** 긴 대화에서는 폐기된 요구사항과 최신 목표가 같은 작업대 위에 섞입니다.

**불릿:**
- 초기 실험을 최종 결정처럼 사용합니다.
- 이전 파일 상태를 최신 상태로 착각합니다.
- 작은 요청에 과거 범위가 다시 끼어듭니다.

**발표자 노트:** 예제 포인트 컨텍스트를 많이 넣는 것이 아니라 최신 목표와 필요한 자료만 남기는 것이 핵심입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “오래된 가정은 현재 작업을 오염시킵니다”입니다. 긴 대화에서는 폐기된 요구사항과 최신 목표가 같은 작업대 위에 섞입니다.
화면에서는 초기 실험을 최종 결정처럼 사용합니다. / 이전 파일 상태를 최신 상태로 착각합니다. / 작은 요청에 과거 범위가 다시 끼어듭니다.를 먼저 짚습니다. 대본은 화면의 제목, 보조 문장, 발표 포인트를 같은 순서로 따라가며 설명합니다.
발표자는 이 내용을 뒤에서 배울 레이어들이 어떤 실패를 막는지 먼저 몸으로 이해시키는 데 있습니다. 다음 장 “더 똑똑하라고 하지 말고 절차를 만듭니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/hooks: https://docs.anthropic.com/en/docs/claude-code/hooks
- Claude Code Subagents (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/sub-agents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code Skills (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Claude Code Memory (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/memory: https://docs.anthropic.com/en/docs/claude-code/memory
- Model Context Protocol Server Features (deck-global)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- OpenAI Evaluation Best Practices (deck-global)
  - https://developers.openai.com/api/docs/guides/evaluation-best-practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices

---

## Slide 13 / 02-5-improvement-process-guardrails

- file: `02-5-improvement-process-guardrails.html`
- section: 실패 패턴 (6/8)
- kind: main
- contentHash: `sha256:cd9ba67d02ec8dc2a68f5948302903c9aff33734c5dd8d88470a496f296aff6d`

### 슬라이드 화면 내용

**제목:** 더 똑똑하라고 하지 말고 절차를 만듭니다

**부제:** 읽기 → 계획 → 수정 → 검증 → 보고는 AI가 지나가야 하는 최소 작업선입니다.

**불릿:**
- 읽기: 관련 파일과 현재 상태를 확인합니다.
- 검증: 테스트와 화면으로 완료를 증명합니다.
- 보고: 바꾼 것과 남은 위험을 분리합니다.

**발표자 노트:** 개선 포인트 이 다섯 단계가 뒤에서 CLAUDE.md, Skill, Hook, Evaluation으로 분리됩니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “더 똑똑하라고 하지 말고 절차를 만듭니다”입니다. 읽기 → 계획 → 수정 → 검증 → 보고는 AI가 지나가야 하는 최소 작업선입니다.
화면에서는 읽기: 관련 파일과 현재 상태를 확인합니다. / 검증: 테스트와 화면으로 완료를 증명합니다. / 보고: 바꾼 것과 남은 위험을 분리합니다.를 먼저 짚습니다. 이때 핵심 용어는 Hook, Skill, Evaluation, CLAUDE.md이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 뒤에서 배울 레이어들이 어떤 실패를 막는지 먼저 몸으로 이해시키는 데 있습니다. 다음 장 “반복 실패는 다음 하네스 후보입니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 14 / 02-6-improvement-turn-failure-into-rule

- file: `02-6-improvement-turn-failure-into-rule.html`
- section: 실패 패턴 (7/8)
- kind: main
- contentHash: `sha256:2c4f68c049552a5f0f7114b45d89f31edadeb209aab4a4a72c8d021aff1c5bfa`

### 슬라이드 화면 내용

**제목:** 반복 실패는 다음 하네스 후보입니다

**부제:** AI가 두 번 이상 틀린 행동은 대화 피드백으로 남기지 말고 구조로 올립니다.

**불릿:**
- 반복 지시: CLAUDE.md로 올립니다.
- 반복 절차: Skill로 올립니다.
- 강제 검증: Hook과 Evaluation으로 올립니다.

**발표자 노트:** 다음 전환 이제부터 각 레이어는 이 실패들을 막는 위치로 설명합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “반복 실패는 다음 하네스 후보입니다”입니다. AI가 두 번 이상 틀린 행동은 대화 피드백으로 남기지 말고 구조로 올립니다.
화면에서는 반복 지시: CLAUDE.md로 올립니다. / 반복 절차: Skill로 올립니다. / 강제 검증: Hook과 Evaluation으로 올립니다.를 먼저 짚습니다. 이때 핵심 용어는 Hook, Skill, Evaluation, CLAUDE.md이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 뒤에서 배울 레이어들이 어떤 실패를 막는지 먼저 몸으로 이해시키는 데 있습니다. 다음 장 “반복 실패는 어느 하네스로 올릴지 결정합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 15 / 02-7-failure-to-harness-decision

- file: `02-7-failure-to-harness-decision.html`
- section: 실패 패턴 (8/8)
- kind: main
- contentHash: `sha256:ab19e8aa94426990975cb8049da89323890da3d049b5650736acd55b843faa99`

### 슬라이드 화면 내용

**제목:** 반복 실패는 어느 하네스로 올릴지 결정합니다

**부제:** 같은 피드백을 두 번 했다면 다음에는 구조로 막아야 합니다.

**불릿:**
- 반복 지시: CLAUDE.md
- 반복 절차: Skill
- 반복 역할: Subagent
- 강제 검증: Hook 또는 Evaluation

**발표자 노트:** 발표 포인트 같은 피드백을 두 번 했다면 다음에는 구조로 막아야 합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 슬라이드는 실패 패턴 섹션의 결론이자 다음 섹션으로 넘어가는 다리입니다.
반복 지시는 CLAUDE.md, 반복 절차는 Skill, 반복 판단은 Subagent, 외부 확인은 MCP, 무조건 실행할 검증은 Hook이나 Evaluation으로 올린다는 분류 기준을 여기서 고정합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Model Context Protocol Server Features (slide)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 16 / 13-spec-driven

- file: `13-spec-driven.html`
- section: Spec / Prompt (1/17)
- kind: main
- contentHash: `sha256:5713fd0526dc542e094293c33fe00d983cc3e576a350e15d9d513672f70cc47a`

### 슬라이드 화면 내용

**제목:** 명세 기반 작업은 즉흥 구현의 반대편입니다

**부제:** 대화 속 계획이 아니라 파일로 남는 계약을 먼저 만듭니다.

**불릿:**
- 명세: 무엇을 만들지 합의합니다.
- 계획: 어떻게 만들지 쪼갭니다.
- 검토: 요구사항과 결과를 대조합니다.

**발표자 노트:** 강의 연결 Superpowers의 brainstorming과 writing-plans는 명세 기반 흐름의 좋은 사례입니다.

**미디어/시각자료:** `assets/handdrawn/05-spec.png`

### 발표 스크립트

이 섹션은 즉흥적인 대화 구현에서 파일로 남는 합의로 넘어가는 전환점입니다.
목표, 비목표, 제약, 완료 기준을 먼저 고정하면 이후 prompt, few-shot, review, evaluation이 모두 같은 기준을 바라보게 됩니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 17 / 13-1-vibe-vs-spec

- file: `13-1-vibe-vs-spec.html`
- section: Spec / Prompt (2/17)
- kind: example
- contentHash: `sha256:8974bd9fd9b3becf1e2524c749b4fa3e0c2edea6814cdfab1c26aa69cb93b147`

### 슬라이드 화면 내용

**제목:** 명세 기반 작업은 즉흥 구현을 줄입니다

**부제:** 대화 속 감각이 아니라 파일로 남는 합의를 먼저 만듭니다.

**불릿:**
- 느낌 구현: 중간 가정이 쉽게 바뀝니다.
- 명세 기반: 목표와 제외 범위를 먼저 잠급니다.
- 리뷰 때 결과를 기준과 대조할 수 있습니다.

**발표자 노트:** 발표 포인트 대화 속 감각이 아니라 파일로 남는 합의를 먼저 만듭니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “명세 기반 작업은 즉흥 구현을 줄입니다”입니다. 대화 속 감각이 아니라 파일로 남는 합의를 먼저 만듭니다.
화면에서는 느낌 구현: 중간 가정이 쉽게 바뀝니다. / 명세 기반: 목표와 제외 범위를 먼저 잠급니다. / 리뷰 때 결과를 기준과 대조할 수 있습니다.를 먼저 짚습니다. 대본은 화면의 제목, 보조 문장, 발표 포인트를 같은 순서로 따라가며 설명합니다.
발표자는 이 내용을 AI가 빨리 만들수록 먼저 무엇을 만들지 계약으로 고정해야 한다는 점을 보여 주는 데 있습니다. 다음 장 “좋은 명세는 네 가지를 고정합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/hooks: https://docs.anthropic.com/en/docs/claude-code/hooks
- Claude Code Subagents (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/sub-agents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code Skills (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Claude Code Memory (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/memory: https://docs.anthropic.com/en/docs/claude-code/memory
- Model Context Protocol Server Features (deck-global)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- OpenAI Evaluation Best Practices (deck-global)
  - https://developers.openai.com/api/docs/guides/evaluation-best-practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices

---

## Slide 18 / 13-2-spec-contract

- file: `13-2-spec-contract.html`
- section: Spec / Prompt (3/17)
- kind: main
- contentHash: `sha256:dc0d6f96594b19954190fa15c9b6a687f8ac2762b0951c75f5d9aafce453208e`

### 슬라이드 화면 내용

**제목:** 좋은 명세는 네 가지를 고정합니다

**부제:** 목표, 제외 범위, 제약, 통과 기준이 구현의 난간이 됩니다.

**불릿:**
- 목표: 무엇을 달성하는가
- 제외 범위: 지금 하지 않는 것
- 제약: 반드시 지켜야 할 조건
- 통과 기준: 완료를 확인하는 증거

**발표자 노트:** 발표 포인트 목표, 제외 범위, 제약, 통과 기준이 구현의 난간이 됩니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “좋은 명세는 네 가지를 고정합니다”입니다. 목표, 제외 범위, 제약, 통과 기준이 구현의 난간이 됩니다.
화면에서는 목표: 무엇을 달성하는가 / 제외 범위: 지금 하지 않는 것 / 제약: 반드시 지켜야 할 조건 / 통과 기준: 완료를 확인하는 증거를 먼저 짚습니다. 대본은 화면의 제목, 보조 문장, 발표 포인트를 같은 순서로 따라가며 설명합니다.
발표자는 이 내용을 AI가 빨리 만들수록 먼저 무엇을 만들지 계약으로 고정해야 한다는 점을 보여 주는 데 있습니다. 다음 장 “나쁜 spec은 해석을 남기고, 좋은 spec은 확인을 남깁니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 19 / 13-3-spec-bad-good

- file: `13-3-spec-bad-good.html`
- section: Spec / Prompt (4/17)
- kind: example
- contentHash: `sha256:a1367db824691da45f648bfa59036705a08fd0fd5efd44cc5e4681c580536e95`

### 슬라이드 화면 내용

**제목:** 나쁜 spec은 해석을 남기고, 좋은 spec은 확인을 남깁니다

**부제:** 구현자가 바뀌어도 같은 결과를 낼 수 있어야 합니다.

**불릿:**
- 나쁨: “로그인 UX 개선”
- 좋음: “오류 메시지, 재시도, 테스트 기준”
- 좋은 spec은 완료 증거까지 포함합니다.

**발표자 노트:** 발표 포인트 구현자가 바뀌어도 같은 결과를 낼 수 있어야 합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “나쁜 spec은 해석을 남기고, 좋은 spec은 확인을 남깁니다”입니다. 구현자가 바뀌어도 같은 결과를 낼 수 있어야 합니다.
화면에서는 나쁨: “로그인 UX 개선” / 좋음: “오류 메시지, 재시도, 테스트 기준” / 좋은 spec은 완료 증거까지 포함합니다.를 먼저 짚습니다. 이때 핵심 용어는 Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 AI가 빨리 만들수록 먼저 무엇을 만들지 계약으로 고정해야 한다는 점을 보여 주는 데 있습니다. 다음 장 “Spec은 plan과 review로 이어져야 합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 20 / 13-4-spec-plan-review-flow

- file: `13-4-spec-plan-review-flow.html`
- section: Spec / Prompt (5/17)
- kind: workflow
- contentHash: `sha256:4bed9bef89c9cdaa48735fc26970dc4fbffdc4faab6adefcd947a090866e4289`

### 슬라이드 화면 내용

**제목:** Spec은 plan과 review로 이어져야 합니다

**부제:** 문서는 만들고 끝나는 것이 아니라 실행과 검토의 기준으로 쓰입니다.

**불릿:**
- Spec: 요구와 제약
- Plan: 작업 순서
- Execution: 작은 변경
- Review: 기준 대조

**발표자 노트:** 발표 포인트 문서는 만들고 끝나는 것이 아니라 실행과 검토의 기준으로 쓰입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “Spec은 plan과 review로 이어져야 합니다”입니다. 문서는 만들고 끝나는 것이 아니라 실행과 검토의 기준으로 쓰입니다.
화면에서는 Spec: 요구와 제약 / Plan: 작업 순서 / Execution: 작은 변경 / Review: 기준 대조를 먼저 짚습니다. 대본은 화면의 제목, 보조 문장, 발표 포인트를 같은 순서로 따라가며 설명합니다.
발표자는 이 내용을 AI가 빨리 만들수록 먼저 무엇을 만들지 계약으로 고정해야 한다는 점을 보여 주는 데 있습니다. 다음 장 “프롬프트도 하네스입니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/hooks: https://docs.anthropic.com/en/docs/claude-code/hooks
- Claude Code Subagents (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/sub-agents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code Skills (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Claude Code Memory (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/memory: https://docs.anthropic.com/en/docs/claude-code/memory
- Model Context Protocol Server Features (deck-global)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- OpenAI Evaluation Best Practices (deck-global)
  - https://developers.openai.com/api/docs/guides/evaluation-best-practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices

---

## Slide 21 / 04-prompt-layer

- file: `04-prompt-layer.html`
- section: Spec / Prompt (6/17)
- kind: main
- contentHash: `sha256:3d60792550cada962739075840d6dc64538fdefd4efb1c044ca57d6a21b883ea`

### 슬라이드 화면 내용

**제목:** 프롬프트도 하네스입니다

**부제:** 페르소나, 퓨샷, 출력 형식, XML 태그는 가장 안쪽의 제어 장치입니다.

**불릿:**
- 한 번만 필요한 지시는 프롬프트에 둡니다.
- 반복되면 CLAUDE.md나 Skill로 올립니다.
- 강제 실행이 필요하면 Hook으로 올립니다.

**발표자 노트:** 출처 Anthropic은 예시와 명확한 구분자를 권장하고, 추론형 모델은 간결한 직접 지시를 선호합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

프롬프트 엔지니어링은 하네스 엔지니어링과 경쟁하는 개념이 아닙니다. 오히려 하네스의 가장 작은 단위입니다. 한 번만 필요한 지시는 프롬프트에 둡니다. 예를 들어 “이번 답변은 표로 정리해줘”, “이 코드만 리뷰해줘”, “보안 관점만 봐줘” 같은 요청은 그 순간의 프롬프트로 충분합니다.
하지만 같은 말을 계속 반복하게 되면 문제가 달라집니다. 매번 “테스트 실패를 숨기지 마”, “파일을 읽고 수정해”, “리뷰에서는 칭찬보다 결함을 먼저 말해”라고 입력하고 있다면, 그건 프롬프트가 아니라 시스템 규칙이나 Skill로 승격해야 할 후보입니다. 반복되는 지시는 기억으로, 반복되는 절차는 Skill로, 반복되는 역할은 Subagent로, 반드시 실행되어야 하는 일은 Hook으로 올립니다.
프롬프트 레이어에서 중요한 것은 네 가지입니다. 첫째, 역할을 부여할 때는 이름보다 판단 기준을 줍니다. 둘째, few-shot은 지식 전달보다 출력 형식 고정에 씁니다. 셋째, XML 태그나 명확한 구분자로 instructions, context, examples, input을 나눕니다. 넷째, 최신 reasoning 모델에는 불필요한 “think step by step”보다 간결한 목표와 검증 기준이 더 잘 맞는 경우가 많습니다. 이 장에서는 반복 지시가 CLAUDE.md 같은 프로젝트 기억으로 올라갈 수 있다는 점도 함께 짚어, 프롬프트와 기억의 경계를 분리합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 22 / 04-1-prompt-anatomy

- file: `04-1-prompt-anatomy.html`
- section: Spec / Prompt (7/17)
- kind: main
- contentHash: `sha256:cfdee082c7919fe40b5ae89209dd41d9b91414f1272f4ceb912e02cb1edf61aa`

### 슬라이드 화면 내용

**제목:** 좋은 요청은 여섯 칸으로 나눌 수 있습니다

**부제:** 목표, 증상, 파일, 제한, 검증, 보고 형식을 분리합니다.

**불릿:**
- AI가 추측할 빈칸을 줄입니다.
- 검증 방법을 먼저 지정합니다.
- 최종 보고 형식을 정하면 완료 기준이 선명해집니다.

**발표자 노트:** 발표 포인트 목표, 증상, 파일, 제한, 검증, 보고 형식을 분리합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “좋은 요청은 여섯 칸으로 나눌 수 있습니다”입니다. 목표, 증상, 파일, 제한, 검증, 보고 형식을 분리합니다.
화면에서는 AI가 추측할 빈칸을 줄입니다. / 검증 방법을 먼저 지정합니다. / 최종 보고 형식을 정하면 완료 기준이 선명해집니다.를 먼저 짚습니다. 이때 핵심 용어는 Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 프롬프트를 버리는 것이 아니라 더 큰 하네스로 승격되는 출발점으로 보는 데 있습니다. 다음 장 “입력 경계가 선명하면 모델의 오독이 줄어듭니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 23 / 04-2-xml-boundaries

- file: `04-2-xml-boundaries.html`
- section: Spec / Prompt (8/17)
- kind: main
- contentHash: `sha256:c6aaa9a588fd9b11c59a3c30435da58a8ba21d0989ff76b5de7e722e2e661115`

### 슬라이드 화면 내용

**제목:** 입력 경계가 선명하면 모델의 오독이 줄어듭니다

**부제:** 긴 요청은 XML이나 섹션 제목으로 역할을 나눕니다.

**불릿:**
- 지시와 참고 자료를 분리합니다.
- 출력 형식을 별도 블록으로 둡니다.
- 코드와 요구사항이 섞이지 않게 합니다.

**발표자 노트:** 발표 포인트 긴 요청은 XML이나 섹션 제목으로 역할을 나눕니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “입력 경계가 선명하면 모델의 오독이 줄어듭니다”입니다. 긴 요청은 XML이나 섹션 제목으로 역할을 나눕니다.
화면에서는 지시와 참고 자료를 분리합니다. / 출력 형식을 별도 블록으로 둡니다. / 코드와 요구사항이 섞이지 않게 합니다.를 먼저 짚습니다. 이때 핵심 용어는 Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 프롬프트를 버리는 것이 아니라 더 큰 하네스로 승격되는 출발점으로 보는 데 있습니다. 다음 장 “페르소나는 역할보다 판단 기준이 중요합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 24 / 05-persona

- file: `05-persona.html`
- section: Spec / Prompt (9/17)
- kind: main
- contentHash: `sha256:ef2463b30499c1822029309e0602955b2ff62ab5fe935c19b2188f9840791f55`

### 슬라이드 화면 내용

**제목:** 페르소나는 역할보다 판단 기준이 중요합니다

**부제:** “시니어 리뷰어”보다 “버그, 회귀, 테스트 누락을 우선순위로 보라”가 더 안정적입니다.

**불릿:**
- 없음

**발표자 노트:** 승격 기준 매번 쓰는 페르소나는 Subagent나 Skill로 옮깁니다.

**미디어/시각자료:** 없음

### 발표 스크립트

페르소나 부여는 여전히 유용합니다. 다만 “너는 시니어 개발자야”처럼 역할 이름만 주는 방식은 효과가 제한적입니다. 모델은 시니어 개발자라는 말에서 어느 정도 톤과 관점을 추론할 수 있지만, 우리가 원하는 판단 기준까지 항상 정확히 맞추지는 못합니다. 그래서 페르소나는 이름보다 우선순위가 중요합니다.
예를 들어 코드 리뷰를 시킬 때 “너는 시니어 코드 리뷰어다”라고만 말하면, 모델은 코드 스타일, 가독성, 칭찬, 개선 제안을 섞어서 줄 수 있습니다. 하지만 우리가 원하는 것이 결함 탐지라면 이렇게 말해야 합니다. “칭찬보다 결함을 먼저 말한다. 우선순위는 correctness bug, regression, missing test, risky assumption 순서다. 파일과 라인을 포함한다. 요약은 findings 뒤에 둔다.” 이렇게 하면 역할이 아니라 판단 기준이 생깁니다.
반복되는 페르소나는 더 이상 프롬프트로 둘 필요가 없습니다. 매번 코드 리뷰어 역할을 부여한다면 code-reviewer Subagent로 만들 수 있습니다. 매번 같은 리뷰 순서를 요구한다면 code-review Skill로 만들 수 있습니다. 이 컷의 핵심은 페르소나는 시작점이고, 반복되면 하네스의 상위 레이어로 승격해야 한다는 것입니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 25 / 05-1-persona-weak

- file: `05-1-persona-weak.html`
- section: Spec / Prompt (10/17)
- kind: main
- contentHash: `sha256:00e83f20443f3b7920cc1d1b37e66bf10591e902f3cd2e64f361cb6ce25c162a`

### 슬라이드 화면 내용

**제목:** “시니어처럼”은 너무 넓은 지시입니다

**부제:** 역할 이름만 주면 무엇을 우선해야 하는지 불명확합니다.

**불릿:**
- 시니어의 기준은 사람마다 다릅니다.
- 모델은 역할을 문체로 해석할 수 있습니다.
- 우선순위를 명시해야 리뷰 품질이 올라갑니다.

**발표자 노트:** 발표 포인트 역할 이름만 주면 무엇을 우선해야 하는지 불명확합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 ““시니어처럼”은 너무 넓은 지시입니다”입니다. 역할 이름만 주면 무엇을 우선해야 하는지 불명확합니다.
화면에서는 시니어의 기준은 사람마다 다릅니다. / 모델은 역할을 문체로 해석할 수 있습니다. / 우선순위를 명시해야 리뷰 품질이 올라갑니다.를 먼저 짚습니다. 대본은 화면의 제목, 보조 문장, 발표 포인트를 같은 순서로 따라가며 설명합니다.
발표자는 이 내용을 역할 이름보다 판단 기준과 우선순위가 중요하다는 감각을 주는 데 있습니다. 다음 장 “Persona는 역할보다 판단 기준으로 씁니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/hooks: https://docs.anthropic.com/en/docs/claude-code/hooks
- Claude Code Subagents (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/sub-agents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code Skills (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Claude Code Memory (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/memory: https://docs.anthropic.com/en/docs/claude-code/memory
- Model Context Protocol Server Features (deck-global)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- OpenAI Evaluation Best Practices (deck-global)
  - https://developers.openai.com/api/docs/guides/evaluation-best-practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices

---

## Slide 26 / 05-2-persona-rubric

- file: `05-2-persona-rubric.html`
- section: Spec / Prompt (11/17)
- kind: main
- contentHash: `sha256:b5bce262f1bdec13bd1191ff7a7640cbc56f08984661532835c2a9291eadc88d`

### 슬라이드 화면 내용

**제목:** 페르소나는 역할보다 판단 기준으로 씁니다

**부제:** 좋은 페르소나는 무엇을 먼저 볼지 알려 줍니다.

**불릿:**
- P1: 실제 장애 가능성
- P2: 회귀와 누락 테스트
- P3: 유지보수 위험
- 칭찬보다 결함을 먼저 보고합니다.

**발표자 노트:** 발표 포인트 좋은 페르소나는 무엇을 먼저 볼지 알려 줍니다.

**미디어/시각자료:** 없음

### 발표 스크립트

여기서 페르소나는 “시니어처럼 말해 줘” 같은 역할 이름이 아닙니다. 무엇을 먼저 보고, 어떤 위험을 더 크게 볼지 정하는 판단 기준입니다.
리뷰어 페르소나라면 P1은 실제 장애 가능성, P2는 회귀와 누락 테스트, P3는 유지보수 위험입니다. 이렇게 우선순위를 주면 모델은 칭찬이나 일반 조언보다 결함과 영향부터 보고합니다.
이 기준이 반복되면 매번 프롬프트에 붙이지 말고 Skill이나 Subagent 기준으로 승격할 수 있습니다. 다음 few-shot 장에서는 이런 기준을 말로 설명하는 대신 예시 출력 모양으로 고정하는 방법을 봅니다.

### 출처

- Claude Code Hooks (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/hooks: https://docs.anthropic.com/en/docs/claude-code/hooks
- Claude Code Subagents (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/sub-agents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code Skills (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Claude Code Memory (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/memory: https://docs.anthropic.com/en/docs/claude-code/memory
- Model Context Protocol Server Features (deck-global)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- OpenAI Evaluation Best Practices (deck-global)
  - https://developers.openai.com/api/docs/guides/evaluation-best-practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices

---

## Slide 27 / 06-few-shot

- file: `06-few-shot.html`
- section: Spec / Prompt (12/17)
- kind: main
- contentHash: `sha256:ccddba930820b1b13979ad36f147a3fc30114db5bae2e9b9c858518c4708d13f`

### 슬라이드 화면 내용

**제목:** Few-shot은 답변 모양을 고정합니다

**부제:** 좋은 예시와 나쁜 예시를 짧게 주면 톤, 깊이, 형식이 안정됩니다.

**불릿:**
- 없음

**발표자 노트:** 주의 최신 추론형 모델에는 필요할 때만 예시를 주고, 불필요한 추론 유도 문구는 줄입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

Few-shot prompting은 모델에게 새로운 지식을 많이 가르치는 용도라기보다, 우리가 원하는 답변의 모양을 보여 주는 데 강합니다. 특히 리뷰, 요약, 분류, 보고서처럼 출력 형식이 중요한 작업에서 효과가 큽니다. 좋은 예시 하나만 있어도 모델은 제목 길이, 세부 설명의 깊이, 파일 경로를 넣는 방식, 우선순위 표기 방식을 따라 하려는 경향이 있습니다.
좋은 few-shot은 길지 않아야 합니다. 예를 들어 코드 리뷰에서는 좋은 리뷰 예시와 나쁜 리뷰 예시를 하나씩 보여 주면 충분할 수 있습니다. 좋은 예시는 “[P1] 결제 실패 시 주문 상태가 pending으로 남습니다. 파일: src/payment.ts. 이유: catch 블록에서 rollback이 없습니다.”처럼 구체적입니다. 나쁜 예시는 “코드가 좀 복잡합니다”처럼 판단 기준도, 위치도, 영향도 없는 문장입니다.
주의할 점도 있습니다. 모든 요청에 few-shot을 붙이면 컨텍스트가 무거워집니다. 예시가 자주 반복된다면 프롬프트 안에 계속 붙이지 말고 Skill의 references로 옮기는 것이 좋습니다. 그러면 필요할 때만 예시가 열리고, 평소에는 Skill description만 가볍게 유지됩니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)

---

## Slide 28 / 06-1-good-few-shot

- file: `06-1-good-few-shot.html`
- section: Spec / Prompt (13/17)
- kind: example
- contentHash: `sha256:0d5b0f8a838305052f579e5d6fc88c0e94ad3d8bbe762e765807b7e868193428`

### 슬라이드 화면 내용

**제목:** 좋은 few-shot은 슬라이드 명세의 완성도를 보여 줍니다

**부제:** HTML/CSS deck 자동화에서는 원하는 명세의 깊이와 검증 기준을 예시로 고정합니다.

**불릿:**
- 원본, 레이아웃, 시각 기준, 검증 기준을 한 덩어리로 보여 줍니다.
- 필드 이름과 작성 깊이를 그대로 따라오게 합니다.
- 예시는 많기보다 산출물과 가까워야 합니다.

**발표자 노트:** 발표 포인트 좋은 few-shot은 “이 정도로 써라”를 말로 설명하지 않고 실제 슬라이드 명세 모양으로 보여 줍니다.

**미디어/시각자료:** 없음

### 발표 스크립트

HTML/CSS deck 자동화에서 few-shot은 “예쁘게 만들어 줘”가 아니라 산출물의 깊이를 보여 주는 기준 샘플입니다. 좋은 예시는 원본, 레이아웃, 시각 기준, 검증 기준을 한 덩어리로 보여 줍니다.
중요한 것은 예시의 개수보다 산출물과의 거리입니다. 실제 `slide-spec.json`에 들어갈 필드 이름, 작성 깊이, 검증 명령을 그대로 보여 주면 모델은 제목만 흉내 내지 않고 결과물의 구조까지 따라옵니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 29 / 06-2-bad-few-shot

- file: `06-2-bad-few-shot.html`
- section: Spec / Prompt (14/17)
- kind: example
- contentHash: `sha256:e43d631597a1ec50415d1694fe48c1d4e97047299bca7909f3a7bbfaa3f1daf1`

### 슬라이드 화면 내용

**제목:** 나쁜 few-shot은 나쁜 슬라이드 명세까지 복제합니다

**부제:** 모호한 예시는 HTML/CSS deck에서도 모호한 제목, 느슨한 레이아웃, 빠진 검증으로 이어집니다.

**불릿:**
- “보기 좋게”는 명세가 아니라 취향 요청입니다.
- 검증 없는 예시는 완료 기준을 만들지 못합니다.
- 나쁜 예시도 재사용되므로 실패 모양을 분명히 표시합니다.

**발표자 노트:** 발표 포인트 few-shot에는 좋은 예시뿐 아니라 피해야 할 슬라이드 명세도 짧게 넣어야 모델이 경계를 압니다.

**미디어/시각자료:** 없음

### 발표 스크립트

나쁜 few-shot은 나쁜 결과물도 같이 복제합니다. “멋진 슬라이드로 작성”처럼 취향만 있는 예시는 모호한 제목, 느슨한 레이아웃, 빠진 검증으로 이어집니다.
그래서 few-shot에는 좋은 예시뿐 아니라 피해야 할 슬라이드 명세도 짧게 넣습니다. 모델에게 “이런 모양은 실패”라는 경계를 보여 줘야 검증 없는 산출물이 반복되지 않습니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 30 / 07-reasoning-prompts

- file: `07-reasoning-prompts.html`
- section: Spec / Prompt (15/17)
- kind: main
- contentHash: `sha256:00f158e6c27e3671ae1d063b31a68c1d8300f666c66977db0318d0b73543268f`

### 슬라이드 화면 내용

**제목:** “단계별로 생각해”를 남발하지 않습니다

**부제:** 요즘 추론형 모델에는 생각 지시보다 명확한 요청과 확인 기준이 더 중요합니다.

**불릿:**
- 목표와 조건을 포함해 명확하게 요청합니다.
- 결과가 흔들릴 때만 예시를 추가합니다.
- 체크리스트, 할 일 목록, 검증 목록처럼 기준을 제시합니다.

**발표자 노트:** 원문 Let's think step by step

**미디어/시각자료:** 없음

### 발표 스크립트

이 슬라이드의 핵심은 “생각을 길게 해”라는 말보다 작업 조건을 분명하게 주는 편이 더 실무적이라는 점입니다.
먼저 목표와 조건을 포함해 명확하게 요청합니다. 결과가 원하는 모양으로 나오지 않을 때만 예시를 추가합니다. 그리고 체크리스트, 할 일 목록, 검증 목록처럼 모델이 따라갈 기준을 제시합니다.
원문으로는 “Let's think step by step”이라는 표현이 널리 쓰였지만, 최신 추론형 모델에서는 이 문구를 습관처럼 붙이기보다 무엇을 하고, 무엇으로 확인하고, 어떻게 보고할지를 정해 주는 것이 더 안정적입니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 31 / 07-1-reasoning-output-pattern

- file: `07-1-reasoning-output-pattern.html`
- section: Spec / Prompt (16/17)
- kind: main
- contentHash: `sha256:1b8490ed3bf401d020d4c58795bbd724f7445c692af68b0e347014d42091257a`

### 슬라이드 화면 내용

**제목:** 결과 기준을 선명하게 요구합니다

**부제:** 무엇을 만들고, 무엇으로 확인하고, 어떻게 보고할지를 정해 줍니다.

**불릿:**
- 최종 결과물의 모양을 먼저 정합니다.
- 중간 확인 지점과 통과 기준을 적습니다.
- 마지막 보고에 증거와 남은 위험을 포함시킵니다.

**발표자 노트:** 발표 포인트 생각 과정을 길게 요구하기보다 결과물, 확인 방법, 보고 기준을 선명하게 줍니다.

**미디어/시각자료:** 없음

### 발표 스크립트

앞 슬라이드가 좋은 요청의 기본 구조였다면, 이 슬라이드는 결과 기준을 더 구체화합니다.
오른쪽 예시는 결과물, 확인 지점, 통과 기준, 보고 형식, 남은 위험을 한 요청 안에 넣는 방식입니다. 이렇게 해야 답변이 그럴듯한 설명에서 끝나지 않고 검증 가능한 작업 결과가 됩니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 32 / 07-2-reasoning-avoid-overask

- file: `07-2-reasoning-avoid-overask.html`
- section: Spec / Prompt (17/17)
- kind: main
- contentHash: `sha256:7e53018ae1a9452e112efde9cac055c0773d8553388be80f9ec64e6b5f7d69c9`

### 슬라이드 화면 내용

**제목:** 작업 성격에 따라 요청 강도를 조절합니다

**부제:** 모든 요청에 예시, 계획, 검증을 똑같이 붙일 필요는 없습니다.

**불릿:**
- 간단한 일은 목표만 선명하면 충분합니다.
- 형식이 중요한 일은 예시를 붙입니다.
- 위험한 일은 검증 목록과 보고 기준을 붙입니다.

**발표자 노트:** 발표 포인트 요청을 무겁게 만드는 것이 목표가 아니라, 작업 위험에 맞게 필요한 기준만 붙이는 것이 목표입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

앞의 두 슬라이드가 좋은 요청의 구성 요소를 설명했다면, 이 슬라이드는 언제 얼마나 붙일지를 정리합니다.
간단한 일에는 목표만 선명하게 줘도 충분합니다. 출력 형식이 중요한 일에는 예시를 붙이고, 장애나 데이터 변경처럼 위험한 일에는 검증 목록과 보고 기준을 붙입니다. 모르는 것이 많은 일은 바로 시키기보다 질문이나 조사를 먼저 요청합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 33 / 08-claude-md

- file: `08-claude-md.html`
- section: Context / Memory (1/8)
- kind: main
- contentHash: `sha256:bf534c89a722f8a79ccf07674c3b502fda9edf3d2d3a5a89b027095ffc6268e9`

### 슬라이드 화면 내용

**제목:** CLAUDE.md는 항상 켜진 기억입니다

**부제:** 세션마다 반복해서 말해야 하는 프로젝트 규칙, 명령, 예외만 넣습니다.

**불릿:**
- 없음

**발표자 노트:** 팁 긴 API 문서나 업무 매뉴얼은 CLAUDE.md가 아니라 Skill reference로 분리합니다.

**미디어/시각자료:** `assets/handdrawn/03-context.png`

### 발표 스크립트

이제 Prompt Layer에서 Memory Layer로 올라갑니다. CLAUDE.md는 Claude가 프로젝트에서 항상 참고하는 기억입니다. 팀이 매번 반복해서 설명하는 규칙을 여기에 넣습니다. 예를 들어 “파일을 수정하기 전에 기존 파일을 읽어라”, “테스트 실패를 skip하지 마라”, “커밋은 요청받을 때만 해라”, “이 프로젝트는 pnpm을 쓴다” 같은 규칙입니다.
하지만 CLAUDE.md는 길게 쓸수록 좋아지는 파일이 아닙니다. 항상 로드되는 기억이기 때문에, 여기에 너무 많은 내용을 넣으면 모든 요청에 불필요한 정보가 따라다닙니다. 그러면 모델이 중요한 규칙을 놓치거나, 컨텍스트 비용이 커지거나, 서로 충돌하는 지시가 생길 수 있습니다. 그래서 CLAUDE.md에는 항상 필요한 규칙만 넣어야 합니다.
좋은 기준은 이것입니다. “이 내용을 다음 20번의 요청에서도 거의 항상 알아야 하는가?” 그렇다면 CLAUDE.md 후보입니다. “가끔 특정 작업에서만 필요한가?” 그렇다면 Skill이나 reference 후보입니다. “실제로 반드시 실행돼야 하는가?” 그렇다면 Hook 후보입니다. 이렇게 나누면 CLAUDE.md가 프로젝트 헌법처럼 작동합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)

---

## Slide 34 / 08-1-claude-md-hierarchy

- file: `08-1-claude-md-hierarchy.html`
- section: Context / Memory (2/8)
- kind: main
- contentHash: `sha256:2e35a9931f4e5ec0f9e5b9c05957e2491708d9dcb47b2bc9e98a32efd6afb53a`

### 슬라이드 화면 내용

**제목:** 프로젝트 기억은 계층으로 로드됩니다

**부제:** global, project, local 규칙의 범위를 분리해야 충돌이 줄어듭니다.

**불릿:**
- Global: 개인 작업 원칙
- Project: 저장소 규칙
- Local: 현재 작업 임시 기준
- 깊은 위치의 규칙이 더 구체적입니다.

**발표자 노트:** 발표 포인트 global, project, local 규칙의 범위를 분리해야 충돌이 줄어듭니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “프로젝트 기억은 계층으로 로드됩니다”입니다. global, project, local 규칙의 범위를 분리해야 충돌이 줄어듭니다.
화면에서는 Global: 개인 작업 원칙 / Project: 저장소 규칙 / Local: 현재 작업 임시 기준 / 깊은 위치의 규칙이 더 구체적입니다.를 먼저 짚습니다. 대본은 화면의 제목, 보조 문장, 발표 포인트를 같은 순서로 따라가며 설명합니다.
발표자는 이 내용을 항상 로드되는 프로젝트 기억과 필요할 때 여는 절차를 분리하는 데 있습니다. 다음 장 “Deck automation용 CLAUDE.md는 작업 순서를 고정합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)

---

## Slide 35 / 08-2-good-claude-md

- file: `08-2-good-claude-md.html`
- section: Context / Memory (3/8)
- kind: example
- contentHash: `sha256:b7751080964e81093d8b68e70bcef1081891f8017c7a9b4522da6a0ca721a068`

### 슬라이드 화면 내용

**제목:** Deck automation용 CLAUDE.md는 작업 순서를 고정합니다

**부제:** 항상 로드되는 규칙에는 산출물 순서, 수정 경계, 검증 명령만 남깁니다.

**불릿:**
- source → spec → few-shot → HTML 순서를 고정합니다.
- 새 슬라이드 대량 추가보다 기존 컷 리라이트를 우선합니다.
- 완료 보고는 command, result, risk를 포함합니다.

**발표자 노트:** 발표 포인트 CLAUDE.md는 긴 운영 매뉴얼이 아니라 deck 자동화가 매번 지켜야 하는 작업 레일입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

항상 로드되는 규칙에는 산출물 순서, 수정 경계, 검증 명령만 남깁니다.
source, spec, few-shot, HTML, verification, final report 순서를 고정하면 deck 작업이 대화 감각이 아니라 반복 가능한 절차로 바뀝니다. 여기서 CLAUDE.md는 매번 켜지는 프로젝트 기억이고, deck automation 절차를 흩어진 대화가 아니라 검증 가능한 순서로 고정하는 장치입니다.

### 출처

- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 36 / 08-3-bad-claude-md

- file: `08-3-bad-claude-md.html`
- section: Context / Memory (4/8)
- kind: example
- contentHash: `sha256:a9baa7860ed1ffbee7be05f2e9247a3ee1c2901ef71eae71e6fa69f0fd4d6ce8`

### 슬라이드 화면 내용

**제목:** 나쁜 CLAUDE.md는 오래된 규칙을 계속 주입합니다

**부제:** 너무 긴 기억은 모델의 주의를 흐리고 최신 목표와 충돌합니다.

**불릿:**
- 지난 결정이 계속 살아남습니다.
- 긴 문서는 중요한 규칙을 묻어 버립니다.
- 항상 필요한 것만 남겨야 합니다.

**발표자 노트:** 발표 포인트 너무 긴 기억은 모델의 주의를 흐리고 최신 목표와 충돌합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “나쁜 CLAUDE.md는 오래된 규칙을 계속 주입합니다”입니다. 너무 긴 기억은 모델의 주의를 흐리고 최신 목표와 충돌합니다.
화면에서는 지난 결정이 계속 살아남습니다. / 긴 문서는 중요한 규칙을 묻어 버립니다. / 항상 필요한 것만 남겨야 합니다.를 먼저 짚습니다. 이때 핵심 용어는 CLAUDE.md이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 항상 로드되는 프로젝트 기억과 필요할 때 여는 절차를 분리하는 데 있습니다. 다음 장 “이제는 컨텍스트 엔지니어링입니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)

---

## Slide 37 / 09-context-engineering

- file: `09-context-engineering.html`
- section: Context / Memory (5/8)
- kind: main
- contentHash: `sha256:fc0ec06508b3b9b304a46b0acde1fb78c7b88dc8477261351507ec0d81c88bc3`

### 슬라이드 화면 내용

**제목:** 이제는 컨텍스트 엔지니어링입니다

**부제:** 이번 답변보다, 여러 턴과 여러 도구 속에서도 올바르게 일하게 만드는 설계가 중요합니다.

**불릿:**
- 항상 필요한 정보만 CLAUDE.md에 둡니다.
- 가끔 필요한 지식은 Skill reference로 둡니다.
- 도구 설명과 MCP도 컨텍스트 비용입니다.

**발표자 노트:** 핵심 컨텍스트는 많을수록 좋은 것이 아니라, 필요한 순간에 필요한 만큼 들어와야 합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

요즘 AI 작업에서 자주 나오는 말이 컨텍스트 엔지니어링입니다. 프롬프트 엔지니어링이 이번 답변을 잘하게 만드는 기술이라면, 컨텍스트 엔지니어링은 여러 턴, 여러 파일, 여러 도구를 거치는 동안 AI가 필요한 정보를 잃지 않고 올바르게 일하게 만드는 설계입니다.
핵심은 정보를 많이 넣는 것이 아닙니다. 필요한 정보를 필요한 순간에 넣는 것입니다. CLAUDE.md는 항상 들어옵니다. Skill은 description만 먼저 보이고, 필요할 때 본문이 열립니다. Skill 안에서도 긴 예시나 API 문서는 references로 분리할 수 있습니다. MCP 도구도 마찬가지입니다. 연결된 도구가 많아질수록 도구 설명 자체가 컨텍스트를 차지합니다.
그래서 좋은 하네스는 progressive disclosure를 사용합니다. 먼저 아주 작은 메타데이터로 시작합니다. 필요할 때 절차를 열고, 더 필요할 때 reference를 열고, 실제 작업에 필요한 도구만 사용합니다. 수강생에게는 “컨텍스트는 창고가 아니라 작업대”라고 설명하면 좋습니다. 작업대 위에는 지금 필요한 도구만 올라와 있어야 합니다.

### 출처

- Model Context Protocol Server Features (slide)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)

---

## Slide 38 / 09-1-context-budget

- file: `09-1-context-budget.html`
- section: Context / Memory (6/8)
- kind: main
- contentHash: `sha256:a66f614777f9f69eda72bd3d862696f83e7f23d80561672d7d94565f908d2ab5`

### 슬라이드 화면 내용

**제목:** 컨텍스트는 무한한 창고가 아니라 작업대입니다

**부제:** 작업대 위에 너무 많이 올리면 필요한 증거가 묻힙니다.

**불릿:**
- 항상 필요한 기억은 작게 유지합니다.
- 큰 자료는 필요할 때만 엽니다.
- 도구 설명도 컨텍스트 비용입니다.

**발표자 노트:** 발표 포인트 작업대 위에 너무 많이 올리면 필요한 증거가 묻힙니다.

**미디어/시각자료:** 없음

### 발표 스크립트

컨텍스트는 무한한 창고가 아니라 지금 작업에 필요한 것을 올려 두는 작업대입니다. 작업대 위에 자료를 너무 많이 올리면 오히려 필요한 증거가 묻힙니다.
항상 필요한 기억은 작게 유지하고, 큰 자료는 필요할 때만 열어야 합니다. 도구 설명도 컨텍스트 비용이기 때문에 “연결할 수 있는 모든 도구”가 아니라 “이번 작업에 필요한 도구”만 열어야 합니다.
다음 장에서는 이 기준을 더 직접적으로 나눕니다. 항상 로드할 것과 필요할 때 열 것을 분리해야 하네스가 가벼워지고, 검토 에이전트도 필요한 증거만 보고 판단할 수 있습니다.

### 출처

- Claude Code Hooks (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/hooks: https://docs.anthropic.com/en/docs/claude-code/hooks
- Claude Code Subagents (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/sub-agents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code Skills (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Claude Code Memory (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/memory: https://docs.anthropic.com/en/docs/claude-code/memory
- Model Context Protocol Server Features (deck-global)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- OpenAI Evaluation Best Practices (deck-global)
  - https://developers.openai.com/api/docs/guides/evaluation-best-practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices

---

## Slide 39 / 09-2-always-vs-needed

- file: `09-2-always-vs-needed.html`
- section: Context / Memory (7/8)
- kind: example
- contentHash: `sha256:de7a65078ea10f4045e170fd11010474b529bfafe8d01124b9aac3c09d1c9f09`

### 슬라이드 화면 내용

**제목:** 항상 로드할 것과 필요할 때 열 것을 나눕니다

**부제:** 규칙은 항상, 절차와 긴 예시는 필요할 때 여는 편이 안정적입니다.

**불릿:**
- Always: 불변 원칙과 금지 사항
- Needed: 절차, 예시, 긴 레퍼런스
- Never: 오래된 실험 로그

**발표자 노트:** 발표 포인트 규칙은 항상, 절차와 긴 예시는 필요할 때 여는 편이 안정적입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “항상 로드할 것과 필요할 때 열 것을 나눕니다”입니다. 규칙은 항상, 절차와 긴 예시는 필요할 때 여는 편이 안정적입니다.
화면에서는 Always: 불변 원칙과 금지 사항 / Needed: 절차, 예시, 긴 레퍼런스 / Never: 오래된 실험 로그를 먼저 짚습니다. 이때 핵심 용어는 Skill이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 정보를 많이 넣는 것이 아니라 필요한 순간에 필요한 정보만 여는 기준을 잡는 데 있습니다. 다음 장 “완료 전 현재 목표와 컨텍스트를 다시 맞춥니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)

---

## Slide 40 / 09-3-context-drift-check

- file: `09-3-context-drift-check.html`
- section: Context / Memory (8/8)
- kind: main
- contentHash: `sha256:68cab29a768d91280a8717ffd8c3f468998342ced410bbf4505dd21ff288b1c9`

### 슬라이드 화면 내용

**제목:** 완료 전 현재 목표와 컨텍스트를 다시 맞춥니다

**부제:** 긴 대화일수록 마지막에 범위와 증거를 재확인해야 합니다.

**불릿:**
- 지금 목표가 무엇인가?
- 수정 범위가 어디까지인가?
- 폐기된 가정이 섞였는가?
- 검증 결과가 최신인가?

**발표자 노트:** 발표 포인트 긴 대화일수록 마지막에 범위와 증거를 재확인해야 합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

컨텍스트 섹션의 마무리는 “정보를 더 넣자”가 아니라 “지금 목표와 맞지 않는 오래된 가정을 걷어내자”입니다.
이 기준이 뒤의 Skill과 Handoff로 이어집니다. 필요한 절차는 Skill로 열고, 다음 세션에 남길 현재 상태는 Handoff로 고정합니다. 완료 전 검증은 지금 목표, 현재 파일 상태, 남은 위험이 서로 맞는지 확인하는 Evaluation의 입구로 연결됩니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 41 / 10-skills

- file: `10-skills.html`
- section: Skills / Superpowers (1/10)
- kind: main
- contentHash: `sha256:c7d05eca4960fc1e90f7f907880ee4e943b57b92b89468c6e8e9fd2b6db69759`

### 슬라이드 화면 내용

**제목:** Skill은 반복 절차의 매뉴얼입니다

**부제:** 프롬프트로 반복하던 일을 재사용 가능한 작업 방식으로 승격합니다.

**불릿:**
- description이 자동 호출 품질을 결정합니다.
- 본문은 짧고 절차 중심으로 둡니다.
- 검교정처럼 반복되는 리뷰도 Skill로 분리합니다.
- 긴 자료는 references로 분리합니다.

**발표자 노트:** 전환 기준 반복해서 쓰는 프롬프트와 검토 기준은 후반 실습에서 Skill 후보로 분류합니다.

**미디어/시각자료:** `assets/handdrawn/04-skills.png`

### 발표 스크립트

Skill은 반복 절차의 매뉴얼입니다. 항상 켜져 있어야 하는 규칙은 CLAUDE.md에 두고, 필요할 때 열면 되는 절차는 Skill로 분리합니다.
Skill에서 가장 중요한 것은 description, 본문, references의 역할입니다. description은 언제 이 Skill을 열지 결정하고, 본문은 짧은 절차를 담고, 긴 자료나 예시는 references로 분리합니다.
오늘 만든 한국어 검교정 리뷰도 같은 방식입니다. 문장 검토 기준, 발표자 스크립트 기준, 화면-대본 정합성 기준을 Skill로 만들면 다음 에이전트가 같은 절차로 검토를 반복할 수 있습니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)

---

## Slide 42 / 10-1-skill-trigger-description

- file: `10-1-skill-trigger-description.html`
- section: Skills / Superpowers (2/10)
- kind: main
- contentHash: `sha256:27cd89ff5d81c3fc8d27f717d38414c9bd31a6690e2fd182e72d688f5e145e8e`

### 슬라이드 화면 내용

**제목:** Skill의 description은 자동 호출 트리거입니다

**부제:** 좋은 description은 언제 이 Skill을 써야 하는지 명확히 말합니다.

**불릿:**
- 이름보다 description이 중요합니다.
- 트리거 조건을 구체적으로 씁니다.
- 너무 넓으면 엉뚱하게 호출됩니다.

**발표자 노트:** 발표 포인트 좋은 description은 언제 이 Skill을 써야 하는지 명확히 말합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “Skill의 description은 자동 호출 트리거입니다”입니다. 좋은 description은 언제 이 Skill을 써야 하는지 명확히 말합니다.
화면에서는 이름보다 description이 중요합니다. / 트리거 조건을 구체적으로 씁니다. / 너무 넓으면 엉뚱하게 호출됩니다.를 먼저 짚습니다. 이때 핵심 용어는 Skill이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 반복 프롬프트를 파일 기반 절차로 옮기는 기준을 익히는 데 있습니다. 다음 장 “Skill 본문은 짧은 절차여야 합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)

---

## Slide 43 / 10-2-skill-body-procedure

- file: `10-2-skill-body-procedure.html`
- section: Skills / Superpowers (3/10)
- kind: main
- contentHash: `sha256:e141e9b42ed9969a372a5d41ee6d3052ec5501ea580fa419570a7d6636447e9b`

### 슬라이드 화면 내용

**제목:** Skill 본문은 짧은 절차여야 합니다

**부제:** 설명서가 아니라 작업자가 따라갈 체크리스트에 가깝습니다.

**불릿:**
- 읽기 → 재현 → 원인 → 수정 → 검증
- 긴 배경 설명은 references로 이동합니다.
- 명령은 실행 목적과 함께 씁니다.

**발표자 노트:** 발표 포인트 설명서가 아니라 작업자가 따라갈 체크리스트에 가깝습니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “Skill 본문은 짧은 절차여야 합니다”입니다. 설명서가 아니라 작업자가 따라갈 체크리스트에 가깝습니다.
화면에서는 읽기 → 재현 → 원인 → 수정 → 검증 / 긴 배경 설명은 references로 이동합니다. / 명령은 실행 목적과 함께 씁니다.를 먼저 짚습니다. 이때 핵심 용어는 Skill, Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 반복 프롬프트를 파일 기반 절차로 옮기는 기준을 익히는 데 있습니다. 다음 장 “긴 자료와 실행 코드는 Skill 밖으로 분리합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 44 / 10-3-skill-references-scripts-assets

- file: `10-3-skill-references-scripts-assets.html`
- section: Skills / Superpowers (4/10)
- kind: main
- contentHash: `sha256:6ff823418851c9daeb0113769404c0ac84c9d8940728c41373439ea58f39ea58`

### 슬라이드 화면 내용

**제목:** 긴 자료와 실행 코드는 Skill 밖으로 분리합니다

**부제:** references, scripts, assets는 필요할 때만 여는 보조 자료입니다.

**불릿:**
- references: 긴 설명과 사례
- scripts: 반복 실행 코드
- assets: 템플릿과 이미지
- 본문은 길어지지 않게 유지합니다.

**발표자 노트:** 발표 포인트 references, scripts, assets는 필요할 때만 여는 보조 자료입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “긴 자료와 실행 코드는 Skill 밖으로 분리합니다”입니다. references, scripts, assets는 필요할 때만 여는 보조 자료입니다.
화면에서는 references: 긴 설명과 사례 / scripts: 반복 실행 코드 / assets: 템플릿과 이미지 / 본문은 길어지지 않게 유지합니다.를 먼저 짚습니다. 이때 핵심 용어는 Skill이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 반복 프롬프트를 파일 기반 절차로 옮기는 기준을 익히는 데 있습니다. 다음 장 “좋은 Skill은 작고 선명합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)

---

## Slide 45 / 11-skill-structure

- file: `11-skill-structure.html`
- section: Skills / Superpowers (5/10)
- kind: main
- contentHash: `sha256:3fb459c1ac65c15ccf8f148af1c99222909154e419faa8681377126e1914ea00`

### 슬라이드 화면 내용

**제목:** 좋은 Skill은 작고 선명합니다

**부제:** SKILL.md는 길게 쓰는 문서가 아니라, 에이전트가 바로 실행할 절차입니다.

**불릿:**
- 없음

**발표자 노트:** 작성 기준 모델이 이미 아는 내용은 빼고, 이 조직/작업에서만 중요한 절차를 넣습니다.

**미디어/시각자료:** 없음

### 발표 스크립트

Skill의 기본 구조는 단순합니다. 가장 중요한 파일은 SKILL.md입니다. 여기에는 name과 description이 들어가고, 본문에는 작업 절차가 들어갑니다. 하지만 모든 것을 SKILL.md에 넣으면 안 됩니다. SKILL.md가 너무 길어지면 Skill이 열릴 때마다 많은 컨텍스트가 들어오고, 모델이 핵심 절차를 놓칠 수 있습니다.
그래서 supporting files를 나눕니다. references는 필요할 때 읽을 문서입니다. 예를 들어 회사 API 규칙, 도메인 용어, 예시 출력 형식이 들어갈 수 있습니다. scripts는 반복해서 정확히 실행해야 하는 코드입니다. 예를 들어 파일 변환, 데이터 검증, 템플릿 생성처럼 모델이 매번 코드를 새로 짜면 위험한 작업에 좋습니다. assets는 산출물에 사용할 템플릿, 이미지, 예제 파일입니다.
좋은 Skill은 모델에게 모든 것을 설명하려고 하지 않습니다. 모델은 이미 똑똑하다는 전제를 둡니다. 그래서 “이 작업에서는 어떤 순서로 움직여야 하는가”, “무엇을 확인해야 하는가”, “어떤 파일을 필요할 때 열어야 하는가”만 선명하게 적습니다. 이 구조를 이해하면 수강생이 자기 팀의 반복 업무를 Skill로 바꾸기 쉬워집니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 46 / 11-1-real-skill-folder

- file: `11-1-real-skill-folder.html`
- section: Skills / Superpowers (6/10)
- kind: main
- contentHash: `sha256:defefbe305d14b2d3548cd4fc91cf344205cb2c41ed488b855e2596929cfbf66`

### 슬라이드 화면 내용

**제목:** deck-builder Skill은 폴더가 곧 작업 순서입니다

**부제:** HTML/CSS deck 생성 절차는 SKILL.md, references, scripts, assets로 나누면 재사용하기 쉽습니다.

**불릿:**
- SKILL.md는 호출 조건과 필수 절차만 담습니다.
- scripts는 검증과 export처럼 반복 실행되는 작업입니다.
- references와 assets는 긴 예시와 템플릿을 지연 로드합니다.

**발표자 노트:** 발표 포인트 Skill 폴더는 모델에게 “언제 읽고, 무엇을 실행하고, 어떤 예시를 참조할지”를 알려 주는 작은 작업장입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

HTML/CSS deck 생성 절차는 SKILL.md, references, scripts, assets로 나누면 재사용하기 쉽습니다.
Skill 폴더는 모델에게 언제 읽고, 무엇을 실행하고, 어떤 예시를 참조할지 알려 주는 작은 작업장입니다. 마지막에는 이 구조가 검증 명령과 Evaluation 기준까지 품고 있어야 실제 deck-builder Skill로 재사용된다고 정리합니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 47 / 11-2-skill-frontmatter-fields

- file: `11-2-skill-frontmatter-fields.html`
- section: Skills / Superpowers (7/10)
- kind: main
- contentHash: `sha256:1d3c4976ee5c79ff457aa3190d67468ac624ed81a6850bdb485ff14753c11843`

### 슬라이드 화면 내용

**제목:** frontmatter는 deck-builder Skill의 호출 조건을 정합니다

**부제:** 모델은 이 짧은 메타데이터로 “지금 deck-builder를 써야 할지” 판단합니다.

**불릿:**
- name은 호출 가능한 Skill 식별자입니다.
- description은 트리거와 제외 조건을 함께 씁니다.
- 본문은 호출된 뒤 실행할 deck 생성 절차입니다.

**발표자 노트:** 발표 포인트 frontmatter는 검색 키워드가 아니라 자동 호출 계약입니다. 너무 넓으면 아무 때나 켜지고, 너무 좁으면 필요한 순간에 빠집니다.

**미디어/시각자료:** 없음

### 발표 스크립트

모델은 이 짧은 메타데이터로 지금 deck-builder를 써야 할지 판단합니다. 그래서 description은 검색 키워드가 아니라 자동 호출 계약입니다.
예를 들어 source.md, slide-spec.json, few-shots.md가 등장하는 HTML/CSS deck 작업이라면 deck-builder가 열려야 합니다. 반대로 한국어 문장과 발표 스크립트를 고치는 작업이라면 korean-copy-review Skill이 열려야 합니다.
너무 넓은 description은 아무 때나 켜지고, 너무 좁은 description은 필요한 순간에 빠집니다. Skill 본문을 잘 쓰기 전에 먼저 호출 조건을 정확히 써야 하는 이유입니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)

---

## Slide 48 / 12-superpowers

- file: `12-superpowers.html`
- section: Skills / Superpowers (8/10)
- kind: main
- contentHash: `sha256:09bf6d5e15981445c77e3a2d0f16af75424cdf0778c1b01265ba5ee87e0ecdc5`

### 슬라이드 화면 내용

**제목:** Superpowers는 스킬 기반 하네스 패키지입니다

**부제:** 요구사항 정리, TDD, 디버깅, 리뷰, 스킬 작성 같은 개발 규율을 강제합니다.

**불릿:**
- brainstorming: 구현 전 범위 정리
- TDD/debugging: 증거 기반 수정
- review: 완료 전 검토 루프

**발표자 노트:** 정의 Superpowers는 스킬이면서, 하네스 엔지니어링 사례이면서, 작업 워크플로우입니다.

**미디어/시각자료:** `assets/handdrawn/06-superpowers.png`

### 발표 스크립트

Superpowers는 이 강의에서 아주 좋은 사례입니다. 겉으로 보면 여러 Skill의 묶음입니다. brainstorming, test-driven-development, systematic-debugging, requesting-code-review, writing-skills 같은 Skill들이 들어 있습니다. 하지만 목적은 단순히 편의 기능을 늘리는 것이 아닙니다. AI가 개발자의 좋은 절차를 따르게 만드는 것입니다.
예를 들어 brainstorming은 구현 전에 요구사항과 성공 기준을 정리하게 만듭니다. TDD Skill은 실패하는 테스트를 먼저 만들고, 그 다음 구현하게 만듭니다. systematic debugging은 추측으로 고치지 않고 증상 재현, 원인 분석, 최소 수정으로 가게 합니다. requesting code review는 완료 선언 전에 별도 리뷰를 거치게 합니다.
그래서 “Superpowers는 스킬인가요, 하네스인가요, 자동화 워크플로우인가요?”라고 물으면 답은 셋 다에 걸쳐 있습니다. 형식은 Skill 패키지이고, 목적은 하네스 엔지니어링이며, 결과적으로 개발 워크플로우를 강제합니다. 이 관점으로 보면 수강생은 Superpowers를 단순 설치 도구가 아니라 설계 사례로 이해할 수 있습니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)

---

## Slide 49 / 12-1-superpowers-as-harness

- file: `12-1-superpowers-as-harness.html`
- section: Skills / Superpowers (9/10)
- kind: main
- contentHash: `sha256:ede15cf03db1fa5cc16a938c8d3f516ed2addbfd770409c66d9ff840a284dbcc`

### 슬라이드 화면 내용

**제목:** Superpowers는 스킬 묶음이 아니라 작업 규율입니다

**부제:** brainstorming, debugging, review, verification이 개발 흐름을 단계화합니다.

**불릿:**
- 구현 전 요구를 좁힙니다.
- 실패 시 증거 기반으로 디버깅합니다.
- 완료 전 검증을 강제합니다.

**발표자 노트:** 발표 포인트 brainstorming, debugging, review, verification이 개발 흐름을 단계화합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “Superpowers는 스킬 묶음이 아니라 작업 규율입니다”입니다. brainstorming, debugging, review, verification이 개발 흐름을 단계화합니다.
화면에서는 구현 전 요구를 좁힙니다. / 실패 시 증거 기반으로 디버깅합니다. / 완료 전 검증을 강제합니다.를 먼저 짚습니다. 이때 핵심 용어는 Skill, Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 Superpowers를 편의 기능이 아니라 개발 절차 하네스의 사례로 이해하는 데 있습니다. 다음 장 “각 Superpower는 개발 루프의 다른 지점을 맡습니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 50 / 12-2-superpowers-workflow-map

- file: `12-2-superpowers-workflow-map.html`
- section: Skills / Superpowers (10/10)
- kind: workflow
- contentHash: `sha256:2150eb332fb90b0894a93f60d667c7af181ccc9e83ca3a644181e3865680c6c8`

### 슬라이드 화면 내용

**제목:** 각 Superpower는 개발 루프의 다른 지점을 맡습니다

**부제:** 필요할 때 적절한 작업 규율을 호출하는 것이 핵심입니다.

**불릿:**
- 새 기능: brainstorming / writing-plans
- 버그: systematic-debugging
- 완료: verification-before-completion
- 리뷰: requesting-code-review

**발표자 노트:** 발표 포인트 필요할 때 적절한 작업 규율을 호출하는 것이 핵심입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “각 Superpower는 개발 루프의 다른 지점을 맡습니다”입니다. 필요할 때 적절한 작업 규율을 호출하는 것이 핵심입니다.
화면에서는 새 기능: brainstorming / writing-plans / 버그: systematic-debugging / 완료: verification-before-completion / 리뷰: requesting-code-review를 먼저 짚습니다. 대본은 화면의 제목, 보조 문장, 발표 포인트를 같은 순서로 따라가며 설명합니다.
발표자는 이 내용을 Superpowers를 편의 기능이 아니라 개발 절차 하네스의 사례로 이해하는 데 있습니다. 다음 장 “Subagent는 역할과 컨텍스트를 분리합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 51 / 14-subagents

- file: `14-subagents.html`
- section: Agents / Tools (1/12)
- kind: main
- contentHash: `sha256:db0a5f5eb825208afc2f295ab3fe454c3a81a986112bbb1c4882c6a60ef90fba`

### 슬라이드 화면 내용

**제목:** Subagent는 역할과 컨텍스트를 분리합니다

**부제:** 리뷰, 보안 점검, 대량 탐색처럼 메인 대화를 오염시키는 일을 떼어냅니다.

**불릿:**
- 리뷰어는 결함만 찾게 합니다.
- 보안 에이전트는 위험만 보게 합니다.
- 리서치 에이전트는 근거만 수집하게 합니다.

**발표자 노트:** 팁 페르소나가 반복되면 Subagent 후보입니다.

**미디어/시각자료:** `assets/handdrawn/07-subagents.png`

### 발표 스크립트

Subagent는 단순히 “너는 리뷰어야”라고 말하는 것보다 한 단계 더 나아간 개념입니다. 별도의 컨텍스트를 가진 작업자에게 특정 일을 맡기고, 결과만 받아오는 방식입니다. 메인 대화에서 모든 파일을 읽고 모든 판단을 하면 대화가 길어지고, 이전 가정과 실험이 섞이고, 핵심 목표가 흐려질 수 있습니다.
예를 들어 코드 리뷰를 생각해 봅시다. 메인 에이전트가 구현을 하고 나서 같은 흐름에서 바로 자기 코드를 리뷰하면 놓치는 것이 생길 수 있습니다. 별도 리뷰어 Subagent를 두면 fresh context에서 변경점을 보고, 버그, 회귀, 테스트 누락만 집중해서 찾게 할 수 있습니다. 보안 점검, 성능 점검, 문서 검토, 리서치도 마찬가지입니다.
Subagent를 만들 때는 역할 이름보다 책임, 도구, 출력 형식을 명확히 해야 합니다. code-reviewer라면 어떤 파일을 읽을 수 있는지, 어떤 문제를 우선해야 하는지, 어떤 형식으로 findings를 내야 하는지 정합니다. 반복되는 페르소나는 Subagent 후보이고, 반복되는 절차는 Skill 후보라는 연결을 다시 강조합니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 52 / 14-1-subagent-context-isolation

- file: `14-1-subagent-context-isolation.html`
- section: Agents / Tools (2/12)
- kind: main
- contentHash: `sha256:9ffd7b8a89145e9bc2652a0a1441b24ca8941a7ef58560cfcfdb65efd6916979`

### 슬라이드 화면 내용

**제목:** Subagent는 작은 AI가 아니라 분리된 컨텍스트입니다

**부제:** 역할을 나누는 진짜 이유는 판단 공간을 오염시키지 않기 위해서입니다.

**불릿:**
- 각 에이전트는 자기 목표만 봅니다.
- 메인 에이전트는 결과를 통합하고 결정합니다.
- raw 결과를 그대로 믿지 않습니다.

**발표자 노트:** 발표 포인트 역할을 나누는 진짜 이유는 판단 공간을 오염시키지 않기 위해서입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

Subagent를 작은 AI 여러 개로만 이해하면 역할극이 됩니다. 핵심은 판단 공간을 분리하는 것입니다. 각 에이전트는 자기 목표만 보고, 메인 에이전트는 결과를 통합하고 결정합니다.
이 구조에서는 raw 결과를 그대로 믿지 않습니다. 화면 문구 검토, 발표자 대본 검토, 화면-대본 정합성 검토처럼 축을 나누고, 마지막 판단은 메인이 합칩니다.
다음 슬라이드에서는 이 원리를 리뷰어 에이전트 예시로 봅니다. 하나의 에이전트가 모든 것을 보게 하지 않고, 기준 하나만 보게 만드는 것이 핵심입니다.

### 출처

- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 53 / 14-2-reviewer-subagent-example

- file: `14-2-reviewer-subagent-example.html`
- section: Agents / Tools (3/12)
- kind: example
- contentHash: `sha256:b8f9f44b0e911feaaa2cb1869033a640ff67ec029e5c0074637b4933883587ad`

### 슬라이드 화면 내용

**제목:** Reviewer agent는 기준 하나만 봅니다

**부제:** 코드 리뷰, 한국어 검교정, 정합성 검토처럼 축을 나누면 판단이 선명해집니다.

**불릿:**
- 코드 리뷰: 결함과 회귀만 봅니다.
- 한국어 리뷰: 문장, 용어, 호흡만 봅니다.
- 정합성 리뷰: 화면과 대본의 차이만 봅니다.

**발표자 노트:** 발표 포인트 역할별 리뷰 기준이 Skill로 고정되면 다음 에이전트도 같은 방식으로 검토합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

리뷰어 에이전트는 모든 것을 잘 보게 만드는 것이 아니라 기준 하나를 선명하게 보게 만드는 장치입니다. 코드 리뷰라면 결함과 회귀만 보고, 한국어 리뷰라면 문장과 용어와 호흡만 봅니다.
이번 슬라이드 작업에도 같은 구조를 적용했습니다. 화면 문구 교정, 발표자 스크립트 문장 검증, 화면-대본 정합성 검토를 나누면 각 에이전트가 다른 기준을 섞지 않습니다.
이 기준은 일회성 프롬프트보다 Skill로 남기는 편이 좋습니다. 그래야 다음 슬라이드 작업에서도 같은 검토 축과 같은 보고 형식이 재사용됩니다.

### 출처

- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 54 / 14-3-research-subagent-example

- file: `14-3-research-subagent-example.html`
- section: Agents / Tools (4/12)
- kind: example
- contentHash: `sha256:2851ee9f6e594ed2af50be37baf00c348c34b35a9fb982f24388a3aae50d1031`

### 슬라이드 화면 내용

**제목:** Research agent는 사실을 수집하고 결정하지 않습니다

**부제:** 조사와 의사결정을 분리하면 메인 에이전트가 더 나은 선택지를 판단할 수 있습니다.

**불릿:**
- 공식 문서와 실제 사례를 수집합니다.
- 출처와 날짜를 남깁니다.
- 최종 선택은 메인 에이전트가 합니다.

**발표자 노트:** 발표 포인트 조사와 의사결정을 분리하면 메인 에이전트가 더 나은 선택지를 판단할 수 있습니다.

**미디어/시각자료:** 없음

### 발표 스크립트

Research agent는 사실을 수집하고 결정하지 않습니다. 공식 문서와 실제 사례를 모으고, 출처와 날짜를 남기는 역할에 집중합니다.
조사와 의사결정을 분리하면 메인 에이전트가 더 나은 선택지를 판단할 수 있습니다. 조사 에이전트가 “무엇이 맞다”까지 결정해 버리면, 근거 수집과 의사결정이 섞입니다.
이 원리는 슬라이드 검교정에도 그대로 적용됩니다. 검토 에이전트는 발견과 근거를 내고, 메인 에이전트는 어떤 문구를 실제 슬라이드와 발표 스크립트에 반영할지 결정합니다.

### 출처

- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 55 / 15-agent-teams

- file: `15-agent-teams.html`
- section: Agents / Tools (5/12)
- kind: main
- contentHash: `sha256:f19686f8f321a587a88bb9ed5863d75c59e6dcf79a76e60c43e8160029d882bd`

### 슬라이드 화면 내용

**제목:** 요즘은 병렬 에이전트로 확장합니다

**부제:** 하나의 에이전트가 모든 판단을 하지 않게 하고, 독립된 관점을 동시에 돌립니다.

**불릿:**
- 기능 구현과 리뷰를 분리합니다.
- security, performance, test 관점을 병렬화합니다.
- worktree를 쓰면 충돌을 줄일 수 있습니다.

**발표자 노트:** 주의 병렬화는 범위가 독립적일 때만 효과적입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

Subagent가 하나의 역할 분리라면, Agent Teams는 여러 관점을 병렬로 돌리는 방식입니다. 모든 작업에 필요한 것은 아니지만, 복잡한 변경에서는 매우 유용합니다. 한 에이전트는 구현을 하고, 다른 에이전트는 보안 관점에서 위험을 보고, 또 다른 에이전트는 테스트 누락을 보고, 또 다른 에이전트는 성능 영향을 볼 수 있습니다.
다만 병렬 에이전트는 아무 때나 쓰면 오히려 혼란이 생깁니다. 같은 파일을 여러 에이전트가 동시에 고치면 충돌이 생깁니다. 그래서 범위를 명확히 나눠야 합니다. 예를 들어 한 에이전트는 읽기 전용 리뷰만 하고, 다른 에이전트는 문서만 수정하고, 또 다른 에이전트는 테스트만 추가하는 식입니다. 더 큰 프로젝트에서는 git worktree를 써서 작업 공간 자체를 분리할 수도 있습니다.
강의에서는 이 부분을 고급 확장으로 설명하면 좋습니다. 처음에는 단일 에이전트와 리뷰 Subagent만으로도 충분합니다. 하지만 팀 규모가 커지고, 검증 관점이 다양해지면 Agent Teams가 실전적인 패턴이 됩니다. 핵심은 병렬화가 아니라 책임 분리입니다.

### 출처

- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 56 / 15-1-parallel-safe

- file: `15-1-parallel-safe.html`
- section: Agents / Tools (6/12)
- kind: main
- contentHash: `sha256:8e9982debd902a6ded82e034423343a18067bb8b4e718758ec6fb984b9e0d1ae`

### 슬라이드 화면 내용

**제목:** 병렬화는 독립된 작업일 때만 안전합니다

**부제:** 서로 다른 파일, 서로 다른 관점, 읽기 전용 조사는 병렬화에 맞습니다.

**불릿:**
- 보안/성능/테스트 리뷰 분리
- 서로 다른 모듈의 읽기 작업
- 외부 자료 조사

**발표자 노트:** 발표 포인트 서로 다른 파일, 서로 다른 관점, 읽기 전용 조사는 병렬화에 맞습니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “병렬화는 독립된 작업일 때만 안전합니다”입니다. 서로 다른 파일, 서로 다른 관점, 읽기 전용 조사는 병렬화에 맞습니다.
화면에서는 보안/성능/테스트 리뷰 분리 / 서로 다른 모듈의 읽기 작업 / 외부 자료 조사를 먼저 짚습니다. 대본은 화면의 제목, 보조 문장, 발표 포인트를 같은 순서로 따라가며 설명합니다.
발표자는 이 내용을 병렬화의 핵심이 속도가 아니라 독립된 책임 분리라는 점을 확인하는 데 있습니다. 다음 장 “같은 결정을 여러 agent에게 맡기면 충돌합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/hooks: https://docs.anthropic.com/en/docs/claude-code/hooks
- Claude Code Subagents (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/sub-agents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code Skills (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Claude Code Memory (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/memory: https://docs.anthropic.com/en/docs/claude-code/memory
- Model Context Protocol Server Features (deck-global)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- OpenAI Evaluation Best Practices (deck-global)
  - https://developers.openai.com/api/docs/guides/evaluation-best-practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices

---

## Slide 57 / 15-2-parallel-risk

- file: `15-2-parallel-risk.html`
- section: Agents / Tools (7/12)
- kind: main
- contentHash: `sha256:4ab80911bc1c45a40e592c79fe605a05dc48e0d06f97f8531821de535eb786f2`

### 슬라이드 화면 내용

**제목:** 같은 결정을 여러 agent에게 맡기면 충돌합니다

**부제:** 병렬화는 빠르지만 가정이 갈라지면 통합 비용이 커집니다.

**불릿:**
- 같은 파일 동시 수정
- 데이터 모델 중복 결정
- 서로 다른 UI 패턴 생성
- main 통합 기준 부재

**발표자 노트:** 발표 포인트 병렬화는 빠르지만 가정이 갈라지면 통합 비용이 커집니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “같은 결정을 여러 agent에게 맡기면 충돌합니다”입니다. 병렬화는 빠르지만 가정이 갈라지면 통합 비용이 커집니다.
화면에서는 같은 파일 동시 수정 / 데이터 모델 중복 결정 / 서로 다른 UI 패턴 생성 / main 통합 기준 부재를 먼저 짚습니다. 이때 핵심 용어는 Subagent이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 병렬화의 핵심이 속도가 아니라 독립된 책임 분리라는 점을 확인하는 데 있습니다. 다음 장 “MCP는 실제 세계와 연결하는 도구 레이어입니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Model Context Protocol Server Features (slide)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 58 / 18-mcp

- file: `18-mcp.html`
- section: Agents / Tools (8/12)
- kind: main
- contentHash: `sha256:d55c5d6cba52f7caddc11b2ce2d50341aa92ebbdb0c0651b2fcaad187fb79fca`

### 슬라이드 화면 내용

**제목:** MCP는 실제 세계와 연결하는 도구 레이어입니다

**부제:** Skill이 도구 사용법을 가르친다면, MCP는 GitHub, DB, Slack, Browser 같은 시스템에 연결합니다.

**불릿:**
- 필요한 도구만 연결합니다.
- 도구 설명도 컨텍스트 비용입니다.
- 읽기/쓰기 권한을 분리합니다.

**발표자 노트:** 메시지 도구가 많으면 강해지는 게 아니라, 필요한 도구가 정확할 때 강해집니다.

**미디어/시각자료:** `assets/handdrawn/09-mcp.png`

### 발표 스크립트

MCP는 모델이 외부 시스템을 직접 아는 구조가 아니라, 필요한 시스템을 안전하게 연결하는 도구 레이어입니다. 예를 들어 GitHub, DB, Slack, Browser 같은 시스템을 MCP 서버가 기능으로 노출하고, 호스트 앱이 MCP 클라이언트를 통해 호출합니다.
핵심은 도구를 많이 붙이는 것이 아니라 읽기, 쓰기, 승인 권한을 나누고 필요한 순간에만 연결하는 것입니다. Skill은 도구 사용 절차를 설명하고, MCP는 실제 tool, resource, prompt를 사용할 수 있게 한다고 구분합니다.

### 출처

- Model Context Protocol Server Features (slide)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 59 / 18-1-mcp-bridge

- file: `18-1-mcp-bridge.html`
- section: Agents / Tools (9/12)
- kind: main
- contentHash: `sha256:332f82d48d34eca4bbba6331aa6a73c5266e6ce3bc575626983645fd4cc5e2e3`

### 슬라이드 화면 내용

**제목:** MCP는 모델과 외부 시스템 사이의 다리입니다

**부제:** 호스트 앱이 MCP 클라이언트를 통해 서버와 통신하고, 서버가 외부 시스템 기능을 노출합니다.

**불릿:**
- Host: Claude/Codex 같은 실행 환경
- Client: 서버와 통신하는 연결 단위
- Server: tools, resources, prompts를 노출
- Tool: 실제 작업을 수행하는 호출

**발표자 노트:** 발표 포인트 MCP를 단순히 도구 목록으로만 보지 말고 host, client, server, primitive의 연결 구조로 봅니다.

**미디어/시각자료:** 없음

### 발표 스크립트

MCP는 모델이 외부 시스템을 직접 아는 구조가 아닙니다. 호스트 앱이 MCP 클라이언트를 만들고, 클라이언트가 MCP 서버와 통신하며, 서버가 tools, resources, prompts를 노출합니다.
입문 단계에서는 이 다섯 칸만 기억하면 됩니다. Host는 Claude나 Codex 같은 실행 환경, Client는 서버와 통신하는 연결 단위, Server는 외부 시스템 기능을 노출하는 쪽, Tool은 실제 작업을 수행하는 호출입니다.
실제 설정은 공식 문서의 schema를 기준으로 확인해야 합니다. 화면의 영어 라벨은 공식 구조를 보존하기 위한 것이고, 설명은 한국어로 풀어 이해를 고정합니다.

### 출처

- Model Context Protocol Server Features (slide)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts

---

## Slide 60 / 18-2-tool-permissions

- file: `18-2-tool-permissions.html`
- section: Agents / Tools (10/12)
- kind: main
- contentHash: `sha256:74b82a41369360ee9351b112f1dc3fd868bdd75e361943ee6da8b2e804ccc83c`

### 슬라이드 화면 내용

**제목:** 도구는 읽기 권한과 쓰기 권한을 분리합니다

**부제:** 같은 GitHub 도구라도 읽기와 merge는 위험도가 다릅니다.

**불릿:**
- read-only는 조사에 적합합니다.
- write-capable은 승인과 검증이 필요합니다.
- 위험한 도구는 좁은 범위로 연결합니다.

**발표자 노트:** 발표 포인트 같은 GitHub 도구라도 읽기와 merge는 위험도가 다릅니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “도구는 읽기 권한과 쓰기 권한을 분리합니다”입니다. 같은 GitHub 도구라도 읽기와 merge는 위험도가 다릅니다.
화면에서는 read-only는 조사에 적합합니다. / write-capable은 승인과 검증이 필요합니다. / 위험한 도구는 좁은 범위로 연결합니다.를 먼저 짚습니다. 이때 핵심 용어는 Evaluation, 권한이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 AI가 외부 시스템과 연결될 때 도구 권한과 컨텍스트 비용을 같이 봐야 한다는 점을 잡는 데 있습니다. 다음 장 “도구가 많을수록 항상 좋은 것은 아닙니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 61 / 18-3-tool-bloat

- file: `18-3-tool-bloat.html`
- section: Agents / Tools (11/12)
- kind: main
- contentHash: `sha256:188aa20556246a87f942b351b4f3d7023b632925f627625f02af1d777ed0b807`

### 슬라이드 화면 내용

**제목:** 도구가 많을수록 항상 좋은 것은 아닙니다

**부제:** tool description도 context를 차지하고 선택 비용을 만듭니다.

**불릿:**
- 필요 없는 도구는 선택지를 흐립니다.
- 비슷한 도구가 많으면 호출이 불안정합니다.
- 업무별 최소 도구 세트가 더 낫습니다.

**발표자 노트:** 발표 포인트 tool description도 context를 차지하고 선택 비용을 만듭니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “도구가 많을수록 항상 좋은 것은 아닙니다”입니다. tool description도 context를 차지하고 선택 비용을 만듭니다.
화면에서는 필요 없는 도구는 선택지를 흐립니다. / 비슷한 도구가 많으면 호출이 불안정합니다. / 업무별 최소 도구 세트가 더 낫습니다.를 먼저 짚습니다. 대본은 화면의 제목, 보조 문장, 발표 포인트를 같은 순서로 따라가며 설명합니다.
발표자는 이 내용을 AI가 외부 시스템과 연결될 때 도구 권한과 컨텍스트 비용을 같이 봐야 한다는 점을 잡는 데 있습니다. 다음 장 “역할과 도구를 한 장으로 분리합니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 62 / 18-4-practice-agent-tool-split

- file: `18-4-practice-agent-tool-split.html`
- section: Agents / Tools (12/12)
- kind: checkpoint
- contentHash: `sha256:581e0913aa001b692900925bff3fc060aad8df580625c1f8075f90887b81a457`

### 슬라이드 화면 내용

**제목:** 역할과 도구를 한 장으로 분리합니다

**부제:** 하나의 자동화 업무를 Main, Subagent, MCP Tool, Human Review로 나눕니다.

**불릿:**
- 없음

**발표자 노트:** 목표 모든 일을 한 AI에게 맡기는 습관을 끊고, 역할과 권한을 분리합니다. PR 리뷰, deck 생성, 리서치 정리 모두 같은 구조로 나눌 수 있습니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 실습은 Agents와 Tools 섹션을 실제 업무 분해로 연결하는 체크포인트입니다.
Main은 결정과 통합, Subagent는 격리된 검토, MCP Tool은 외부 시스템 호출, Human Review는 승인과 책임을 맡는 식으로 나눠 봅니다.

### 출처

- Model Context Protocol Server Features (slide)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 63 / 16-hooks

- file: `16-hooks.html`
- section: Hooks / Verification (1/14)
- kind: main
- contentHash: `sha256:5f5e3018bd304c718611e95d4760908c065ac3cc65e503dd3d2cb1424add0426`

### 슬라이드 화면 내용

**제목:** Hook은 지시가 아니라 실행입니다

**부제:** 파일 수정, 권한 요청, 세션 시작, 종료 같은 이벤트에 실제 명령을 연결합니다.

**불릿:**
- 없음

**발표자 노트:** 핵심 반드시 지켜야 하는 것은 프롬프트가 아니라 Hook으로 올립니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 섹션은 “테스트를 해라”라는 문장을 실제 이벤트 기반 명령으로 바꾸는 단계입니다.
처음에는 echo나 알림처럼 가벼운 command로 시작하고, 이후 lint/test나 종료 전 검증으로 올리는 운영 감각을 전달합니다. 권한이 필요한 명령이나 쓰기 작업은 Hook에 바로 넣기보다 읽기, 쓰기, 승인 흐름을 나누어 설계해야 한다고 덧붙입니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 64 / 16-1-hook-event

- file: `16-1-hook-event.html`
- section: Hooks / Verification (2/14)
- kind: main
- contentHash: `sha256:3f6afdfa85499a52a447b5250e635baf7e76416a99f52df06f9d9290c379032a`

### 슬라이드 화면 내용

**제목:** Hook은 이벤트가 발생할 때 시작됩니다

**부제:** 파일 수정, 도구 사용, 세션 종료 같은 지점에 자동화를 붙입니다.

**불릿:**
- PostToolUse: 수정 뒤 실행
- Stop: 완료 전 확인
- SessionStart: 시작 시 준비
- 이벤트를 잘못 고르면 너무 자주 실행됩니다.

**발표자 노트:** 발표 포인트 파일 수정, 도구 사용, 세션 종료 같은 지점에 자동화를 붙입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “Hook은 이벤트가 발생할 때 시작됩니다”입니다. 파일 수정, 도구 사용, 세션 종료 같은 지점에 자동화를 붙입니다.
화면에서는 PostToolUse: 수정 뒤 실행 / Stop: 완료 전 확인 / SessionStart: 시작 시 준비 / 이벤트를 잘못 고르면 너무 자주 실행됩니다.를 먼저 짚습니다. 이때 핵심 용어는 Hook이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 읽는 지침과 실제 실행되는 검문소의 차이를 체감시키는 데 있습니다. 다음 장 “Hook의 command는 실제 실행되는 검문소입니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)

---

## Slide 65 / 16-2-hook-command

- file: `16-2-hook-command.html`
- section: Hooks / Verification (3/14)
- kind: main
- contentHash: `sha256:918cbe148fafdebd627e732380e1b68ebfe8fc224317b42564aaf24d2eaabf13`

### 슬라이드 화면 내용

**제목:** Hook의 command는 실제 실행되는 검문소입니다

**부제:** Hook은 이벤트에 matcher를 붙이고, 그 안에서 command를 실행합니다.

**불릿:**
- 처음에는 echo로 시작합니다.
- 확인 뒤 lint/test로 올립니다.
- 긴 명령은 범위를 좁힙니다.

**발표자 노트:** 발표 포인트 “테스트해”라는 지시가 아니라 공식 schema에 맞는 실제 명령을 연결합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

“테스트해”라는 지시는 잊힐 수 있지만, Hook command는 이벤트가 발생할 때 실제 명령을 실행합니다. Claude Code hook은 이벤트, matcher, hooks 배열, command handler의 구조를 맞춰야 합니다.
이 슬라이드는 입문용 단순화입니다. 실제 설정은 공식 문서의 schema를 기준으로 확인해야 합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)

---

## Slide 66 / 16-3-hook-result

- file: `16-3-hook-result.html`
- section: Hooks / Verification (4/14)
- kind: main
- contentHash: `sha256:de7a1a558dc3598a0ee31593157a82e9fcbb5348e06e8fd772df36f6c910b73c`

### 슬라이드 화면 내용

**제목:** Hook 결과는 agent에게 다시 돌아갑니다

**부제:** pass/fail 피드백이 다음 행동을 바꾸게 만들어야 합니다.

**불릿:**
- pass: 보고에 증거로 포함
- fail: 원인 분석 후 수정
- skip이나 mock으로 숨기지 않습니다.

**발표자 노트:** 발표 포인트 pass/fail 피드백이 다음 행동을 바꾸게 만들어야 합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “Hook 결과는 agent에게 다시 돌아갑니다”입니다. pass/fail 피드백이 다음 행동을 바꾸게 만들어야 합니다.
화면에서는 pass: 보고에 증거로 포함 / fail: 원인 분석 후 수정 / skip이나 mock으로 숨기지 않습니다.를 먼저 짚습니다. 이때 핵심 용어는 Hook, Subagent이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 읽는 지침과 실제 실행되는 검문소의 차이를 체감시키는 데 있습니다. 다음 장 “Skill은 지침이고 Hook은 실행입니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 67 / 16-4-skill-vs-hook

- file: `16-4-skill-vs-hook.html`
- section: Hooks / Verification (5/14)
- kind: example
- contentHash: `sha256:fca117f25985177c7f48e56cd1b771fec815ccd434a17a1713c37a4f6cbc663e`

### 슬라이드 화면 내용

**제목:** Skill은 지침이고 Hook은 실행입니다

**부제:** 둘 다 필요하지만 실패를 막는 강도가 다릅니다.

**불릿:**
- Skill: 어떻게 일할지 알려 줍니다.
- Hook: 특정 순간에 실제 명령을 실행합니다.
- 반드시 필요한 검증은 Hook에 가깝습니다.

**발표자 노트:** 발표 포인트 둘 다 필요하지만 실패를 막는 강도가 다릅니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “Skill은 지침이고 Hook은 실행입니다”입니다. 둘 다 필요하지만 실패를 막는 강도가 다릅니다.
화면에서는 Skill: 어떻게 일할지 알려 줍니다. / Hook: 특정 순간에 실제 명령을 실행합니다. / 반드시 필요한 검증은 Hook에 가깝습니다.를 먼저 짚습니다. 이때 핵심 용어는 Hook, Skill, Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 읽는 지침과 실제 실행되는 검문소의 차이를 체감시키는 데 있습니다. 다음 장 “Hook도 단계가 있습니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 68 / 17-hook-advanced

- file: `17-hook-advanced.html`
- section: Hooks / Verification (6/14)
- kind: main
- contentHash: `sha256:8efc2eafd744bc442b8180e227d90f170d2009b211b6a1cc05e859cfa9add725`

### 슬라이드 화면 내용

**제목:** Hook도 단계가 있습니다

**부제:** 공식 이벤트는 유지하되, 실행 방식과 검사 깊이를 단계적으로 올립니다.

**불릿:**
- Stop event: 종료 전 검증을 붙입니다.
- Command handler: 빠른 lint/test를 실행합니다.
- Subagent review: 복잡한 검토는 별도 컨텍스트로 분리합니다.
- Copy audit: 문장 검토도 gate에 연결합니다.

**발표자 노트:** 실전 팁 처음에는 echo로 시작하고, 확인 뒤 lint/test와 리뷰 자동화로 교체합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

여기서 단계는 공식 이벤트 이름이 아니라 검사 깊이를 뜻합니다. 같은 Hook 체계 안에서도 echo, 빠른 lint/test, 종료 전 검증, 별도 컨텍스트 리뷰처럼 점진적으로 강도를 올릴 수 있습니다.
복잡한 검사는 Subagent나 별도 리뷰 컨텍스트로 넘기고, Hook은 그 검사를 언제 실행할지 정하는 입구로 설명합니다. 이번 한국어 문장 감사처럼 기계적으로 확인할 수 있는 검토는 Copy audit으로 gate에 연결할 수 있습니다.
실제 설정은 공식 문서의 schema를 기준으로 확인해야 합니다. 강의에서는 먼저 작은 echo로 이벤트를 확인한 뒤, 검증과 리뷰 자동화를 붙이는 순서만 잡습니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 69 / 17-1-hook-start-small

- file: `17-1-hook-start-small.html`
- section: Hooks / Verification (7/14)
- kind: main
- contentHash: `sha256:64a3a6b77a527a2c7f8f8d79f7d6a55386d64c66a92324058c4f20831608349e`

### 슬라이드 화면 내용

**제목:** Hook은 echo에서 시작해 test까지 확장합니다

**부제:** 처음부터 무거운 자동화를 붙이면 작업 흐름이 막힐 수 있습니다.

**불릿:**
- 1단계: echo로 이벤트 확인
- 2단계: formatter 또는 lint
- 3단계: 집중 test
- 4단계: Stop gate

**발표자 노트:** 발표 포인트 처음부터 무거운 자동화를 붙이면 작업 흐름이 막힐 수 있습니다.

**미디어/시각자료:** 없음

### 발표 스크립트

Hook은 처음부터 무거운 자동화로 시작하지 않습니다. 1단계는 echo로 이벤트가 실제로 들어오는지 확인하는 것입니다.
그 다음 formatter나 lint처럼 빠른 검사를 붙이고, 실패 위험이 큰 작업에는 집중 test와 Stop gate를 연결합니다. 이렇게 단계적으로 올리면 자동화가 작업 흐름을 막는지, 실제로 품질을 지키는지 확인할 수 있습니다.
오늘의 한국어 copy audit도 같은 원리입니다. 처음에는 경고로 시작하고, 문장 기준이 안정되면 handoff 전 검증 게이트로 올립니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 70 / 19-evaluation

- file: `19-evaluation.html`
- section: Hooks / Verification (8/14)
- kind: main
- contentHash: `sha256:59f1cf0a0f0c6f5e7965d08922d58fe0af3f67e52acd53805a9ed73e6935d01b`

### 슬라이드 화면 내용

**제목:** 완료의 기준은 검증입니다

**부제:** 테스트만으로 부족한 영역은 리뷰어, LLM-as-judge, 사람 검토를 함께 둡니다.

**불릿:**
- 기계 검증: test, lint, typecheck
- 판단 검증: reviewer, judge, rubric
- 최종 검증: 사람이 요구사항과 대조

**발표자 노트:** 원칙 “잘 된 것 같다”가 아니라 “어떤 검증을 통과했는가”를 말하게 만듭니다.

**미디어/시각자료:** 없음

### 발표 스크립트

Evaluation은 사람이 보기 좋은 답변과 실제로 완료된 작업을 구분하는 기준입니다. 테스트만으로 끝나지 않는 품질도 있기 때문에 검증 축을 나눠야 합니다.
기계 검증은 test, lint, typecheck처럼 명령으로 확인할 수 있는 영역입니다. 판단 검증은 reviewer, LLM-as-judge, rubric처럼 기준표를 놓고 품질을 보는 영역입니다. 마지막으로 사람 검토는 요구사항, 운영 위험, 배포 승인처럼 사람이 책임져야 하는 결정입니다.
이 기준이 있어야 완료 보고가 주장에 머물지 않고 테스트, 렌더링, 리뷰 증거로 닫힙니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 71 / 19-1-machine-checks

- file: `19-1-machine-checks.html`
- section: Hooks / Verification (9/14)
- kind: main
- contentHash: `sha256:cd0b1824d1a11e14faa7e00a82017c8d06f6bbc0c3cf4ad27d3f9502ede141ad`

### 슬라이드 화면 내용

**제목:** 기계가 확인할 수 있는 것은 기계에게 맡깁니다

**부제:** test, lint, typecheck, build는 완료 증거의 기본입니다.

**불릿:**
- 빠른 검증을 먼저 둡니다.
- 변경 범위에 맞는 명령을 고릅니다.
- 실패 결과는 숨기지 않습니다.

**발표자 노트:** 발표 포인트 test, lint, typecheck, build는 완료 증거의 기본입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “기계가 확인할 수 있는 것은 기계에게 맡깁니다”입니다. test, lint, typecheck, build는 완료 증거의 기본입니다.
화면에서는 빠른 검증을 먼저 둡니다. / 변경 범위에 맞는 명령을 고릅니다. / 실패 결과는 숨기지 않습니다.를 먼저 짚습니다. 이때 핵심 용어는 Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 완료 선언을 믿는 것이 아니라 검증 증거로 완료를 판단하게 만드는 데 있습니다. 다음 장 “판단이 필요한 품질은 rubric으로 봅니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 72 / 19-2-judge-checks

- file: `19-2-judge-checks.html`
- section: Hooks / Verification (10/14)
- kind: main
- contentHash: `sha256:7cd66d4fe2588a9b4e6ff94a277f01ef55aee1f344ee5af9fc7fcebd6248b5e5`

### 슬라이드 화면 내용

**제목:** 판단이 필요한 품질은 rubric으로 봅니다

**부제:** LLM-as-judge나 reviewer도 평가 기준이 없으면 흔들립니다.

**불릿:**
- 요구사항 충족 여부
- 사용자 영향
- 리스크와 누락
- 근거 없는 칭찬 금지

**발표자 노트:** 발표 포인트 LLM-as-judge나 reviewer도 평가 기준이 없으면 흔들립니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “판단이 필요한 품질은 rubric으로 봅니다”입니다. LLM-as-judge나 reviewer도 평가 기준이 없으면 흔들립니다.
화면에서는 요구사항 충족 여부 / 사용자 영향 / 리스크와 누락 / 근거 없는 칭찬 금지를 먼저 짚습니다. 이때 핵심 용어는 Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 완료 선언을 믿는 것이 아니라 검증 증거로 완료를 판단하게 만드는 데 있습니다. 다음 장 “사람 검토는 최종 의사결정 지점입니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 73 / 19-3-human-checks

- file: `19-3-human-checks.html`
- section: Hooks / Verification (11/14)
- kind: main
- contentHash: `sha256:d7493f17de036008d238c3a0f498425ea2602e17cd9f10b711342ea3dc88e511`

### 슬라이드 화면 내용

**제목:** 사람 검토는 최종 의사결정 지점입니다

**부제:** 기계 검증이 통과해도 요구사항 해석은 사람이 확인해야 합니다.

**불릿:**
- 비즈니스 의도와 맞는가
- UX가 자연스러운가
- 운영 위험이 허용 가능한가
- merge 승인이나 배포 승인

**발표자 노트:** 발표 포인트 기계 검증이 통과해도 요구사항 해석은 사람이 확인해야 합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

기계 검증이 통과해도 요구사항 해석은 사람이 확인해야 합니다. 비즈니스 의도와 맞는지, UX가 자연스러운지, 운영 위험이 허용 가능한지 같은 판단은 자동 검사만으로 닫을 수 없습니다.
마지막에는 merge 승인이나 배포 승인처럼 사람이 책임지는 의사결정 지점이 남습니다. Evaluation은 이 지점을 숨기는 것이 아니라, 기계 검증과 사람 검토의 경계를 분명히 적게 만드는 장치입니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 74 / 20-loop-schedule

- file: `20-loop-schedule.html`
- section: Hooks / Verification (12/14)
- kind: workflow
- contentHash: `sha256:255d1eb7d1832529a8554ad7785a3d01ccaf0f626cac3cf0a30567b7ed6eee67`

### 슬라이드 화면 내용

**제목:** 실전 자동화는 한 번 실행에서 끝나지 않습니다

**부제:** Loop와 Schedule은 PR 감시, 문서 업데이트, 품질 점검 같은 반복 업무에 맞습니다.

**불릿:**
- Hook: 이벤트 기반 자동화
- Loop: 조건이 맞을 때까지 반복
- Schedule: 시간 기반 운영 작업

**발표자 노트:** 운영 관점 AI 에이전트는 코딩 도구에서 운영 보조자까지 확장됩니다.

**미디어/시각자료:** 없음

### 발표 스크립트

지금까지의 흐름은 주로 한 번의 작업 요청을 기준으로 설명했습니다. 하지만 실무 자동화는 한 번 실행하고 끝나는 경우보다 계속 확인하고 반복해야 하는 경우가 많습니다. 예를 들어 PR 상태를 주기적으로 확인하거나, 실패한 CI 로그가 올라오면 다시 분석하거나, 매일 변경된 문서를 업데이트하거나, 특정 지표가 바뀌면 보고서를 만드는 작업입니다.
여기서 Hook, Loop, Schedule을 구분하면 좋습니다. Hook은 이벤트 기반입니다. 파일이 수정되거나 권한 요청이 들어오거나 세션이 끝나려 할 때 실행됩니다. Loop는 조건이 만족될 때까지 반복하는 구조입니다. Schedule은 시간 기반입니다. 매일 아침, 매주 월요일, 30분마다 같은 규칙으로 작업을 실행합니다.
이 부분은 고급 확장입니다. 처음부터 모든 것을 자동화하려고 하면 위험합니다. 먼저 작은 워크플로우를 만들고, 검증 기준을 만들고, 그 다음 반복 가능한 작업을 Schedule로 올립니다. 이렇게 하면 AI 에이전트는 단순 코딩 도구에서 운영 보조자, 품질 감시자, 문서 유지 관리자로 확장됩니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)

---

## Slide 75 / 20-1-loop-until-pass

- file: `20-1-loop-until-pass.html`
- section: Hooks / Verification (13/14)
- kind: workflow
- contentHash: `sha256:a217906f2d80992bc3e760e802561680ef4180edb14c56ecbbf2db66f5e0ee37`

### 슬라이드 화면 내용

**제목:** Loop는 통과할 때까지 반복하는 운영 구조입니다

**부제:** 한 번 실행하고 끝나는 것이 아니라 실패를 다시 작업으로 돌립니다.

**불릿:**
- run: 작업 실행
- check: 검증
- repair: 실패 수정
- report: 증거 보고

**발표자 노트:** 발표 포인트 한 번 실행하고 끝나는 것이 아니라 실패를 다시 작업으로 돌립니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 장의 핵심은 “Loop는 통과할 때까지 반복하는 운영 구조입니다”입니다. 한 번 실행하고 끝나는 것이 아니라 실패를 다시 작업으로 돌립니다.
화면에서는 run: 작업 실행 / check: 검증 / repair: 실패 수정 / report: 증거 보고를 먼저 짚습니다. 이때 핵심 용어는 Evaluation이고, 화면의 문장과 같은 단어로 다시 말해 수강생이 용어를 놓치지 않게 합니다.
발표자는 이 내용을 한 번의 요청을 넘어 반복, 조건, 시간 기반 자동화로 확장하는 관점을 여는 데 있습니다. 다음 장 “완료 조건을 검증 게이트로 바꿉니다”로 넘어가며 지금 본 기준이 다음 화면에서 어떻게 구체화되는지 연결합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 76 / 20-2-practice-verification-gate

- file: `20-2-practice-verification-gate.html`
- section: Hooks / Verification (14/14)
- kind: checkpoint
- contentHash: `sha256:b97582d6bf859bd06f7ce62c944acdd5c31c326a9aa652134f088913f131264e`

### 슬라이드 화면 내용

**제목:** 완료 조건을 검증 게이트로 바꿉니다

**부제:** “테스트해줘”가 아니라 언제, 무엇을, 어떤 기준으로 통과시킬지 정합니다.

**불릿:**
- 없음

**발표자 노트:** 목표 검증을 권장사항이 아니라 워크플로우의 문으로 만듭니다. deck 작업에서는 링크, 슬라이드 등록, presenter review 노출까지 게이트에 포함합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

“테스트해줘”가 아니라 언제, 무엇을, 어떤 기준으로 통과시킬지 정합니다.
deck 작업에서는 일반 테스트와 함께 node scripts/verify-deck.js 같은 전용 검증을 게이트에 포함해 링크, 슬라이드 등록, presenter review 노출을 확인합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 77 / 21-final-workflow

- file: `21-final-workflow.html`
- section: Final Workflow (1/11)
- kind: workflow
- contentHash: `sha256:c2c5fd6e728db39eb05c3e03381d4709a077617f910ce74c3a3ad2ea2b364c00`

### 슬라이드 화면 내용

**제목:** HTML/CSS Deck Automation Harness v1

**부제:** Claude에게 자료를 주면 source brief부터 handoff까지 반복 가능한 발표자료 제작 워크플로우로 통과시킵니다.

**불릿:**
- 없음

**발표자 노트:** 마무리 질문 결과물은 발표자료 하나가 아니라 다음 발표자료도 같은 품질로 만들 수 있게 하는 작업장입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

마지막 섹션은 지금까지의 레이어를 하나의 작은 작업장으로 합치는 시간입니다.
수강생이 가져갈 산출물은 완성된 발표자료 하나가 아니라 source, spec, few-shot, deck, review, verification, handoff가 이어지는 반복 가능한 workflow입니다.

### 출처

- Claude Code Hooks (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/hooks: https://docs.anthropic.com/en/docs/claude-code/hooks
- Claude Code Subagents (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/sub-agents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code Skills (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Claude Code Memory (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/memory: https://docs.anthropic.com/en/docs/claude-code/memory
- Model Context Protocol Server Features (deck-global)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- OpenAI Evaluation Best Practices (deck-global)
  - https://developers.openai.com/api/docs/guides/evaluation-best-practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices

---

## Slide 78 / 21-1-final-artifact-structure

- file: `21-1-final-artifact-structure.html`
- section: Final Workflow (2/11)
- kind: main
- contentHash: `sha256:d3270e6139f81f1a650b910d45bf68bd6513286bdbbc8a4b6e3ff5075148ce40`

### 슬라이드 화면 내용

**제목:** 최종 산출물은 lecture-deck/입니다

**부제:** 워크숍 산출물은 복사 가능한 HTML/CSS deck 작업장이고, 공식 Skill은 .claude/skills/로 옮겨 씁니다.

**불릿:**
- source/spec/few-shot: 입력과 출력 형식
- skills/agents: 워크숍용 절차와 역할 샘플
- deck/review: 발표용과 검토용 분리
- scripts/hooks/handoff: 검증과 이어받기

**발표자 노트:** 발표 포인트 폴더 구조가 곧 운영 방식입니다. 단, 강의 산출물 경로와 Claude Code의 공식 Skill 설치 경로는 분리해서 설명합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

최종 산출물은 `lecture-deck/` 같은 작은 작업장입니다. 여기에는 source.md, slide-spec.json, few-shots.md, CLAUDE.md, skills, agents, scripts, deck.html, presenter-review.html, HANDOFF.md가 함께 들어갑니다.
중요한 경계가 하나 있습니다. 워크숍에서는 구조를 배우기 위해 `lecture-deck/skills/deck-builder/SKILL.md`에 샘플 Skill을 둡니다. 실제 Claude Code 프로젝트 Skill로 설치할 때는 `.claude/skills/deck-builder/SKILL.md` 같은 공식 경로로 옮깁니다.
폴더 구조가 곧 운영 방식입니다. 이 구조가 있어야 Claude가 매번 같은 절차로 발표자료를 만들고, Evaluation은 산출물이 실제로 통과했는지 확인하는 기준으로 남습니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 79 / 21-10-practice-few-shot-placement

- file: `21-10-practice-few-shot-placement.html`
- section: Final Workflow (3/11)
- kind: checkpoint
- contentHash: `sha256:2ae4dc7069ef1c96d770a9a8ca99720537c92170b5ebaa67a291bacfb3d725a9`

### 슬라이드 화면 내용

**제목:** Few-shot은 slide-spec.json 바로 다음에 둡니다

**부제:** 명세가 “무엇을 만들지”를 고정한다면, few-shot은 “어떤 모양으로 답할지”를 고정합니다.

**불릿:**
- 없음

**발표자 노트:** 발표 포인트 few-shot을 뒤에 붙이면 장식이 됩니다. spec 바로 다음에 두면 Claude의 출력 형식을 고정하는 장치가 됩니다.

**미디어/시각자료:** 없음

### 발표 스크립트

최종 산출물 구조를 먼저 본 뒤, 바로 few-shot을 어디에 둘지 확인합니다. `source.md`가 맥락을 정하고 `slide-spec.json`이 무엇을 만들지 정한다면, `few-shots.md`는 어떤 모양으로 답할지 고정합니다.
좋은 슬라이드 명세, 나쁜 슬라이드 명세, 좋은 발표자 script, 좋은 최종 보고를 넣으면 결과물의 깊이와 형식이 안정됩니다. few-shot을 뒤에 장식처럼 붙이지 말고 명세 바로 다음에 두는 이유입니다.

### 출처

- Claude Code Hooks (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/hooks: https://docs.anthropic.com/en/docs/claude-code/hooks
- Claude Code Subagents (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/sub-agents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code Skills (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Claude Code Memory (deck-global)
  - https://docs.anthropic.com/en/docs/claude-code/memory: https://docs.anthropic.com/en/docs/claude-code/memory
- Model Context Protocol Server Features (deck-global)
  - Tools: https://modelcontextprotocol.io/specification/draft/server/tools
  - Resources: https://modelcontextprotocol.io/specification/draft/server/resources
  - Prompts: https://modelcontextprotocol.io/specification/draft/server/prompts
- OpenAI Evaluation Best Practices (deck-global)
  - https://developers.openai.com/api/docs/guides/evaluation-best-practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices

---

## Slide 80 / 21-2-bug-request-flow

- file: `21-2-bug-request-flow.html`
- section: Final Workflow (4/11)
- kind: workflow
- contentHash: `sha256:0b42c2a2f9ba20c4a4ad7e47cd71fc1eb8bafd4973ace42d4da957c2f3f964a1`

### 슬라이드 화면 내용

**제목:** 자료는 하네스를 통과하며 발표자료가 됩니다

**부제:** Claude가 바로 HTML을 쓰기 전에 brief, spec, few-shot을 거치게 해야 결과가 흔들리지 않습니다.

**불릿:**
- source.md는 대상, 시간, 목표를 고정합니다.
- slide-spec.json은 각 장의 메시지와 근거를 고정합니다.
- few-shots.md는 출력의 모양과 깊이를 고정합니다.
- deck-builder Skill은 생성과 검증 순서를 고정합니다.

**발표자 노트:** 발표 포인트 핵심은 HTML을 빨리 쓰는 것이 아니라, HTML을 쓰기 전의 결정들을 파일로 남기는 것입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

Claude가 바로 HTML을 쓰기 전에 `source.md`, `slide-spec.json`, `few-shots.md`를 거치게 해야 결과가 흔들리지 않습니다.
`source.md`는 대상, 시간, 목표를 고정합니다. `slide-spec.json`은 각 장의 메시지와 근거를 고정합니다. `few-shots.md`는 출력의 모양과 깊이를 고정합니다. `deck-builder` Skill은 이 파일들을 읽고 생성과 검증 순서를 실행하게 만듭니다.
핵심은 HTML을 빨리 쓰는 것이 아니라, HTML을 쓰기 전의 결정들을 파일로 남기는 것입니다.

### 출처

- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 81 / 21-3-final-report-template

- file: `21-3-final-report-template.html`
- section: Final Workflow (5/11)
- kind: main
- contentHash: `sha256:cd9b0862871178b46c4222b88fbdec22d362d87c2c3c8cfbd553bc2736adb581`

### 슬라이드 화면 내용

**제목:** 최종 보고는 덱 품질의 증거입니다

**부제:** 무엇을 만들었는지보다 어떤 검증을 통과했는지가 다음 세션의 기준이 됩니다.

**불릿:**
- 변경 파일
- 실행 명령
- 검증 결과
- 남은 위험과 확인 URL

**발표자 노트:** 발표 포인트 최종 보고는 “완료했습니다”가 아니라 다음 Claude와 발표자가 믿을 수 있는 증거 목록이어야 합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

최종 보고는 “완료했습니다”가 아니라 다음 Claude와 발표자가 믿을 수 있는 증거 목록이어야 합니다.
변경 파일, 실행 명령, broken link, note exposure, overflow, 확인 URL이 있어야 다음 세션이 같은 기준으로 이어집니다. 최종 보고의 Evaluation 항목은 실행한 검증과 남은 위험을 분리해 다음 세션이 같은 기준으로 판단하게 만듭니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 82 / 21-5-handoff-why

- file: `21-5-handoff-why.html`
- section: Final Workflow (6/11)
- kind: main
- contentHash: `sha256:38700a2fed2605cc9a19bf7f3043ceaef5fb7b2c73dc69257a9c378c2aa32412`

### 슬라이드 화면 내용

**제목:** Handoff는 다음 세션을 위한 기억 장치입니다

**부제:** 긴 작업은 한 번의 대화가 아니라 이어받을 수 있는 상태 파일로 관리합니다.

**불릿:**
- 목표와 현재 상태를 다시 설명하지 않아도 됩니다.
- 이미 결정한 규칙을 다음 Claude가 유지합니다.
- 검증 결과와 남은 위험이 작업 기준이 됩니다.

**발표자 노트:** 발표 포인트 handoff는 단순 메모가 아니라 다음 세션이 같은 기준으로 이어서 일하게 만드는 운영 장치입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

긴 작업은 한 번의 대화가 아니라 이어받을 수 있는 상태 파일로 관리합니다.
발표자료 생성 자동화에서는 handoff가 특히 중요합니다. 리서치 출처, 슬라이드 분해 기준, 발표용과 발표자 검토용 분리 규칙, 검증 결과가 다음 세션에 그대로 전달되어야 같은 품질로 이어서 작업할 수 있습니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 83 / 21-6-handoff-template

- file: `21-6-handoff-template.html`
- section: Final Workflow (7/11)
- kind: main
- contentHash: `sha256:bca3566d25805dcba58a73c4c8c3f44986e231d022fb77bc7367a588f4339661`

### 슬라이드 화면 내용

**제목:** HANDOFF.md는 상태와 결정을 같이 남깁니다

**부제:** 파일 목록보다 중요한 것은 현재 상태, 결정, 검증, 남은 일, 다음 프롬프트입니다.

**불릿:**
- Current State: 지금 어디까지 왔는가
- Decisions: 유지해야 할 설계 규칙
- Verification: 실제 확인한 증거
- Remaining Work / Next Prompt: 다음 세션의 시작점

**발표자 노트:** 발표 포인트 handoff에는 변경 내역뿐 아니라 결정 이유, 검증 증거, 다음 프롬프트가 같이 들어가야 합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

HANDOFF.md는 파일 목록이 아니라 다음 세션의 시작 조건입니다. Current State에는 지금 어디까지 왔는지, Decisions에는 유지해야 할 설계 규칙, Verification에는 실제로 통과한 명령과 결과를 적습니다.
Remaining Work에는 남은 일을 숨기지 않고 쓰고, Next Prompt에는 다음 세션이 바로 붙여넣을 수 있는 요청을 남깁니다. 이렇게 남기면 다음 세션은 처음부터 다시 판단하지 않고, 이미 합의된 기준 위에서 이어서 작업합니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 84 / 21-7-handoff-next-prompt

- file: `21-7-handoff-next-prompt.html`
- section: Final Workflow (8/11)
- kind: main
- contentHash: `sha256:42a0c6213a8d05ee0b8ef0759d3e868f3cc5ef100851cd8de7b9a6041bf98735`

### 슬라이드 화면 내용

**제목:** 다음 프롬프트까지 남겨야 handoff가 완성됩니다

**부제:** 다음 Claude가 어디서 시작해야 하는지 명시하면 작업 재시작 비용이 크게 줄어듭니다.

**불릿:**
- 먼저 현재 상태를 검증하게 합니다.
- 남은 작업만 수정하게 합니다.
- 완료 전 같은 검증 명령을 다시 실행하게 합니다.

**발표자 노트:** 발표 포인트 좋은 handoff는 다음 세션에게 “무엇을 읽고, 무엇을 건드리고, 무엇으로 완료를 증명할지”까지 넘깁니다.

**미디어/시각자료:** 없음

### 발표 스크립트

다음 Claude가 어디서 시작해야 하는지 명시하면 작업 재시작 비용이 크게 줄어듭니다.
핵심은 다음 프롬프트를 handoff 안에 같이 남기는 것입니다. 예를 들면 HANDOFF.md부터 읽고, 현재 덱 상태를 검증한 뒤, 남은 항목만 수정하고, 완료 전에 같은 검증 명령을 다시 실행하라고 적습니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 85 / 21-8-practice-handoff

- file: `21-8-practice-handoff.html`
- section: Final Workflow (9/11)
- kind: checkpoint
- contentHash: `sha256:928c8406c8437563f38622fad9d756e5e01623b2787ae903dbb9478a01ac70dd`

### 슬라이드 화면 내용

**제목:** 발표자료 handoff를 작성합니다

**부제:** 다음 세션이 슬라이드 작업을 이어받을 수 있도록 실제 HANDOFF.md의 다섯 칸을 채웁니다.

**불릿:**
- 없음

**발표자 노트:** 실습 목표 수강생이 만든 자동화 워크플로우가 한 세션에서 끝나지 않아도 이어질 수 있게 합니다.

**미디어/시각자료:** 없음

### 발표 스크립트

이 실습에서는 다음 세션이 슬라이드 작업을 이어받을 수 있도록 실제 HANDOFF.md의 다섯 칸을 채웁니다.
Current State에는 “HTML/CSS deck draft complete”처럼 현재 상태를 씁니다. Decisions에는 “note는 presenter-review에만 표시”처럼 유지해야 할 결정을 씁니다. Verification에는 `node scripts/verify-deck.js pass`처럼 실제 확인한 명령을 씁니다.
Remaining Work에는 “section 21 speaker script 보강”처럼 남은 일을 쓰고, Next Prompt에는 “HANDOFF.md부터 읽고 남은 항목만 수정”처럼 다음 세션의 시작 문장을 남깁니다. 이 결과물이 있어야 워크플로우가 한 번의 대화가 아니라 반복 가능한 운영 방식이 됩니다.

### 출처

- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 86 / 21-4-team-retrospective

- file: `21-4-team-retrospective.html`
- section: Final Workflow (10/11)
- kind: main
- contentHash: `sha256:e88be00f046d38b37259a0cd1af2c9fe79deb16a03f3378f836552d0ab24250f`

### 슬라이드 화면 내용

**제목:** 팀 회고 질문은 하나면 충분합니다

**부제:** AI가 두 번 이상 반복한 실수는 다음 하네스 후보입니다.

**불릿:**
- 두 번 말한 규칙은 CLAUDE.md로
- 두 번 반복한 절차는 Skill로
- 두 번 놓친 검증은 Hook으로
- 두 번 필요한 판단은 Subagent로

**발표자 노트:** 발표 포인트 AI가 두 번 이상 반복한 실수는 다음 하네스 후보입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

AI가 두 번 이상 반복한 실수는 다음 하네스 후보입니다. handoff까지 남겼다면 이제 팀 기준으로 회수합니다.
두 번 말한 규칙은 CLAUDE.md로 올리고, 두 번 반복한 절차는 Skill로 만들고, 두 번 놓친 검증은 Hook으로 강제합니다. 두 번 필요한 판단은 Subagent로 분리합니다.
이번 한국어 검교정처럼 반복되는 리뷰 기준도 회고에서 Skill과 에이전트 후보로 올릴 수 있습니다. 이렇게 해야 개인의 프롬프트 팁이 아니라 팀의 작업 시스템으로 축적됩니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

---

## Slide 87 / 21-9-practice-personal-harness

- file: `21-9-practice-personal-harness.html`
- section: Final Workflow (11/11)
- kind: checkpoint
- contentHash: `sha256:ae966e1390573b00ac306b5db91d56584da5a41e6edcd36d9f698c83ff634285`

### 슬라이드 화면 내용

**제목:** 내 프로젝트에 가져갈 하네스 3개를 고릅니다

**부제:** 반복 실패 하나를 규칙, 절차, 검증 후보로 나누면 다음 액션이 생깁니다.

**불릿:**
- 없음

**발표자 노트:** 마무리 AI가 두 번 이상 틀린 행동이 다음 하네스 후보입니다.

**미디어/시각자료:** 없음

### 발표 스크립트

마무리에서는 내 프로젝트에 가져갈 하네스 3개를 고릅니다. 반복 실패 하나를 규칙, 절차, 검증 후보로 나누면 다음 액션이 생깁니다.
예를 들어 “수정 전 관련 파일을 먼저 읽는다”는 CLAUDE.md 규칙이 될 수 있습니다. “bug-triage: 재현, 범위, 위험 정리”는 Skill 후보입니다. “수정 뒤 pnpm test 결과 보고”는 Hook이나 Evaluation 후보입니다.
기준은 단순합니다. AI가 두 번 이상 틀린 행동은 다음 하네스 후보입니다. 오늘 배운 CLAUDE.md, Skill, Hook, Evaluation을 팀의 최소 워크플로우로 가져가면 됩니다.

### 출처

- Claude Code Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks (slide)
- Claude Code Skills: https://docs.anthropic.com/en/docs/claude-code/skills (slide)
- Claude Code Memory: https://docs.anthropic.com/en/docs/claude-code/memory (slide)
- OpenAI Evaluation Best Practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices (slide)

