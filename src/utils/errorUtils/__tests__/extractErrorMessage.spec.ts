import { describe, it, expect } from "vitest";

import extractErrorMessage from "@/utils/errorUtils/extractErrorMessage";

describe("Utils > errorUtils > extractErrorMessage.ts", () => {
  it("extracts axios no connection error message", () => {
    const axiosNoConnectionError = new Error("Network Error");
    const message = extractErrorMessage(axiosNoConnectionError);
    expect(message).toBe("Backend not found.");
  });

  it("extract unknown error in non development environment", () => {
    const unknownError = new Error("Unknown error");
    import.meta.env.DEV = true;
    expect(extractErrorMessage(unknownError)).toBe(
      "Something went wrong! Please try again later."
    );
  });

  it("handles unknown error in development environment", () => {
    const errorMessage = "Some error";
    const unknownError = new Error(errorMessage);
    import.meta.env.DEV = true;
    expect(extractErrorMessage(unknownError)).toBe(
      `Unmapped error: ${errorMessage}`
    );
  });
});
