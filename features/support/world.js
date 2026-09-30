// TCV-7055: Run the demo application in an isolated DOM for every Cucumber scenario.
import { After, Before, setWorldConstructor } from "@cucumber/cucumber";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

class DemoWorld {
  async openApp() {
    const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
    const script = readFileSync(new URL("../../script.js", import.meta.url), "utf8");
    const page = html.replace('<script src="script.js"></script>', `<script>${script}</script>`);

    this.dom = new JSDOM(page, {
      pretendToBeVisual: true,
      runScripts: "dangerously",
      url: "http://testcollab-bdd-demo.local/"
    });

    this.alertMessage = "";
    this.dom.window.alert = message => {
      this.alertMessage = message;
    };

    await new Promise(resolve => {
      if (this.dom.window.document.readyState === "complete") return resolve();
      this.dom.window.addEventListener("load", resolve, { once: true });
    });
  }

  get document() {
    return this.dom.window.document;
  }

  setValue(selector, value) {
    const element = this.document.querySelector(selector);
    if (!element) throw new Error(`Element not found: ${selector}`);
    element.value = value;
    element.dispatchEvent(new this.dom.window.Event("input", { bubbles: true }));
  }

  submit(selector) {
    const form = this.document.querySelector(selector);
    if (!form) throw new Error(`Form not found: ${selector}`);
    form.dispatchEvent(new this.dom.window.Event("submit", { bubbles: true, cancelable: true }));
  }
}

setWorldConstructor(DemoWorld);

Before(function() {
  this.dom = undefined;
});

After(function() {
  this.dom?.window.close();
});
