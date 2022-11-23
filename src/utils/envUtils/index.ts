export const EnvironmentVars = {
  isDevelopmentEnvironment: import.meta.env.DEV,
  baseUrl: import.meta.env.BASE_URL,

  backendUrl: import.meta.env.VITE_APP_BACKEND_URL,
  backendWebSocketUrl: import.meta.env.VITE_APP_BACKEND_WEBSOCKET_URL,
  addAuthorizationHeader:
    import.meta.env.VITE_APP_ADD_AUTHORIZATION_HEADER === "true" ? true : false,
};

if (import.meta.env.DEV) {
  console.log("*********** ENVIRONMENT VARIABLES START ************");
  for (const key in EnvironmentVars) {
    console.log(key, " = ", (EnvironmentVars as any)[key]);
  }
  console.log("*********** ENVIRONMENT VARIABLES END ************");
}
