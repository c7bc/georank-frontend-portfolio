import { describe, expect, it } from "vitest";
import { resolveLoginDestination } from "@/lib/utils/login-destination";

const dashboard = "http://localhost:3001/dashboard";

describe("login destinations", () => {
  it.each([null, "", "/", "/dashboard", "https://example.test/path", "//example.test/path", "/..//example.test"])(
    "uses the configured dashboard for %s",
    (callback) => expect(resolveLoginDestination(callback, dashboard)).toBe(dashboard),
  );

  it.each(["/settings/billing", "/reports?period=30d#history", "/dashboard?view=all"])(
    "preserves the requested application route %s",
    (callback) => expect(resolveLoginDestination(callback, dashboard)).toBe(callback),
  );
});
