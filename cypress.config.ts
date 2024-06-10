import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    setupNodeEvents(_on: any, config: any) {
      // e2e testing node events setup code
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
