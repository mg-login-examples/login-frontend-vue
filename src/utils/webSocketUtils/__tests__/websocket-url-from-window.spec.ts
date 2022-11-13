import { describe, expect, it } from "vitest";
import { getWebSocketUrlFromWindow } from "../websocket-url-from-window";

describe("utils > webSocketUtils > getWebSocketUrlFromWindow", () => {
  it("gets socket url based on opened url", () => {
    // init test values
    const socketPath = "/main-socket";
    const domain = "testdomain.com";
    const httpUrl = `http://${domain}`;
    const httpsUrl = `https://${domain}`;
    // mock window location with http URL instance
    window.location = new URL(httpUrl) as any;
    expect(window.location.protocol).toBe("http:");
    expect(window.location.host).toBe(domain);
    // call getWebSocketUrlFromWindow() and expect http socket url
    const socketUrl = getWebSocketUrlFromWindow(socketPath);
    expect(socketUrl).toBe(`ws://${domain}${socketPath}`);
    // mock window location with https URL instance
    window.location = new URL(httpsUrl) as any;
    expect(window.location.protocol).toBe("https:");
    expect(window.location.host).toBe(domain);
    // call getWebSocketUrlFromWindow() and expect https socket url
    const secureSocketUrl = getWebSocketUrlFromWindow(socketPath);
    expect(secureSocketUrl).toBe(`wss://${domain}${socketPath}`);
  });
});
