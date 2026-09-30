// TCV-7055: Give local users and CI one portable entry point for tc sync and tc report.
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function loadLocalEnv() {
  if (!existsSync(".env")) return;

  for (const rawLine of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
    if (!(key in process.env)) process.env[key] = value;
  }
}

function requireValue(name) {
  const value = process.env[name];
  if (!value || value.startsWith("REPLACE_WITH_")) {
    throw new Error(`${name} is required. Copy .env.example to .env and replace its placeholder.`);
  }
  return value;
}

function runTc(args) {
  const command = process.platform === "win32" ? "tc.cmd" : "tc";
  const result = spawnSync(command, args, {
    env: process.env,
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}

loadLocalEnv();

const action = process.argv[2];
const projectId = requireValue("TC_PROJECT_ID");
requireValue("TESTCOLLAB_TOKEN");

const commonArgs = ["--project", projectId];
if (process.env.TC_API_URL) commonArgs.push("--api-url", process.env.TC_API_URL);

if (action === "sync") {
  runTc(["sync", ...commonArgs]);
} else if (action === "report") {
  runTc([
    "report",
    ...commonArgs,
    "--format",
    "junit",
    "--result-file",
    "reports/cucumber-junit.xml",
    "--auto-create"
  ]);
} else {
  throw new Error("Usage: node scripts/testcollab.mjs <sync|report>");
}
