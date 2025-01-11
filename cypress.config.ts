import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    supportFile: "src/e2e/cypress/support/e2e.ts",
    specPattern: "src/e2e/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      // Register the 'log' and 'table' tasks
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
        table(data) {
          console.table(data);
          return null;
        },
      });
      return config;
    },
    baseUrl: "http://localhost:3000",
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    supportFile: "src/e2e/cypress/support/component.ts",
    specPattern: "src/e2e/cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    indexHtmlFile: "src/e2e/cypress/support/component-index.html",
  },
});
