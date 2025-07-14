type JsonObject = { [key: string]: unknown };

const parseToOpenNebulaFormat = (obj: JsonObject): string => {
  const parseValue = (value: unknown): string => {
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      return `[
      ${Object.entries(value)
        .map(([k, v]) => `${k}="${v}"`)
        .join(",\n  ")}
    ]`;
    }
    return `"${value}"`;
  };

  const result = Object.entries(obj)
    .map(([key, value]) => `${key}=${parseValue(value)}`)
    .join("\n");

  return result.replace(/""/g, "");
};

export { parseToOpenNebulaFormat };
