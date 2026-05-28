const fs = require("node:fs");
const path = require("node:path");

const { PracticeHarnessError } = require("./errors");

const REQUIRED_FIELDS = ["id", "title", "type", "maxScore", "unlockThreshold", "act"];

function defaultPracticesDir() {
  return path.join(__dirname, "..", "practices");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validateDefinition(definition, filePath) {
  for (const field of REQUIRED_FIELDS) {
    if (definition[field] === undefined || definition[field] === null) {
      throw new PracticeHarnessError(
        "invalid_practice_definition",
        `Practice definition is missing required field: ${field}`,
        { filePath, field },
      );
    }
  }

  if (!Number.isInteger(definition.act) || definition.act <= 0) {
    throw new PracticeHarnessError(
      "invalid_practice_definition",
      "Practice definition act must be a positive integer",
      { filePath, field: "act", practiceId: definition.id },
    );
  }

  if (definition.type === "checklist-unlock") {
    for (const group of definition.groups || []) {
      for (const item of group.items || []) {
        if (typeof item.points !== "number" || !Number.isFinite(item.points)) {
          throw new PracticeHarnessError(
            "invalid_practice_definition",
            "Checklist item points must be a finite number",
            {
              filePath,
              field: "groups.items.points",
              practiceId: definition.id,
              groupId: group.id,
              itemId: item.id,
            },
          );
        }
      }
    }
  }
}

function createPracticeDefinitionStore({ practicesDir = defaultPracticesDir() } = {}) {
  const definitions = new Map();
  const files = fs
    .readdirSync(practicesDir)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort();

  for (const fileName of files) {
    const filePath = path.join(practicesDir, fileName);
    const definition = JSON.parse(fs.readFileSync(filePath, "utf8"));

    validateDefinition(definition, filePath);
    if (definitions.has(definition.id)) {
      throw new PracticeHarnessError(
        "duplicate_practice_id",
        `Duplicate practice definition id: ${definition.id}`,
        { filePath, practiceId: definition.id },
      );
    }

    definitions.set(definition.id, definition);
  }

  const orderedDefinitions = Array.from(definitions.values()).sort((a, b) => {
    if (a.act !== b.act) return a.act - b.act;
    return a.id.localeCompare(b.id);
  });

  return {
    listPractices() {
      return orderedDefinitions.map((definition) => ({
        id: definition.id,
        title: definition.title,
        type: definition.type,
        maxScore: definition.maxScore,
        unlockThreshold: definition.unlockThreshold,
        act: definition.act,
      }));
    },

    getPractice(id) {
      const definition = definitions.get(id);

      if (!definition) {
        throw new PracticeHarnessError(
          "practice_not_found",
          `Practice definition not found: ${id}`,
          { practiceId: id },
        );
      }

      return clone(definition);
    },
  };
}

module.exports = {
  createPracticeDefinitionStore,
};
