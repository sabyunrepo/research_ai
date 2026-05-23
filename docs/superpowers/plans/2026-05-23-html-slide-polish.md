# HTML Slide Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing researched HTML lecture cuts into a single deck view that is easier to present, review, and export as PDF/PPT-style slides.

**Architecture:** Keep the existing per-cut HTML files as the source of truth. Add one single-page deck shell that loads those cuts, wraps each one in a fixed 16:9 frame, and uses CSS print rules for export. This avoids duplicating slide content while making the output feel like a presentation deck.

**Tech Stack:** Plain HTML, CSS, and browser JavaScript; no build step.

---

### Task 1: Add Single Deck Surface

**Files:**
- Create: `lecture-cuts/deck.html`
- Create: `lecture-cuts/assets/deck.js`
- Modify: `lecture-cuts/assets/style.css`

- [ ] **Step 1: Create `deck.html`**

Create a single page with a fixed toolbar, deck metadata, and an empty `#deck` container. Load `assets/deck.js` with `defer`.

- [ ] **Step 2: Create `deck.js`**

Define the 22 slide filenames in order. Fetch each existing HTML file, parse the `.slide` element, remove embedded `.nav`, and append it into a `.deck-frame`.

- [ ] **Step 3: Add deck CSS**

Add `.deck-page`, `.deck-toolbar`, `.deck-strip`, `.deck-frame`, and print rules to `assets/style.css`. In deck mode, override slide typography and media sizing so each slide fits inside a 16:9 frame.

### Task 2: Wire Index Navigation

**Files:**
- Modify: `lecture-cuts/index.html`

- [ ] **Step 1: Add a deck link**

Add a primary action link to `deck.html` next to the existing presenter preview and design rules links.

- [ ] **Step 2: Keep existing cuts unchanged**

Do not rewrite the 22 individual slide files. They remain direct editable source cuts.

### Task 3: Verify Locally

**Files:**
- Read-only verification against `lecture-cuts/deck.html`

- [ ] **Step 1: Load deck in browser**

Open `http://127.0.0.1:57610/lecture-cuts/deck.html`.

- [ ] **Step 2: Check generated content**

Verify that the rendered deck contains 22 `.deck-frame` elements, zero missing images, and no error state.

- [ ] **Step 3: Check export mode**

Evaluate print CSS by checking that the toolbar is hidden in `print` media and each `.deck-frame` has a page break rule.

- [ ] **Step 4: Check git state**

Run `git status --short` and report changed files.
