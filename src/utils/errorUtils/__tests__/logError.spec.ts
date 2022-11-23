import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
// import { type AxiosError } from "axios";

import logError from "@/utils/errorUtils/logError";
console.log = vi.fn();

import.meta.env.VITE_APP_ENV = true;

describe("logError", () => {
  beforeEach(() => {
    (console.log as Mock).mockClear();
  });

  it("logs error object and message", () => {
    const error = Error("mock error");
    logError(error);
    expect(console.log).toHaveBeenCalledWith("Error object: ", error);
    expect(console.log).toHaveBeenCalledWith("Error message: ", error.message);
  });
});
