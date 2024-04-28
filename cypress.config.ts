import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import allureWriter from '@shelex/cypress-allure-plugin/writer'
import { defineConfig } from 'cypress'
import { getSecrets } from 'docker-secret'
import { readFileSync } from 'fs'

type Secrets = {
  mailslurp_api_key: string
}

export function getCypressSecrets(): Secrets {
  const secrets = getSecrets<Secrets>()
  if (!secrets.mailslurp_api_key) {
    const mailslurp_api_key = readFileSync('./docker_secrets/mailslurp_api_key.txt', {
      encoding: 'utf8',
      flag: 'r'
    })
    secrets.mailslurp_api_key = mailslurp_api_key
  }
  return secrets
}

const secrets = getCypressSecrets()

export default defineConfig({
  e2e: {
    specPattern: 'cypress/**/*.feature',
    baseUrl: 'http://localhost:5173',
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
      await addCucumberPreprocessorPlugin(on, config)

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)]
        })
      )

      allureWriter(on, config)

      // Make sure to return the config object as it might have been modified by the plugin.
      return config
    },
    env: {
      allure: true,
      allureResultsPath: 'cypress/allure-results',
      allureReuseAfterSpec: true,
      MAILSLURP_API_KEY: secrets.mailslurp_api_key,
      apiUrl: 'http://localhost:8018/api',
      adminApiUrl: 'http://localhost:8018/api/admin',
      adminApiLoginUsername: 'admin@admin.admin',
      adminApiLoginPassword: 'admin',
      filterSpecs: true
      // tags: '@signup'
    },
    video: false
    // videoCompression: false,
    // timeout: 100000,
  }
})
