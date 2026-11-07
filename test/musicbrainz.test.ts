import { describe, expect, test } from "bun:test";
import { MusicBrainzClient } from "../src/index.ts";

describe("MusicBrainz request throttle", () => {
  test("serializes parallel requests at one request per second", async () => {
    const starts: number[] = [];
    const server = Bun.serve({
      port: 0,
      fetch: () => {
        starts.push(Date.now());
        return Response.json({ artists: [] });
      },
    });
    try {
      const client = new MusicBrainzClient({
        baseUrl: `http://127.0.0.1:${server.port}`,
        userAgent: "Test/1.0 (https://example.test)",
      });
      await Promise.all([client.searchArtist("one"), client.searchArtist("two")]);
      expect(starts).toHaveLength(2);
      expect(starts[1]! - starts[0]!).toBeGreaterThanOrEqual(900);
    } finally {
      server.stop(true);
    }
  });
});
