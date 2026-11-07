import { describe, expect, test } from "bun:test";
import { ListenBrainzClient } from "../src/index.ts";

describe("generic API request", () => {
  test("calls documented routes with query data and token authentication", async () => {
    const server = Bun.serve({
      port: 0,
      fetch: (request) => {
        expect(new URL(request.url).pathname).toBe("/1/playlist/search");
        expect(new URL(request.url).searchParams.get("query")).toBe("ambient");
        expect(request.headers.get("authorization")).toBe("Token private-token");
        return Response.json({ playlists: [] });
      },
    });
    try {
      const client = new ListenBrainzClient({ baseUrl: `http://127.0.0.1:${server.port}` });
      const result = await client.request<{ playlists: unknown[] }>({
        path: "/1/playlist/search",
        query: { query: "ambient" },
        token: "private-token",
      });
      expect(result.playlists).toEqual([]);
    } finally {
      server.stop(true);
    }
  });
});
