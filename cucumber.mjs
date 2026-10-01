// TCV-7055: Keep the console report readable and produce the JUnit file consumed by tc report.
export default {
  paths: ["features/**/*.feature"],
  // TCV-7055: a @sync-only feature is synced by tc sync but has no step definitions here.
  tags: "not @sync-only",
  import: ["features/support/**/*.js", "features/step_definitions/**/*.js"],
  format: ["progress", ["junit", "reports/cucumber-junit.xml"]],
  formatOptions: {
    snippetInterface: "async-await"
  }
};
