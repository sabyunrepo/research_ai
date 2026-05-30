#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

function usage() {
  console.error(
    "Usage: node scripts/validate-context-research-pack.js [--allow-template] <path-to-context-research-pack.md>",
  );
}

function findProjectRoot() {
  try {
    return execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return process.cwd();
  }
}

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function extractSection(text, heading, nextHeadingPattern = /^### |^## /m) {
  const start = text.indexOf(heading);
  if (start === -1) {
    return "";
  }
  const afterHeading = text.slice(start + heading.length);
  const next = afterHeading.search(nextHeadingPattern);
  return (next === -1 ? afterHeading : afterHeading.slice(0, next)).trim();
}

function parseMarkdownTable(section) {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"))
    .filter((line) => !/^\|\s*-+\s*\|/.test(line))
    .map((line) => splitMarkdownTableRow(line).map((cell) => cell.trim()))
    .filter((row) => row.length > 0);
}

function splitMarkdownTableRow(line) {
  const cells = [];
  let current = "";
  let escaped = false;
  let inBackticks = false;
  const body = line.slice(1, -1);

  for (const char of body) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      current += char;
      escaped = true;
      continue;
    }
    if (char === "`") {
      inBackticks = !inBackticks;
      current += char;
      continue;
    }
    if (char === "|" && !inBackticks) {
      cells.push(current);
      current = "";
      continue;
    }
    current += char;
  }

  cells.push(current);
  return cells;
}

function metadataValue(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

function taskClassificationValue(text, fieldName) {
  const section = extractSection(text, "### Task Classification");
  const rows = parseMarkdownTable(section).slice(1);
  const row = rows.find((cells) => cells[0] === fieldName);
  return row ? row[1] : "";
}

function isUrl(value) {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
}

function normalizedEnum(value) {
  return (value || "").trim().split(/\s+/)[0].toUpperCase();
}

function normalizedLowerEnum(value) {
  return (value || "").trim().split(/\s+/)[0].toLowerCase();
}

function columnIndex(headerRow, name) {
  return headerRow.findIndex((cell) => cell.trim() === name);
}

function splitIds(value) {
  return (value || "")
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractOutputSections(text) {
  const headings = [
    "### Install Recommendations",
    "### Raw Source List",
    "### Recommended Next Step",
    "### Use This Context",
    "### Tool Detection",
  ];
  return headings.map((heading) => extractSection(text, heading)).join("\n");
}

const allowTemplate = process.argv.includes("--allow-template");
const input = process.argv.filter((arg) => arg !== "--allow-template")[2];
if (!input) {
  usage();
  process.exit(2);
}

const root = findProjectRoot();
const target = path.resolve(process.cwd(), input);
const errors = [];
const warnings = [];

if (!isInside(target, root)) {
  errors.push(`artifact is outside project root: ${target}`);
}

if (!fs.existsSync(target)) {
  errors.push(`file does not exist: ${input}`);
} else {
  const text = fs.readFileSync(target, "utf8");
  const requiredHeadings = [
    "# Context Research Pack",
    "## 1. Context Triage",
    "### Tool Detection",
    "## 2. Brainstorming Summary",
    "## 3. Targeted Research",
    "### Search Plan",
    "### Search Iterations",
    "### Evidence Table",
    "### Sufficiency Check",
    "### Stop Condition",
    "### Limiting Constraint",
    "### Research State Snapshot",
    "### Source Ledger",
    "### Claim Support Check",
    "## 4. Context Pack For Next Agent",
    "### Install Recommendations",
  ];

  for (const heading of requiredHeadings) {
    if (!text.includes(heading)) {
      errors.push(`missing required heading: ${heading}`);
    }
  }

  const evidenceHeader =
    "| claim id | claim | evidence | source id(s) | source type | checked date | confidence | relevance |";
  if (!text.includes(evidenceHeader)) {
    errors.push("missing required Evidence Table header");
  }

  const toolHeader = "| tool | available | used | fallback | note |";
  if (!text.includes(toolHeader)) {
    errors.push("missing required Tool Detection table header");
  }

  const searchPlanHeader = "| research question | query family | example queries | source target | status |";
  if (!text.includes(searchPlanHeader)) {
    errors.push("missing required Search Plan table header");
  }

  const searchIterationsHeader =
    "| iteration | query families used | new evidence found | unresolved questions | next action |";
  if (!text.includes(searchIterationsHeader)) {
    errors.push("missing required Search Iterations table header");
  }

  const sufficiencyHeader = "| criterion | status | evidence / note |";
  if (!text.includes(sufficiencyHeader)) {
    errors.push("missing required Sufficiency Check table header");
  }

  const limitingConstraintHeader = "| constraint type | evidence / note |";
  if (!text.includes(limitingConstraintHeader)) {
    errors.push("missing required Limiting Constraint table header");
  }

  const stateHeader = "| state item | value |";
  if (!text.includes(stateHeader)) {
    errors.push("missing required Research State Snapshot table header");
  }

  const sourceLedgerHeader = "| source id | title | url/path | source type | checked date | used by claims |";
  if (!text.includes(sourceLedgerHeader)) {
    errors.push("missing required Source Ledger table header");
  }

  const claimSupportHeader =
    "| claim id | source id | support verdict | evidence locator / quote summary | reviewer note |";
  if (!text.includes(claimSupportHeader)) {
    errors.push("missing required Claim Support Check table header");
  }

  if (!/Brainstorming phase:\s*(preflight|post-brainstorm|both)/.test(text)) {
    errors.push("Brainstorming phase must be preflight, post-brainstorm, or both");
  }

  const statusPattern = allowTemplate ? /^Status:\s*(PASS|WARN|FAIL|PASS\|WARN\|FAIL)\s*$/m : /^Status:\s*(PASS|WARN|FAIL)\s*$/m;
  if (!statusPattern.test(text)) {
    errors.push("Status must be PASS, WARN, or FAIL");
  }

  if (!/Context7/i.test(text)) {
    warnings.push("Context7 is not mentioned; confirm library-doc tooling was not relevant");
  }

  if (!/checked date/i.test(text) && !/checked date \|/.test(text)) {
    warnings.push("checked date wording not found");
  }

  if (!allowTemplate) {
    const status = normalizedEnum(metadataValue(text, "Status"));
    const projectRootValue = metadataValue(text, "Project root");
    if (!projectRootValue || /current repository root/i.test(projectRootValue)) {
      errors.push("Project root must be the concrete project root path for completed packs");
    } else if (!path.isAbsolute(projectRootValue)) {
      errors.push("Project root must be an absolute path for completed packs");
    } else if (path.resolve(projectRootValue) !== root) {
      errors.push(`Project root does not match git root: ${projectRootValue}`);
    }

    const placeholderPatterns = [
      /\|\s*\|\s*\|\s*pending\|read\|skipped\s*\|/,
      /\|\s*\|\s*\|\s*\|\s*official\|primary\|local\|secondary\|community\s*\|\s*planned\|searched\|skipped\s*\|/,
      /\|\s*1\s*\|\s*\|\s*\|\s*\|\s*search again\|stop\s*\|/,
      /\|\s*C1\s*\|\s*\|\s*\|\s*S1\s*\|\s*official\|primary\|local\|secondary\|inference\|assumption\s*\|\s*YYYY-MM-DD\s*\|/,
      /\|\s*enough distinct query families used\s*\|\s*pass\|warn\|fail\s*\|\s*\|/,
      /\|\s*none\|user_requested\|tool_unavailable\|budget_exhausted\|local_only\|web_unavailable\s*\|\s*\|/,
      /\|\s*research questions tracked\s*\|\s*\|/,
      /\|\s*S1\s*\|\s*\|\s*\|\s*official\|primary\|local\|secondary\|community\s*\|\s*YYYY-MM-DD\s*\|/,
      /\|\s*C1\s*\|\s*S1\s*\|\s*supported\|partial\|unsupported\|contradicted\|unknown\s*\|/,
      /\|\s*\|\s*\|\s*\|/,
      /Task:\s*$/,
      /Recommended next action:\s*$/,
      /Project root:\s*$/,
    ];

    for (const pattern of placeholderPatterns) {
      if (pattern.test(text)) {
        errors.push("pack still contains blank template placeholders; use --allow-template only for template validation");
        break;
      }
    }

    const installSection = text.split("### Install Recommendations")[1] || "";
    if (!installSection.trim() || installSection.trim() === "-") {
      errors.push("Install Recommendations must state none or list concrete recommendations");
    }

    const rawSourceSection = text.split("### Raw Source List")[1] || "";
    if (!rawSourceSection.trim() || rawSourceSection.trim() === "-") {
      errors.push("Raw Source List must include at least one source or an explicit none");
    }

    const stopSection = extractSection(text, "### Stop Condition", /^### /m);
    if (!stopSection.trim() || /^-\s*$/.test(stopSection.trim())) {
      errors.push("Stop Condition must explain why research stopped");
    }

    const searchedRows = text
      .split("\n")
      .filter((line) => line.includes("| searched |") || line.includes("|searched|"));
    if (searchedRows.length === 0 && !/external search skipped|web unavailable|local only/i.test(text)) {
      errors.push("Search Plan must include at least one searched query family or an explicit skipped-search reason");
    }

    const searchPlanTable = parseMarkdownTable(extractSection(text, "### Search Plan"));
    const searchPlanHeaderRow = searchPlanTable[0] || [];
    const queryFamilyIndex = columnIndex(searchPlanHeaderRow, "query family");
    const searchStatusIndex = columnIndex(searchPlanHeaderRow, "status");
    if (queryFamilyIndex === -1 || searchStatusIndex === -1) {
      errors.push("Search Plan table must include query family and status columns");
    }
    const searchPlanRows = searchPlanTable.slice(1);
    const searchedQueryFamilies = new Set(
      searchPlanRows
        .filter((cells) => cells[searchStatusIndex] === "searched")
        .map((cells) => cells[queryFamilyIndex])
        .filter(Boolean),
    );

    const highStakes = taskClassificationValue(text, "high-stakes domain") === "yes";
    const libraryNeeded = taskClassificationValue(text, "라이브러리/API 문서 필요") === "yes";
    const deckNeeded = taskClassificationValue(text, "PPT/deck/report 자료 필요") === "yes";
    const taskType = taskClassificationValue(text, "작업 유형");
    const publicOrWorkflow =
      deckNeeded || libraryNeeded || /workflow|shared|public|report|deck|ppt|library|api|design/i.test(taskType);
    const minimumFamilies = highStakes ? 7 : publicOrWorkflow ? 5 : 3;
    const limitingConstraintTable = parseMarkdownTable(extractSection(text, "### Limiting Constraint"));
    const limitingConstraintHeaderRow = limitingConstraintTable[0] || [];
    const limitingConstraintTypeIndex = columnIndex(limitingConstraintHeaderRow, "constraint type");
    const limitingConstraintNoteIndex = columnIndex(limitingConstraintHeaderRow, "evidence / note");
    if (limitingConstraintTypeIndex === -1 || limitingConstraintNoteIndex === -1) {
      errors.push("Limiting Constraint table must include constraint type and evidence / note columns");
    }
    const limitingConstraintRows = limitingConstraintTable.slice(1);
    const allowedConstraintTypes = new Set([
      "none",
      "user_requested",
      "tool_unavailable",
      "budget_exhausted",
      "local_only",
      "web_unavailable",
    ]);
    const activeConstraintRows = limitingConstraintRows.filter((cells) => {
      const type = normalizedLowerEnum(cells[limitingConstraintTypeIndex] || "");
      return type && type !== "none";
    });
    for (const cells of limitingConstraintRows) {
      const type = normalizedLowerEnum(cells[limitingConstraintTypeIndex] || "");
      if (!allowedConstraintTypes.has(type)) {
        errors.push(`unknown Limiting Constraint type: ${type || "(blank)"}`);
      }
      if (type !== "none" && !String(cells[limitingConstraintNoteIndex] || "").trim()) {
        errors.push(`Limiting Constraint ${type} must include evidence / note`);
      }
    }
    if (status === "PASS" && activeConstraintRows.length > 0) {
      errors.push("Status PASS is inconsistent with an active Limiting Constraint");
    }
    const explicitlyLimited = status !== "PASS" && activeConstraintRows.length > 0;

    if (searchedQueryFamilies.size < minimumFamilies && !(explicitlyLimited && status !== "PASS")) {
      errors.push(
        `searched query families below minimum: ${searchedQueryFamilies.size}/${minimumFamilies}`,
      );
    }
    const zeroSearchAllowed = activeConstraintRows.some((cells) =>
      /^(tool_unavailable|web_unavailable|local_only)$/i.test(normalizedLowerEnum(cells[limitingConstraintTypeIndex] || "")),
    );
    if (searchedQueryFamilies.size === 0 && activeConstraintRows.length > 0 && !zeroSearchAllowed) {
      errors.push("active Limiting Constraint still requires at least one searched query family");
    }

    const sufficiencyTable = parseMarkdownTable(extractSection(text, "### Sufficiency Check"));
    const sufficiencyHeaderRow = sufficiencyTable[0] || [];
    const sufficiencyStatusIndex = columnIndex(sufficiencyHeaderRow, "status");
    if (sufficiencyStatusIndex === -1) {
      errors.push("Sufficiency Check table must include status column");
    }
    const sufficiencyRows = sufficiencyTable.slice(1);
    const weakSufficiencyRows = sufficiencyRows.filter((cells) =>
      /^(warn|fail)$/i.test(normalizedLowerEnum(cells[sufficiencyStatusIndex] || "")),
    );
    if (status === "PASS" && weakSufficiencyRows.length > 0) {
      errors.push("Status PASS is inconsistent with warn/fail rows in Sufficiency Check");
    }

    const iterationRows = parseMarkdownTable(extractSection(text, "### Search Iterations")).slice(1);
    const brainstormingPhase = metadataValue(text, "Brainstorming phase");
    const requiresIterativeEvidence = status === "PASS" && /post-brainstorm|both/.test(brainstormingPhase);
    if (requiresIterativeEvidence && iterationRows.length < 2 && !explicitlyLimited) {
      errors.push("PASS targeted research must record at least two search iterations or an explicit limited-scope stop");
    }

    const sourceLedgerTable = parseMarkdownTable(extractSection(text, "### Source Ledger"));
    const sourceLedgerRows = sourceLedgerTable.slice(1);
    if (status === "PASS" && sourceLedgerRows.length === 0) {
      errors.push("PASS packs must include at least one Source Ledger row");
    }
    const sourceLedgerHeaderRow = sourceLedgerTable[0] || [];
    const ledgerSourceIdIndex = columnIndex(sourceLedgerHeaderRow, "source id");
    const ledgerUsedByClaimsIndex = columnIndex(sourceLedgerHeaderRow, "used by claims");
    if (ledgerSourceIdIndex === -1 || ledgerUsedByClaimsIndex === -1) {
      errors.push("Source Ledger table must include source id and used by claims columns");
    }
    const sourceIds = new Set(sourceLedgerRows.map((cells) => cells[ledgerSourceIdIndex]).filter(Boolean));
    for (const sourceId of sourceIds) {
      if (!/^S\d+$/.test(sourceId)) {
        errors.push(`Source Ledger source id must match S<number>: ${sourceId}`);
      }
    }

    const evidenceTable = parseMarkdownTable(extractSection(text, "### Evidence Table"));
    const evidenceHeaderRow = evidenceTable[0] || [];
    const evidenceClaimIdIndex = columnIndex(evidenceHeaderRow, "claim id");
    const evidenceSourceIdsIndex = columnIndex(evidenceHeaderRow, "source id(s)");
    if (evidenceClaimIdIndex === -1 || evidenceSourceIdsIndex === -1) {
      errors.push("Evidence Table must include claim id and source id(s) columns");
    }
    const evidenceRows = evidenceTable.slice(1);
    const claimIds = new Set(evidenceRows.map((cells) => cells[evidenceClaimIdIndex]).filter(Boolean));
    for (const claimId of claimIds) {
      if (!/^C\d+$/.test(claimId)) {
        errors.push(`Evidence Table claim id must match C<number>: ${claimId}`);
      }
    }
    for (const cells of evidenceRows) {
      const claimId = cells[evidenceClaimIdIndex];
      const referencedSourceIds = splitIds(cells[evidenceSourceIdsIndex]);
      if (referencedSourceIds.length === 0) {
        errors.push(`Evidence claim ${claimId || "(unknown)"} must reference at least one source id`);
      }
      for (const sourceId of referencedSourceIds) {
        if (!sourceIds.has(sourceId)) {
          errors.push(`Evidence claim ${claimId || "(unknown)"} references unknown source id: ${sourceId}`);
        }
      }
    }

    for (const cells of sourceLedgerRows) {
      const sourceId = cells[ledgerSourceIdIndex];
      const usedByClaimIds = splitIds(cells[ledgerUsedByClaimsIndex]);
      if (usedByClaimIds.length === 0) {
        errors.push(`Source Ledger row ${sourceId || "(unknown)"} must list used by claims`);
      }
      for (const claimId of usedByClaimIds) {
        if (!claimIds.has(claimId)) {
          errors.push(`Source Ledger row ${sourceId || "(unknown)"} references unknown claim id: ${claimId}`);
        }
      }
    }

    const stateRows = parseMarkdownTable(extractSection(text, "### Research State Snapshot")).slice(1);
    const synthesisRow = stateRows.find((cells) => cells[0] === "synthesis status");
    if (status === "PASS" && synthesisRow && normalizedLowerEnum(synthesisRow[1]) !== "complete") {
      errors.push("Status PASS requires Research State Snapshot synthesis status complete");
    }

    const claimSupportTable = parseMarkdownTable(extractSection(text, "### Claim Support Check"));
    const claimSupportHeaderRow = claimSupportTable[0] || [];
    const supportClaimIdIndex = columnIndex(claimSupportHeaderRow, "claim id");
    const supportSourceIdIndex = columnIndex(claimSupportHeaderRow, "source id");
    const supportVerdictIndex = columnIndex(claimSupportHeaderRow, "support verdict");
    const claimSupportRows = claimSupportTable.slice(1);
    if (supportClaimIdIndex === -1 || supportSourceIdIndex === -1 || supportVerdictIndex === -1) {
      errors.push("Claim Support Check table must include claim id, source id, and support verdict columns");
    }
    if (status === "PASS" && claimSupportRows.length === 0) {
      errors.push("PASS packs must include at least one Claim Support Check row");
    }
    const evidenceSourcesByClaim = new Map();
    for (const cells of evidenceRows) {
      const claimId = cells[evidenceClaimIdIndex];
      if (!claimId) {
        continue;
      }
      evidenceSourcesByClaim.set(claimId, new Set(splitIds(cells[evidenceSourceIdsIndex])));
    }
    const supportedSourceIdsByClaim = new Map();
    for (const cells of claimSupportRows) {
      const claimId = cells[supportClaimIdIndex];
      const sourceId = cells[supportSourceIdIndex];
      if (!claimIds.has(claimId)) {
        errors.push(`Claim Support Check references unknown claim id: ${claimId || "(blank)"}`);
      }
      if (!sourceIds.has(sourceId)) {
        errors.push(`Claim Support Check references unknown source id: ${sourceId || "(blank)"}`);
      }
      const evidenceSourceIds = evidenceSourcesByClaim.get(claimId);
      if (evidenceSourceIds && !evidenceSourceIds.has(sourceId)) {
        errors.push(`Claim Support Check source ${sourceId || "(blank)"} is not listed in Evidence Table for ${claimId}`);
      }
      if (!supportedSourceIdsByClaim.has(claimId)) {
        supportedSourceIdsByClaim.set(claimId, new Set());
      }
      supportedSourceIdsByClaim.get(claimId).add(sourceId);
    }
    for (const claimId of claimIds) {
      if (!supportedSourceIdsByClaim.has(claimId)) {
        errors.push(`Evidence claim is missing Claim Support Check row: ${claimId}`);
      }
      const evidenceSourceIds = evidenceSourcesByClaim.get(claimId) || new Set();
      const supportedSourceIds = supportedSourceIdsByClaim.get(claimId) || new Set();
      for (const sourceId of evidenceSourceIds) {
        if (!supportedSourceIds.has(sourceId)) {
          errors.push(`Evidence claim ${claimId} source ${sourceId} is missing Claim Support Check row`);
        }
      }
    }
    const weakSupportRows = claimSupportRows.filter((cells) =>
      /^(partial|unsupported|contradicted|unknown)$/i.test(normalizedLowerEnum(cells[supportVerdictIndex] || "")),
    );
    if (status === "PASS" && weakSupportRows.length > 0) {
      errors.push("Status PASS is inconsistent with partial/unsupported/contradicted/unknown claim support rows");
    }

    const outputSections = extractOutputSections(text);
    const absoluteLocalPaths = outputSections.match(/(?:^|[\s(|`])(?:\/Users|\/home|\/root)\/[^\s)`|]+/gm) || [];
    for (const rawMatch of absoluteLocalPaths) {
      const localPath = rawMatch.trim().replace(/^[(`|]+|[`)|]+$/g, "");
      if (!isUrl(localPath) && path.isAbsolute(localPath) && !isInside(path.resolve(localPath), root)) {
        errors.push(`absolute local path outside project root is not allowed: ${localPath}`);
      }
    }

    const homeGlobalPattern = /(?:~|\$HOME)\/\.(?:codex|agents|claude|config)\//;
    if (homeGlobalPattern.test(outputSections)) {
      errors.push("output sections must not reference home/global agent or config paths");
    }
  }

  const absoluteGlobalMatches = extractOutputSections(text).match(
    /(?:\/Users|\/home|\/root)\/[^)\s]+\/\.(codex|agents|claude|config)\//g,
  ) || [];
  if (absoluteGlobalMatches.length > 0) {
    errors.push("pack appears to reference global/user agent artifact paths");
  }
}

for (const warning of warnings) {
  console.warn(`WARN: ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`FAIL: ${error}`);
  }
  process.exit(1);
}

console.log(`PASS: ${path.relative(root, target)} satisfies context research pack contract`);
