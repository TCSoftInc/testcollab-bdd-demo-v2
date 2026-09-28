// TCV-7055: Exercise the CLI's real matcher so reporter changes cannot create duplicate cases.
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { matchesScenarioTitle } from "@testcollab/cli/src/lib/bddCases.js";
import { parseJUnitReport } from "@testcollab/cli/src/commands/report.js";

const report = readFileSync("reports/cucumber-junit.xml", "utf8");
const testcases = parseJUnitReport(report).allTests;

assert.equal(testcases.length, 6, "Expected all six Cucumber examples and scenarios in JUnit");

for (const testcase of testcases) {
  const feature = testcase.classname;
  const reportedName = testcase.title;
  let syncedCase;

  if (feature === "User profile management") {
    syncedCase = { title: reportedName, description: "" };
  } else if (feature === "User login" && reportedName.startsWith("Registered users")) {
    syncedCase = {
      title: "Sign in as {{email}}",
      description: "Rule: Registered users can sign in"
    };
  } else if (feature === "User login" && reportedName.startsWith("Invalid credentials")) {
    syncedCase = {
      title: "Reject {{case}} login",
      description: "Rule: Invalid credentials remain on the login page"
    };
  } else {
    throw new Error(`Unexpected JUnit BDD identity: ${feature} / ${reportedName}`);
  }

  assert.equal(
    matchesScenarioTitle(syncedCase, reportedName),
    true,
    `CLI could not match ${feature} / ${reportedName}`
  );
}

console.log("All six JUnit results match the TestCollab cases created by tc sync.");
