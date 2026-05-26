# AI Agent Harness Engineering - 개선본 발표 프롬프트

생성 시각: 2026-05-25T15:31:36.865Z

이 문서는 NotebookLM에서 `AI Agent Harness Engineering: Building Scalable Automation Workflows` 강의 덱의 발표 스크립트와 구성 검토를 요청할 때 사용할 기준 프롬프트입니다.

## 발표 목표

- 청중이 "프롬프트를 잘 쓰는 요령"이 아니라 "AI가 반복해서 안전하게 일하는 작업 환경을 설계하는 법"을 이해하게 합니다.
- Prompt, Context, Skill, Subagent, Hook, MCP, Evaluation, Handoff를 하나의 자동화 하네스 구조로 연결합니다.
- 초보 수강생도 따라올 수 있도록 공식 용어는 유지하되, 첫 등장 때 한국어로 짧게 풀이합니다.
- 발표자는 화면의 제목, 부제, 불릿, 노트와 같은 순서로 말하고, 화면에 없는 새 주장이나 출처 없는 사례를 추가하지 않습니다.

## 발표 톤

- 한국어 구어체로 말합니다.
- "발표자는", "이 슬라이드는" 같은 메타 설명을 피하고, 청중에게 직접 설명합니다.
- 과장된 마케팅 문구보다 실제 작업 흐름, 실패 증상, 검증 방법을 중심으로 설명합니다.
- 각 슬라이드는 앞 장의 핵심을 한 문장으로 이어받고, 다음 장으로 넘어갈 이유를 자연스럽게 남깁니다.

## NotebookLM 요청 템플릿

```text
아래 강의 덱의 Slide <번호> 발표 스크립트를 개선해 주세요.

요청:
- 한국어로 자연스럽게 발표자가 실제로 말할 수 있는 스크립트로 개선해 주세요.
- 화면의 제목, 부제, 불릿, 발표자 노트와 어긋나는 새 주장이나 예시는 넣지 마세요.
- 초보 수강생도 이해할 수 있게 전문 용어는 첫 등장 때 짧게 풀어 주세요.
- 기존 스크립트보다 흐름을 더 매끄럽게 만들되, 과장된 마케팅 문구는 피하세요.
- 다음 슬라이드로 넘어가는 연결 문장을 마지막에 자연스럽게 넣어도 됩니다.
- 결과는 교체 가능한 발표 스크립트 본문만 주세요. "개선안", "요약", Markdown 제목은 붙이지 마세요.
```

## 섹션 흐름

- 00: 오프닝 / 문제 제기 (3 slides)
- 01: 실패 패턴 (8 slides)
- 02: 전체 지도 (4 slides)
- 03: Spec / Prompt (16 slides)
- 04: Context / Memory (8 slides)
- 05: Skills / Superpowers (10 slides)
- 06: Agents / Tools (11 slides)
- 07: Hooks / Verification (12 slides)
- 08: Final Workflow (11 slides)

## 품질 기준

- 화면 문구와 발표 스크립트가 같은 개념을 설명해야 합니다.
- 공식 파일명과 명령어는 원문으로 유지합니다.
- `CLAUDE.md`, `Skill`, `Subagent`, `Hook`, `MCP`, `Evaluation`, `HANDOFF.md` 같은 핵심 용어는 흐름상 필요한 곳에서 빠지면 안 됩니다.
- 발표 스크립트에는 NotebookLM citation 표기인 `[1]`, `[2]`를 넣지 않습니다.
- 완료 전에는 slide count 83, speaker script 83개, source-sensitive term alignment를 확인합니다.
