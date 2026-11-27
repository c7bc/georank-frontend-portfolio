import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cookies } from "next/headers";
import { api, APIClientError } from "@/lib/api/client";

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ get: () => ({ value: "synthetic-session" }) })),
}));

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("server API client", () => {
  it("unwraps private responses and excludes them from the Next.js data cache", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { name: "Demo" } }));
    await expect(api.get("/auth/me", { next: { revalidate: 60, tags: ["user"] } })).resolves.toEqual({ name: "Demo" });
    expect(fetchMock.mock.calls[0][1]).toEqual({
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json", Authorization: "Bearer synthetic-session" },
    });
  });

  it("does not read cookies for explicitly public, cacheable GETs", async () => {
    const next = { revalidate: 60, tags: ["plans"] };
    fetchMock.mockResolvedValueOnce(Response.json([]));
    await api.get("/billing/plans", { skipAuth: true, next });
    expect(cookies).not.toHaveBeenCalled();
    expect(fetchMock.mock.calls[0][1]).toEqual({
      method: "GET", headers: { "Content-Type": "application/json" }, next,
    });
  });

  it("serializes falsey bodies and preserves the empty-success contract", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    await expect(api.patch("/preferences", false)).resolves.toEqual({});
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ body: "false", cache: "no-store" });
  });

  it("normalizes structured and non-JSON upstream errors", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ error: { code: "validation", message: "Invalid input" } }, { status: 422 }));
    const structured = api.post("/domains", {});
    await expect(structured).rejects.toBeInstanceOf(APIClientError);
    await expect(structured).rejects.toMatchObject({
      message: "Invalid input", status: 422, data: { error: "validation", status: 422 },
    });

    fetchMock.mockResolvedValueOnce(new Response("<html/>", { status: 502, statusText: "Bad Gateway" }));
    await expect(api.get("/domains")).rejects.toMatchObject({
      message: "Bad Gateway", status: 502, data: { error: "unknown_error", status: 502 },
    });
  });
});
