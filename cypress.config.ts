import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import browserify from "@badeball/cypress-cucumber-preprocessor/browserify";
import { secrets } from "docker-secret";
// import allureWriter from "@shelex/cypress-allure-plugin/writer";
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    browserify(config, {
      typescript: require.resolve("typescript"),
    })
  );

  on("before:browser:launch", (browser, launchOptions) => {
    if (browser.family === "chromium") {
      launchOptions.args.push(
        "--disable-features=CookiesWithoutSameSiteMustBeSecure"
      );
    }
    return launchOptions;
  });

  allureWriter(on, config);

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

export default defineConfig({
  e2e: {
    // specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    specPattern: "**/*.feature",
    baseUrl: "http://localhost:4173",
    setupNodeEvents,
  },
  env: {
    allure: true,
    allureResultsPath: "cypress/allure-results",
    MAILSLURP_API_KEY: secrets.mailslurp_api_key,
    adminApiUrl: "http://localhost:8018/api/admin",
    apiUrl: "http://localhost:8018/api",
    adminApiLoginUsername: "admin@admin.admin",
    adminApiLoginPassword: "admin",
    filterSpecs: true,
    tags: "@signup",
  },
  video: false,
  // videoCompression: false,
  // timeout: 100000,
});
