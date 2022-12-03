export class EnvironmentVars {
  static get isDevelopmentEnvironment(): boolean {
    return import.meta.env.DEV;
  }

  static get baseUrl() {
    return import.meta.env.BASE_URL;
  }

  static get backendUrl() {
    return import.meta.env.VITE_APP_BACKEND_URL;
  }

  static get backendWebSocketUrl() {
    return import.meta.env.VITE_APP_BACKEND_WEBSOCKET_URL;
  }

  static get addAuthorizationHeader() {
    return import.meta.env.VITE_APP_ADD_AUTHORIZATION_HEADER === "true"
      ? true
      : false;
  }

  static get logEnvVars() {
    return import.meta.env.VITE_LOG_ENV_VARS === "true" ? true : false;
  }
}

if (import.meta.env.DEV && EnvironmentVars.logEnvVars) {
  console.log("*********** ENVIRONMENT VARIABLES START ************");
  for (const key in EnvironmentVars) {
    console.log(key, " = ", (EnvironmentVars as any)[key]);
  }
  console.log("*********** ENVIRONMENT VARIABLES END ************");
}
