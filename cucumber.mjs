// TCV-7055: Keep the console report readable and produce the JUnit file consumed by tc report.
export default {
  paths: ["features/**/*.feature"],
  import: ["features/support/**/*.js", "features/step_definitions/**/*.js"],
  format: ["progress", ["junit", "reports/cucumber-junit.xml"]],
  formatOptions: {
    snippetInterface: "async-await"
  }
};
