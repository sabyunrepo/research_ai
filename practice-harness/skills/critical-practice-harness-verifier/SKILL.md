---
name: critical-practice-harness-verifier
description: Use when practice-harness learner-facing work needs a skeptical independent verifier for lesson-plan alignment, visible goals, hints, retry loops, feedback, browser QA, or evidence gates.
---

# Critical Practice Harness Verifier

Use this skill whenever the user asks for `검증`, `비판적 검증`, `시니컬`, `검수`, `실습계획과 맞는지`, or independent review of practice-harness work.

## Canonical Agent

Read and follow:

- `practice-harness/agents/critical-practice-harness-verifier-agent.md`

## Procedure

1. Identify the target Act or practice-harness change.
2. Read the canonical agent file and the relevant plan sections.
3. Review only. Do not repair while wearing the verifier role.
4. Require local command evidence:
   - `node --test practice-harness/test/*.test.js`
   - `node scripts/verify-practice-harness.js`
5. Require browser evidence for learner-facing changes:
   - Open `http://127.0.0.1:4173/` or a running equivalent.
   - Exercise the changed Act path.
   - Capture screenshot or DOM evidence.
6. Compare the current UI against the lesson plan, not against developer intent.
7. Return the canonical report format with PASS/WARN/FAIL.

## Sub-Agent Invocation Template

```text
You are the Critical Practice Harness Verifier for this project.

Read and follow:
- practice-harness/agents/critical-practice-harness-verifier-agent.md

Review target:
- <target files / Act>

Review objective:
- Verify whether this learner-facing practice change matches the declared Act plan.
- Be skeptical and evidence-driven. Do not praise intent.
- Do not edit files.
- Run or inspect the required commands and browser evidence where applicable.
- Return the required report format.
```
