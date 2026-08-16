import { describe, expect, test } from "bun:test";
import {
  createListen,
  createNowPlaying,
  createTrackMetadata,
  ListenBrainzClient,
  ListenBrainzError,
} from "../src/index.ts";

const BASE = "https://api.listenbrainz.org";

describe("createTrackMetadata", () => {
  test("strips undefined optional fields", () => {
    const md = createTrackMetadata({ artistName: "Daft Punk", trackName: "Around the World" });
    expect(md.artist_name).toBe("Daft Punk");
    expect(md.track_name).toBe("Around the World");
    expect(md.release_name).toBeUndefined();
    expect(md.additional_info?.submission_client).toBeUndefined();
  });

  test("keeps provided fields", () => {
    const md = createTrackMetadata({
      artistName: "Daft Punk",
      trackName: "One More Time",
      releaseName: "Discovery",
      durationMs: 342_000,
      tags: ["house"],
    });
    expect(md.release_name).toBe("Discovery");
    expect(md.additional_info?.duration_ms).toBe(342_000);
    expect(md.additional_info?.tags).toEqual(["house"]);
  });
});

describe("createListen / createNowPlaying", () => {
  test("listen has listened_at", () => {
    const l = createListen({ artistName: "A", trackName: "B", listenedAt: 1_700_000_000 });
    expect(l.listenedAt).toBe(1_700_000_000);
    expect(l.trackMetadata.artist_name).toBe("A");
  });

  test("now playing has no timestamp", () => {
    const np = createNowPlaying({ artistName: "A", trackName: "B" });
    expect(np.additional_info?.media_player).toBe("BrainzBot");
  });
});

describe("ListenBrainzClient construction", () => {
  test("strips trailing slash from baseUrl", () => {
    const c = new ListenBrainzClient({ baseUrl: "https://x.example/" });
    expect((c as unknown as { baseUrl: string }).baseUrl).toBe("https://x.example");
  });

  test("default base url is the official API", () => {
    const c = new ListenBrainzClient();
    expect((c as unknown as { baseUrl: string }).baseUrl).toBe(BASE);
  });
});

describe("error handling", () => {
  test("ListenBrainzError is thrown for non-ok responses", async () => {
    const server = Bun.serve({
      port: 0,
      fetch: () => new Response(JSON.stringify({ message: "Token invalid." }), { status: 401 }),
    });
    try {
      const c = new ListenBrainzClient({ baseUrl: `http://127.0.0.1:${server.port}` });
      try {
        await (c as unknown as { getListens(u: string): Promise<unknown> }).getListens("x");
        throw new Error("expected request to fail");
      } catch (err) {
        expect(ListenBrainzError.isInstance(err)).toBe(true);
        if (ListenBrainzError.isInstance(err)) {
          expect(err.status).toBe(401);
          expect(err.path).toBe("/1/user/x/listens");
          expect(err.body).toEqual({ message: "Token invalid." });
        }
      }
    } finally {
      server.stop(true);
    }
  });
});
