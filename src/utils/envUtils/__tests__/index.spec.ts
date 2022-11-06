import { describe, it, expect } from "vitest";

import { isDevelopmentEnvironment } from "@/utils/envUtils";

describe("Utils > envUtils > index.ts", () => {
  it("checks development environment", () => {
    import.meta.env.VITE_APP_ENV = "production";
    expect(isDevelopmentEnvironment()).toBe(false);
    import.meta.env.VITE_APP_ENV = "development";
    expect(isDevelopmentEnvironment()).toBe(true);
  });
});
