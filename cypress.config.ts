import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
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
  },
});
