# Context Research Artifacts

This directory stores project-local context research packs.

Rules:

- Keep all research packs, raw source lists, skipped-tool notes, and install recommendations under this project root.
- Do not store workflow notes in global/user agent directories.
- Use `.codex/skills/context-research-orchestrator/SKILL.md` before or around brainstorming when a task needs local context, current sources, library/API feasibility, or deck/report evidence.
- Validate packs with:

```sh
node scripts/validate-context-research-pack.js docs/context/<task-slug>-context-research-pack.md
```

Default pack structure:

```text
Context Triage
Brainstorming Summary
Targeted Research
Context Pack For Next Agent
```
