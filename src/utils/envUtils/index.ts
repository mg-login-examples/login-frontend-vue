export const isDevelopmentEnvironment = (): boolean => {
  return (
    import.meta.env.VITE_APP_ENV === "development" ||
    import.meta.env.VITE_APP_ENV === "local"
  );
};
