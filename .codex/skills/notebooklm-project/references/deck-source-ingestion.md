# Deck Source Ingestion For NotebookLM

## Source-Only Deck Export

When the user asks to inject slide content only, the source document must include only audience-facing slide text:

- slide number
- slide id
- section
- title/headline
- message/body copy
- visible bullets, anchors, map nodes, callouts, labels
- visual intent or alt text only when useful for context

Exclude:

- presentation scripts
- speaker notes
- presenter cues
- transition/bridge text used only by the presenter
- template/debug metadata
- visual review logs
- internal asset prompts unless the user asks for visual-generation review

The source file should open with a short policy statement, for example:

```md
이 문서는 NotebookLM 주입용 소스입니다. 화면에 쓰이는 슬라이드 문구만 포함하며 발표 스크립트, speaker notes, presenter cues, review metadata는 제외했습니다.
```

## Recommended Paths

Use:

```text
docs/harness/notebooklm-sources/<deck-slug>-slide-content-only.md
docs/harness/notebooklm-sources/<deck-slug>-review-prompt.md
docs/harness/notebooklm-script-rewrites/
docs/harness/notebooklm-feedback-rewrites/
```

Generated deck specific screenshots or temporary review artifacts may live under:

```text
generated-decks/<deck-slug>/review-screenshots/
generated-decks/<deck-slug>/context-research-pack.md
```

## Kimai Deck Source

For `generated-decks/kimai-workshop-content`, the source-only document is:

```text
docs/harness/notebooklm-sources/kimai-workshop-slide-content-only.md
```

Before uploading it, check that it excludes presenter-only content:

```sh
rg -n "speakerNote|presenterCues|sourcePresenterCues|keywordFlow|^- bridge:|^- transition:|발표 스크립트" docs/harness/notebooklm-sources/kimai-workshop-slide-content-only.md
```

The expected result is either no matches or matches only in the opening exclusion policy.

## Upload Pattern

```sh
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli auth check --test --json
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli create "김아이 워크숍 슬라이드 내용" --json
uv run --project /Users/sabyun/goinfre/notebooklm-py --extra browser python -m notebooklm.notebooklm_cli source add docs/harness/notebooklm-sources/kimai-workshop-slide-content-only.md -n <notebook_id> --title "김아이 워크숍 슬라이드 화면 문구" --json
```

Record the resulting notebook/source IDs in the task response or a project-local audit note when future agents need to continue.
