import { describe, expect, test } from "bun:test";
import { ListenBrainzClient } from "../src/index.ts";

describe("recording feedback routes", () => {
  test("reads feedback and removes it with score zero", async () => {
    const requests: Array<{ path: string; query: string; body: unknown }> = [];
    const server = Bun.serve({
      port: 0,
      async fetch(request) {
        requests.push({
          path: new URL(request.url).pathname,
          query: new URL(request.url).search,
          body: request.method === "POST" ? await request.json() : null,
        });
        return Response.json({ status: "ok", count: 0, offset: 0, total_count: 0, feedback: [] });
      },
    });
    try {
      const client = new ListenBrainzClient({ baseUrl: `http://127.0.0.1:${server.port}` });
      await client.getFeedback("alice", { score: 1, count: 5, metadata: true });
      await client.deleteFeedback("token", { recordingMsid: "recording-id" });
      expect(requests[0]).toMatchObject({
        path: "/1/feedback/user/alice/get-feedback",
        query: "?score=1&count=5&metadata=true",
      });
      expect(requests[1]).toMatchObject({
        path: "/1/feedback/recording-feedback",
        body: { recording_msid: "recording-id", score: 0 },
      });
    } finally {
      server.stop(true);
    }
  });
});
