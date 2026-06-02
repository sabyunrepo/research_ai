---
name: notebooklm-project
description: Use for project-local NotebookLM workflows in research_ai, including creating NotebookLM notebooks, exporting deck/report sources, injecting sources with /Users/sabyun/goinfre/notebooklm-py, asking NotebookLM for review or rewrites, and recording source-only NotebookLM artifacts under the project root.
---

# NotebookLM Project Workflow

Use this skill when the task mentions NotebookLM, notebooklm-py, notebook source injection, NotebookLM review, NotebookLM rewrite, or NotebookLM-generated artifacts for this repository.

## Core Rules

- Keep all project-specific NotebookLM prompts, source docs, outputs, and audit notes under this repo.
- Prefer `docs/harness/notebooklm-sources/` for reusable source documents.
- Do not put long NotebookLM instructions in `AGENTS.md` or `CLAUDE.md`; keep details in `references/`.
- Use `/Users/sabyun/goinfre/notebooklm-py` as the CLI project unless the user explicitly gives another NotebookLM client.
- Verify auth with a network test before creating or mutating notebooks.
- Avoid relying on implicit notebook context in automation. Prefer explicit `-n <notebook_id>`.

## Procedure

1. Read [references/notebooklm-py-cli.md](references/notebooklm-py-cli.md) for the exact command wrapper and auth checks.
2. If exporting deck material, read [references/deck-source-ingestion.md](references/deck-source-ingestion.md).
3. If rewriting presenter scripts from NotebookLM answers, read [references/script-rewrite-range.md](references/script-rewrite-range.md).
4. Create or update the source document under the project root before uploading it.
5. Run NotebookLM commands through the local `uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli ...` wrapper.
6. Save NotebookLM request prompts and machine-readable responses under a project-local `docs/harness/` or generated deck directory when the result will be reused.
7. Report the notebook ID, source file path, source title, and verification status.

## Verification

- Source file exists under this repo and states its inclusion/exclusion policy.
- `auth check --test --json` succeeds before NotebookLM mutation.
- For deck source-only ingestion, grep or script-check that speaker scripts, presenter cues, and speaker notes were not included.
- For script rewrites, verify script order still matches `slide-spec.json`, every requested slide has a saved NotebookLM response, and deck script validation passes.
- If NotebookLM CLI fails, preserve stderr/stdout in a project-local audit note and do not claim the source was injected.
