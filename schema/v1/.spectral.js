const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "head", "options", "trace"];

const isInternalPath = (path) => path.startsWith("/__");

const getSegments = (path) => path.split("/").filter(Boolean);

const toCamelCase = (path) =>
  getSegments(path)
    .map((seg, i) =>
      seg
        .split("-")
        .map((part, j) =>
          i === 0 && j === 0
            ? part.toLowerCase()
            : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join("")
    )
    .join("");

const checkAllResponses = (pathsObj) => {
  const specialErrorCodes = ["400", "408", "429"];
  const validationCode = "422";
  const allSpecialCodes = [...specialErrorCodes, validationCode];
  const errors = [];

  for (const [pathName, pathItem] of Object.entries(pathsObj)) {
    if (!pathItem || typeof pathItem !== "object") continue;

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!operation?.responses || typeof operation.responses !== "object")
        continue;

      const loc = `${method.toUpperCase()} ${pathName}`;

      for (const [code, response] of Object.entries(operation.responses)) {
        const numCode = parseInt(code, 10);
        if (isNaN(numCode)) continue;

        // 400, 408, 429 → must ref schemas/error.yaml
        if (specialErrorCodes.includes(code)) {
          const schema = response?.content?.["application/json"]?.schema;
          if (!schema) {
            errors.push({
              message: `[${loc}] ${code} response must reference schemas/error.yaml`,
            });
          } else {
            const typeEnum = schema?.properties?.type?.enum;
            if (!Array.isArray(typeEnum) || !typeEnum.includes("error")) {
              errors.push({
                message: `[${loc}] ${code} response schema must reference schemas/error.yaml`,
              });
            }
          }
        }

        // 422 → must ref schemas/validation.yaml
        if (code === validationCode) {
          const schema = response?.content?.["application/json"]?.schema;
          if (!schema) {
            errors.push({
              message: `[${loc}] 422 response must reference schemas/validation.yaml`,
            });
          } else {
            const typeEnum = schema?.properties?.type?.enum;
            if (!Array.isArray(typeEnum) || !typeEnum.includes("validation")) {
              errors.push({
                message: `[${loc}] 422 response schema must reference schemas/validation.yaml`,
              });
            }
          }
        }

        // Other 4xx/5xx → must be empty ({})
        const isClientError = numCode >= 400 && numCode < 500;
        const isServerError = numCode >= 500 && numCode < 600;
        if (
          (isClientError || isServerError) &&
          !allSpecialCodes.includes(code)
        ) {
          if (response && Object.keys(response).length > 0) {
            errors.push({
              message: `[${loc}] ${code} response must be empty ({})`,
            });
          }
        }
      }
    }
  }

  return errors;
};

const checkPathDepth = (pathsObj) => {
  const errors = [];
  for (const pathName of Object.keys(pathsObj)) {
    if (isInternalPath(pathName)) continue;
    const segments = getSegments(pathName);
    if (segments.length > 2) {
      errors.push({
        message: `${pathName} has ${segments.length} segments (max 2)`,
      });
    }
  }
  return errors;
};

const checkSameDirectoryTags = (pathsObj) => {
  const errors = [];
  const groupTags = {};

  for (const [pathName, pathItem] of Object.entries(pathsObj)) {
    if (isInternalPath(pathName)) continue;
    if (!pathItem || typeof pathItem !== "object") continue;

    const dir = getSegments(pathName)[0];
    if (!dir) continue;

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.includes(method)) continue;
      const tags = operation?.tags;
      if (!Array.isArray(tags)) continue;

      const key = JSON.stringify(tags);
      if (!groupTags[dir]) {
        groupTags[dir] = { key, tags, source: `${method.toUpperCase()} ${pathName}` };
      } else if (groupTags[dir].key !== key) {
        errors.push({
          message: `${method.toUpperCase()} ${pathName} has tags [${tags}] but /${dir} group expects [${groupTags[dir].tags}] (from ${groupTags[dir].source})`,
        });
      }
    }
  }
  return errors;
};

const checkNoTagOverlap = (pathsObj) => {
  const errors = [];
  const tagToDir = {};

  for (const [pathName, pathItem] of Object.entries(pathsObj)) {
    if (isInternalPath(pathName)) continue;
    if (!pathItem || typeof pathItem !== "object") continue;

    const dir = getSegments(pathName)[0];
    if (!dir) continue;

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.includes(method)) continue;
      const tags = operation?.tags;
      if (!Array.isArray(tags)) continue;

      for (const tag of tags) {
        if (!tagToDir[tag]) {
          tagToDir[tag] = dir;
        } else if (tagToDir[tag] !== dir) {
          errors.push({
            message: `Tag "${tag}" is used in both /${tagToDir[tag]} and /${dir}`,
          });
          tagToDir[tag] = dir;
        }
      }
    }
  }
  return errors;
};

const checkOperationIdConvention = (pathsObj) => {
  const errors = [];
  for (const [pathName, pathItem] of Object.entries(pathsObj)) {
    if (isInternalPath(pathName)) continue;
    if (!pathItem || typeof pathItem !== "object") continue;

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.includes(method)) continue;
      const opId = operation?.operationId;
      if (!opId) continue;

      const expected = toCamelCase(pathName);
      if (opId !== expected) {
        errors.push({
          message: `${method.toUpperCase()} ${pathName} operationId must be "${expected}" but got "${opId}"`,
        });
      }
    }
  }
  return errors;
};

const checkPathPrefixConsistency = (pathsObj) => {
  const errors = [];
  for (const [pathName, pathItem] of Object.entries(pathsObj)) {
    if (!pathItem || typeof pathItem !== "object") continue;

    const ref = pathItem.$ref;
    if (typeof ref !== "string") continue;

    const refMatch = ref.match(/^\.\/paths\/([^/]+)\//);
    if (!refMatch) continue;

    const refDir = refMatch[1];
    const pathDir = getSegments(pathName)[0];

    if (refDir !== pathDir) {
      errors.push({
        message: `${pathName} references "${ref}" but $ref directory "${refDir}" does not match path prefix "${pathDir}"`,
      });
    }
  }
  return errors;
};

module.exports = {
  rules: {
    "response-schema-convention": {
      description:
        "400/408/429 → error.yaml, 422 → validation.yaml, other 4xx/5xx → {}",
      message: "{{error}}",
      severity: "error",
      given: "$.paths",
      then: {
        function: checkAllResponses,
      },
    },
    "path-depth": {
      description: "Path segments must not exceed 2",
      message: "{{error}}",
      severity: "error",
      given: "$.paths",
      then: {
        function: checkPathDepth,
      },
    },
    "same-directory-tags": {
      description: "Operations under the same first segment must share the same tags",
      message: "{{error}}",
      severity: "error",
      given: "$.paths",
      then: {
        function: checkSameDirectoryTags,
      },
    },
    "no-tag-overlap": {
      description: "Different first segments must not share the same tag",
      message: "{{error}}",
      severity: "error",
      given: "$.paths",
      then: {
        function: checkNoTagOverlap,
      },
    },
    "operation-id-convention": {
      description: "operationId must equal the camelCase of the path",
      message: "{{error}}",
      severity: "error",
      given: "$.paths",
      then: {
        function: checkOperationIdConvention,
      },
    },
    "path-prefix-consistency": {
      description: "$ref directory must match the path's first segment",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      given: "$.paths",
      then: {
        function: checkPathPrefixConsistency,
      },
    },
  },
};
