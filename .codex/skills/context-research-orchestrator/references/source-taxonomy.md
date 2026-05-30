# Source Taxonomy

Use these labels in Evidence Table rows.

## Source Types

`official`
: Vendor, product, framework, standard body, government, or maintainer documentation.

`primary`
: Original paper, source repository, release note, legal text, dataset, direct artifact, or local project file.

`local`
: Current project source file, test, schema, handoff, AGENTS.md, generated contract, or command output.

`secondary`
: Blog, tutorial, news article, course, explainer, marketplace page, or third-party summary.

`community`
: Forum, Reddit, issue discussion, Discord excerpt, user comment, or anecdotal report.

`inference`
: Reasoned conclusion drawn from listed evidence. Must name the evidence it depends on.

`assumption`
: User-provided or temporary working assumption. Must be listed under Risks / Unknowns if important.

## Confidence

`high`
: Official/primary/local evidence directly supports the claim and no conflict was found.

`medium`
: Evidence supports the claim but is secondary, incomplete, version-sensitive, or partly inferred.

`low`
: Evidence is weak, old, conflicting, or enough only to guide a question rather than a decision.

## Date Rules

Always include checked date for:

- current product behavior
- APIs and package versions
- prices and plans
- policy, legal, financial, medical, or security claims
- schedules, release status, availability, or market facts
- recommendations that could change over time

For durable local facts, use the current work date or the file's observed state.

## Claim Separation

Do not blend claims and evidence.

Good:

```text
claim: Context7 can fetch library docs through CLI.
evidence: CLI docs describe `ctx7 library` then `ctx7 docs`.
source: https://context7.com/docs/clients/cli
source type: official
```

Bad:

```text
Context7 is great and should be installed because everyone uses it.
```
