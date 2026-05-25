#!/usr/bin/env node
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const harnessRoot = path.join(root, "deck-harness");
const generatedRoot = path.join(root, "generated-decks");

function usage() {
  console.error("Usage: node deck-harness/scripts/scaffold-deck.js <topic-slug>");
  process.exit(1);
}

function writeNew(filePath, text) {
  if (fs.existsSync(filePath)) {
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text);
}

function json(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

function hashText(text) {
  return `sha256:${crypto.createHash("sha256").update(text).digest("hex")}`;
}

function main() {
  const slug = process.argv[2];
  if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    usage();
  }

  const deckDir = path.join(generatedRoot, slug);
  fs.mkdirSync(path.join(deckDir, "assets"), { recursive: true });
  fs.mkdirSync(path.join(deckDir, "slides"), { recursive: true });

  writeNew(
    path.join(deckDir, "topic-intake.md"),
    `# Topic Intake

## Topic

${slug}

## Audience

Not specified.

## Timebox

Not specified.

## Desired Output

HTML/CSS deck.

## Must Cover

- Not specified.

## Must Avoid

- Not specified.

## Prior Materials

- None.

## Source Preferences

Official sources first.

## Visual Style Preference

Use the deck-harness visual system.

## Success Criteria

- Generated deck passes \`node deck-harness/scripts/verify-deck-quality.js generated-decks/${slug}\`.
`
  );

  writeNew(
    path.join(deckDir, "research-dossier.md"),
    `# Research Dossier

## Executive Summary
## Core Concepts
## Official Sources
## Supporting Sources
## Claims To Use
## Claims To Avoid
Reviewed: none found.
## Date-Sensitive Notes
## Open Questions
## Suggested Examples
## Suggested Analogies
`
  );

  writeNew(
    path.join(deckDir, "claim-source-map.json"),
    json({
      topic: slug,
      checkedDate: new Date().toISOString().slice(0, 10),
      claims: [],
      claimsToAvoidReviewed: true,
      claimsToAvoid: [],
    })
  );

  writeNew(
    path.join(deckDir, "section-plan.json"),
    json({
      timeboxMinutes: 30,
      sections: [],
    })
  );

  writeNew(
    path.join(deckDir, "slide-spec.json"),
    json({
      slides: [],
    })
  );

  writeNew(
    path.join(deckDir, "glossary.json"),
    json({
      terms: [],
    })
  );

  const manifest = {
    jobId: `job-${slug}`,
    topicSlug: slug,
    createdAt: new Date().toISOString(),
    stages: [
      {
        name: "scaffold",
        owner: "scaffold-deck.js",
        inputs: [],
        outputs: ["topic-intake.md", "research-dossier.md", "claim-source-map.json", "section-plan.json", "slide-spec.json", "glossary.json"],
        inputHash: hashText(""),
        outputHash: "",
        status: "PASS",
        evidencePath: "HANDOFF.md#verification",
      },
    ],
  };
  writeNew(path.join(deckDir, "job-manifest.json"), json(manifest));

  writeNew(
    path.join(deckDir, "HANDOFF.md"),
    `# Deck Handoff

## Current State

Scaffold created. Fill source map, section plan, glossary, and slide spec before building.

## Inputs

- topic-intake.md
- research-dossier.md
- claim-source-map.json
- section-plan.json
- slide-spec.json
- glossary.json

## Evidence Map Status

No slide evidence has been generated yet.

## Source Coverage

No slide-visible claims yet.

## Generated Artifacts

- deck.html
- presenter-review.html
- assets/
- slides/

## Quality Gate Artifacts

- evaluation-log.md

## Verification

Command: node deck-harness/scripts/validate-deck-contract.js generated-decks/${slug}
Exit Code: pending
Artifact Path: evaluation-log.md

## Agent Findings

Status: WARN
Evidence path: HANDOFF.md

## Blocked Risks

- slide-spec.json is empty until content is authored.

## Non-Blocking Risks

- Visual style is still the default harness template.

## Next Prompt

Fill the deck inputs, build with \`node deck-harness/scripts/build-deck-from-spec.js generated-decks/${slug}\`, then verify with \`node deck-harness/scripts/verify-deck-quality.js generated-decks/${slug}\`.
`
  );

  writeNew(
    path.join(deckDir, "evaluation-log.md"),
    `# Evaluation Log

## Command
## Exit Code
## Summarized Output
## Artifact Path
## Viewport
## Checked Date
## Unresolved Count
## PASS/WARN/FAIL
`
  );

  for (const relative of ["deck.html", "presenter-review.html", "assets/style.css", "assets/deck.js", "assets/presenter-review.js"]) {
    const source = path.join(harnessRoot, "templates", relative);
    const target = path.join(deckDir, relative);
    if (fs.existsSync(source)) {
      writeNew(target, fs.readFileSync(source, "utf8"));
    }
  }

  console.log(`Created generated-decks/${slug}`);
}

main();
