# Practice Presentation UI RED/GREEN Evidence

Date: 2026-05-28

Scope:
- `practice-harness/public/index.html`
- `practice-harness/public/styles.css`
- `practice-harness/public/practice-app.js`
- `practice-harness/test/static-practice-server.test.js`

## RED

Command:

```bash
node --test practice-harness/test/static-practice-server.test.js
```

Observed failure before implementation:

```text
✖ GET / serves a presentation-optimized practice shell
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /presentation-shell/.
```

Meaning:
- The new presentation shell contract was added before the HTML/CSS implementation.
- The existing page did not yet expose `presentation-shell`, `stage-nav`, `slide-workbench`, or `live-scoreboard`.

## GREEN

Command:

```bash
node --test practice-harness/test/static-practice-server.test.js
```

Observed pass after implementation:

```text
✔ GET / serves the practice learner UI shell
✔ GET / serves a presentation-optimized practice shell
✔ static app delegates API routes to practice API
✔ static app rejects traversal and malformed paths
tests 4
pass 4
fail 0
```

Full regression command:

```bash
node --test practice-harness/test/*.test.js
```

Observed pass:

```text
tests 79
pass 79
fail 0
```

Harness command:

```bash
node scripts/verify-practice-harness.js
```

Observed pass:

```text
PASS practice harness tests
PASS act1 smoke attempt
PASS act2 smoke attempt
PASS act3 smoke attempt
PASS act4 smoke attempt
PASS act5 smoke attempt
PASS act6 smoke attempt
PASS lecture integration smoke
```

Browser evidence:
- Desktop screenshot: `.tmp/practice-slide-frame-1440x900.png`
- Lecture-room screenshot: `.tmp/practice-slide-frame-1024x768.png`
- Desktop metrics: frame 1280x720, ratio 1.7777777777777777, body overflow 0, frame overflow 0.
- 1024x768 metrics: frame 992x558, ratio 1.7777777777777777, body overflow 0, frame overflow 0.
- Header and Act navigation clipping checks: false for header clipping, true for every nav button keeping text inside.

## Fixed Slide Frame Regression

Command:

```bash
node --test practice-harness/test/static-practice-server.test.js
```

Observed failure before fixed-frame implementation:

```text
✖ GET / serves a presentation-optimized practice shell
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /practice-slide-frame/.

✖ presentation UI uses a fixed 16:9 slide frame like generated decks
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /\.practice-slide-frame\s*{/.
```

Observed pass after fixed-frame implementation:

```text
tests 7
pass 7
fail 0
```

## Presentation Flow Regression

Problem:
- The projector surface still exposed the Act selector rail as presentation UI.
- Successful verification did not make the next step feel like a slide progression.

RED command:

```bash
node --test practice-harness/test/static-practice-server.test.js
```

Observed failures before implementation:

```text
✖ presentation slide hides the act selector rail from the projector
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /hidden/

✖ presentation app advances through result actions instead of act selector buttons
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /function renderResultActions/
```

GREEN commands:

```bash
node --test practice-harness/test/static-practice-server.test.js
node --test practice-harness/test/*.test.js
node scripts/verify-practice-harness.js
```

Observed pass:

```text
static-practice-server.test.js: tests 9, pass 9, fail 0
practice-harness/test/*.test.js: tests 81, pass 81, fail 0
verify-practice-harness.js: PASS practice harness tests
```

Browser evidence:
- Initial screenshot: `.tmp/practice-slide-hidden-nav-initial.png`
- Act 1 fail action screenshot: `.tmp/practice-slide-act1-fail-actions.png`
- Act 1 pass/next action screenshot: `.tmp/practice-slide-act1-pass-next.png`
- Act 2 pass/next action screenshot: `.tmp/practice-slide-act2-pass-next.png`
- Initial metrics: `stage-nav` hidden attribute true, `inert` attribute present, `aria-hidden="true"`, computed display `none`, visible Act selector buttons `[]`, frame `1280x720`, body overflow false.
- Keyboard tab sequence check: first 8 Tab stops stayed outside `.stage-nav`; no hidden Act selector button entered keyboard focus.
- Act 1 fail result actions: `["다시하기"]`, with explanatory feedback for missing required information.
- Act 1 final pass result actions: `["다시하기", "다음으로"]`, visible Act selector buttons `[]`.
- After clicking `다음으로`, heading changes to Act 2 and visible Act selector buttons remain `[]`.
- Act 2 pass result actions: `["다시하기", "다음으로"]`, score `100/100`, visible Act selector buttons `[]`.
- Act 2 `다시하기` clears the submitted textarea, resets the score to `- / 아직 제출하지 않았습니다`, and removes result actions for retry.
- Act 2 `다음으로` after a second pass changes the heading to Act 3 while visible Act selector buttons remain `[]`.

## Full Result Slide Regression

Problem:
- Verification results must not appear as a side panel beside the problem.
- Pressing `문제 확인` must turn the whole slide surface into a result slide, with retry/next actions at the bottom.

GREEN commands:

```bash
node --test practice-harness/test/static-practice-server.test.js
node --test practice-harness/test/*.test.js
node scripts/verify-practice-harness.js
```

Observed pass:

```text
static-practice-server.test.js: tests 12, pass 12, fail 0
practice-harness/test/*.test.js: tests 84, pass 84, fail 0
verify-practice-harness.js: PASS practice harness tests
```

Browser evidence:
- Question-only screenshot: `.tmp/practice-slide-question-only.png`
- Full fail result screenshot: `.tmp/practice-slide-full-result-fail.png`
- Full pass result screenshot: `.tmp/practice-slide-full-result-pass-next-question.png`
- Before checking: `#practice-slide` visible, `#result-panel` hidden with computed display `none`.
- Failed check: `#practice-slide` hidden with computed display `none`; `#result-panel` visible with computed display `grid`; result slide rect `1232x678` inside the 16:9 frame; visible actions `["다시하기", "다음 문제 풀기"]`; `다음 문제 풀기` is disabled until pass; problem text not visible.
- Passed check for Act 1 question 1: result slide visible full-frame; actions `["다시하기", "다음 문제 풀기"]`; problem text not visible.
- Clicking `다음 문제 풀기` returns to practice slide and hides result slide.
- 1024x768 fail check: practice display `none`, result display `grid`, result rect `944x516`, actions `["다시하기"]`, problem text not visible, body overflow false.
- 900x600 fail check: practice display `none`, result display `grid`, result rect `820x446`, actions `["다시하기"]`, problem text not visible, body overflow false.
- Act 1 final pass after all 3 questions: result display `grid`, score `100/100`, actions `["다시하기", "다음으로"]`, problem text not visible.
- Clicking `다음으로` after Act 1 final pass returns to practice slide, hides result slide, and moves heading to Act 2.
