# Codex Session Decision Log

Generated: 2026-05-25T03:43:30.992Z

## Stable Decisions

- 4시간 워크숍 기준으로 강의 자료 흐름과 검증 기준을 맞춘다. (source: 019e53be-3348-7791-a7cc-c73f20a8d8c3)
- lecture-cuts/를 현재 강의 본편 또는 golden reference로 다룬다. (source: 019e53be-3348-7791-a7cc-c73f20a8d8c3)
- 기술적 주장과 공식 API/도구 설명은 출처와 확인 날짜를 남긴다. (source: 019e53be-3348-7791-a7cc-c73f20a8d8c3)
- 조사, 검증, 비판, handoff는 역할별 에이전트로 분리한다. (source: 019e53be-3348-7791-a7cc-c73f20a8d8c3)
- 자료 생성은 일회성 편집이 아니라 반복 가능한 harness와 gate로 관리한다. (source: 019e53be-3348-7791-a7cc-c73f20a8d8c3)
- lecture-cuts/를 현재 강의 본편 또는 golden reference로 다룬다. (source: 019e54d5-629f-7b80-89ac-a80c628987af)
- lecture-deck/는 재사용 가능한 HTML/CSS deck harness 샘플로 취급한다. (source: 019e54d5-629f-7b80-89ac-a80c628987af)
- 기술적 주장과 공식 API/도구 설명은 출처와 확인 날짜를 남긴다. (source: 019e54d5-629f-7b80-89ac-a80c628987af)
- 조사, 검증, 비판, handoff는 역할별 에이전트로 분리한다. (source: 019e54d5-629f-7b80-89ac-a80c628987af)
- 자료 생성은 일회성 편집이 아니라 반복 가능한 harness와 gate로 관리한다. (source: 019e54d5-629f-7b80-89ac-a80c628987af)
- lecture-cuts/를 현재 강의 본편 또는 golden reference로 다룬다. (source: 019e5ca4-1a92-7051-8c88-40b2ea9a4376)
- lecture-deck/는 재사용 가능한 HTML/CSS deck harness 샘플로 취급한다. (source: 019e5ca4-1a92-7051-8c88-40b2ea9a4376)
- 기술적 주장과 공식 API/도구 설명은 출처와 확인 날짜를 남긴다. (source: 019e5ca4-1a92-7051-8c88-40b2ea9a4376)
- 조사, 검증, 비판, handoff는 역할별 에이전트로 분리한다. (source: 019e5ca4-1a92-7051-8c88-40b2ea9a4376)
- 자료 생성은 일회성 편집이 아니라 반복 가능한 harness와 gate로 관리한다. (source: 019e5ca4-1a92-7051-8c88-40b2ea9a4376)
- 4시간 워크숍 기준으로 강의 자료 흐름과 검증 기준을 맞춘다. (source: 019e5cae-89cd-78c3-aadd-162b9d24cec6)
- lecture-cuts/를 현재 강의 본편 또는 golden reference로 다룬다. (source: 019e5cae-89cd-78c3-aadd-162b9d24cec6)
- lecture-deck/는 재사용 가능한 HTML/CSS deck harness 샘플로 취급한다. (source: 019e5cae-89cd-78c3-aadd-162b9d24cec6)
- 일반인이 모를 개발 용어와 영문 표현은 glossary/tooltip으로 설명한다. (source: 019e5cae-89cd-78c3-aadd-162b9d24cec6)
- 기술적 주장과 공식 API/도구 설명은 출처와 확인 날짜를 남긴다. (source: 019e5cae-89cd-78c3-aadd-162b9d24cec6)
- 조사, 검증, 비판, handoff는 역할별 에이전트로 분리한다. (source: 019e5cae-89cd-78c3-aadd-162b9d24cec6)
- 자료 생성은 일회성 편집이 아니라 반복 가능한 harness와 gate로 관리한다. (source: 019e5cae-89cd-78c3-aadd-162b9d24cec6)

## Superseded Decisions

- Earlier sample-only harness expectations are superseded by the reusable topic-to-deck workflow requirement.
- A non-empty HANDOFF.md check is superseded by a parsed reproduction contract with commands, risks, and evidence paths.
- Native browser title tooltip behavior is superseded by the custom glossary tooltip requirement.

## Quality Failures Observed

- 대화 중 발견된 경고, 중복, tooltip 부분 매칭, overflow, 출처 누락 이슈를 회귀 검증에 포함해야 한다. (source: 019e53be-3348-7791-a7cc-c73f20a8d8c3)
- 미완성 placeholder나 mock 산출물은 handoff 전에 차단해야 한다. (source: 019e5ca4-1a92-7051-8c88-40b2ea9a4376)
- 대화 중 발견된 경고, 중복, tooltip 부분 매칭, overflow, 출처 누락 이슈를 회귀 검증에 포함해야 한다. (source: 019e5cae-89cd-78c3-aadd-162b9d24cec6)

## User Preferences

- Korean-first explanations for general learners.
- Technical English terms may appear when useful, but the Korean meaning and original phrase must be clear.
- Deck work should be evidence-backed, browser-verified, and reproducible through scripts.
- Agent outputs should be summarized into findings, actions, judgment, unresolved items, and evidence.
- Reusable workflow, harness, skills, and handoff matter more than one-off slide editing.

## Workflow Requirements

- Collect all four project-level Codex sessions before building generic deck-harness agents or skills.
- Treat subagent transcripts as supporting evidence tied to their parent session, not as separate top-level user sessions.
- Use the session source map when a decision, risk, or preference comes from conversation history.
- Keep generated deck quality gates tied to source maps, slide specs, glossary registry, presenter review, and handoff evidence.

## Open Questions

- None for Task 0A. Downstream tasks still need to inspect the raw transcripts before using a session-derived rule.
