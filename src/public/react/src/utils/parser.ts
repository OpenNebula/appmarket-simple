type JsonObject = { [key: string]: any };

const parseToOpenNebulaFormat = (obj: JsonObject): string => {
  const parseValue = (value: any): string => {
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
