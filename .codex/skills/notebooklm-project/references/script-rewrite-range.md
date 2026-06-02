# NotebookLM Script Rewrite Range

Use this when NotebookLM should rewrite a range of presenter scripts while preserving existing NotebookLM script sources.

## Rules

- Do not delete or replace existing NotebookLM sources unless the user explicitly asks.
- Add the updated source-only slide document as an additional source when slide structure changed.
- Keep NotebookLM prompts scoped to one slide at a time.
- Ask for the replacement script body only. Do not accept Markdown headings, bullets, citations, or commentary as the script.
- Do not allow emojis in NotebookLM prompts or accepted script answers.
- Save every request prompt and JSON response under `docs/harness/notebooklm-script-rewrites/<deck-slug>/`.
- After each accepted NotebookLM script answer, add that generated script back into the same notebook as a new source so later slide requests can reference the already-rewritten flow.
- Also include the local previous rewritten script in the next prompt, because NotebookLM source indexing can lag.
- Apply NotebookLM answers to `presentation-script.json`, then regenerate `presentation-script.md`.

## Recommended Prompt Contract

Each prompt should include:

- deck and audience
- target slide number and id
- screen-only source reminder
- current script format requirements
- previous slide and next slide titles for flow
- current script text as style/format reference
- instruction to return only natural Korean presenter script prose
- instruction to avoid emojis

Do not ask NotebookLM to include citations or emojis. NotebookLM source markers such as `[1]`, `[2]` must be stripped or rejected before applying.

## Verification

After applying rewrites:

```sh
node deck-harness/scripts/verify-presentation-script.js generated-decks/kimai-workshop-content
node deck-harness/scripts/validate-deck-contract.js --stage=structure generated-decks/kimai-workshop-content
```

Check the saved response count:

```sh
find docs/harness/notebooklm-script-rewrites/kimai-workshop-content/responses -name 'slide-*.json' | wc -l
```

For slides 37-74, expect 38 response files.

Check generated script source injection records:

```sh
find docs/harness/notebooklm-script-rewrites/kimai-workshop-content/injected-sources -name 'slide-*.json' | wc -l
```
