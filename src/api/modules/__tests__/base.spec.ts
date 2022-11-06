import { describe, it, expect } from "vitest";

import http from "@/api/modules/base";

describe("api > modules > base.ts", () => {
  it("creates base http object with expected configs", () => {
    expect(http.defaults.baseURL).toBe(import.meta.env.VITE_APP_BACKEND_URL);
    expect(http.defaults.withCredentials).toBe(true);
  });
});
