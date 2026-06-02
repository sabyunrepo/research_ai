# notebooklm-py CLI Contract

## Command Wrapper

Use the local NotebookLM client project:

```sh
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli <command>
```

Examples:

```sh
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli auth check --test --json
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli list --json
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli create "김아이 워크숍 슬라이드 내용" --json
```

## Authentication

Before mutating NotebookLM, run:

```sh
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli auth check --test --json
```

Require valid JSON with `"status": "ok"` and a successful token fetch. If it fails, use interactive login:

```sh
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli login
```

For stale browser cookies, try refresh first:

```sh
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli auth refresh
```

## Notebook and Source Commands

Create a notebook:

```sh
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli create "Notebook Title" --json
```

Add a project-local Markdown source with an explicit notebook id:

```sh
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli source add docs/harness/notebooklm-sources/example.md -n <notebook_id> --title "Source Title" --json
```

Ask a long prompt from a file:

```sh
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli ask -n <notebook_id> --prompt-file /tmp/notebooklm-request.txt --json --timeout 120
```

## Automation Rules

- Use explicit `-n <notebook_id>` instead of `use` in scripts.
- Use `--prompt-file` for long prompts.
- Save prompts and JSON responses when NotebookLM output is used to rewrite deck/script content.
- Do not delete notebooks or sources unless the user explicitly asks.
- NotebookLM uses unofficial Google APIs; failures can be auth, quota, or API-shape drift. Preserve failure evidence locally.
