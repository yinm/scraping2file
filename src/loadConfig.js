const { readFile } = require("fs/promises");
const { join } = require("path");
const yaml = require("js-yaml");

async function loadConfig() {
  const config = yaml.load(
    await readFile(join(process.cwd(), "config.yml"), "utf-8")
  );

  const configKeys = ["separator", "hostname"];
  const missingKeys = configKeys.filter(
    (key) => typeof config[key] === "undefined"
  );
  if (missingKeys.length) {
    throw new Error(`require config keys: ${missingKeys.join(",")}`);
  }

  return config;
}

module.exports = { loadConfig };
