import { describe, it, expect } from "vitest";

import http from "@/api/modules/base";
import { EnvironmentVars } from "@/utils/envUtils";

describe("api > modules > base.ts", () => {
  it("creates base http object with expected configs", () => {
    expect(http.defaults.baseURL).toBe(EnvironmentVars.backendUrl);
    expect(http.defaults.withCredentials).toBe(true);
  });
});
