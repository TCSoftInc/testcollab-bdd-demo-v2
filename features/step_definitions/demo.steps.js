// TCV-7055: These steps exercise the real demo page while keeping the sample server-free.
import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";

Given("the demo application is open", async function() {
  await this.openApp();
});

Given("I am on the login page", function() {
  assert.equal(this.document.querySelector("#login-section").classList.contains("hidden"), false);
});

Given("I am signed in as {string}", function(email) {
  this.setValue("#email", email);
  this.setValue("#password", "correctpassword");
  this.submit("#login-form");
  assert.equal(this.document.querySelector("#profile-section").classList.contains("hidden"), false);
});

When("I sign in with {string} and {string}", function(email, password) {
  this.setValue("#email", email);
  this.setValue("#password", password);
  this.submit("#login-form");
});

When("I update the profile with:", function(dataTable) {
  const values = dataTable.rowsHash();
  const selectors = {
    name: "#profile-name",
    phone: "#profile-phone",
    bio: "#profile-bio"
  };

  for (const [field, value] of Object.entries(values)) {
    if (!selectors[field]) throw new Error(`Unknown profile field: ${field}`);
    this.setValue(selectors[field], value);
  }
});

When("I replace the biography with:", function(docString) {
  this.setValue("#profile-bio", docString);
});

When("I save the profile", function() {
  this.submit("#profile-form");
});

Then("I should see the welcome message {string}", function(message) {
  assert.equal(this.document.querySelector("#welcome-message").textContent, message);
});

Then("I should see the login error {string}", function(message) {
  assert.equal(this.document.querySelector("#login-error").textContent, message);
  assert.equal(this.document.querySelector("#login-section").classList.contains("hidden"), false);
});

Then("the profile field {string} should contain {string}", function(field, value) {
  const selectors = {
    name: "#profile-name",
    phone: "#profile-phone",
    bio: "#profile-bio"
  };
  assert.equal(this.document.querySelector(selectors[field]).value, value);
});

Then("the biography should contain:", function(docString) {
  assert.equal(this.document.querySelector("#profile-bio").value, docString);
});

Then("I should see {string}", function(message) {
  const messages = [...this.document.querySelectorAll(".success-message.show")].map(
    element => element.textContent
  );
  assert.ok(messages.includes(message), `Expected success message '${message}', got ${messages}`);
});
