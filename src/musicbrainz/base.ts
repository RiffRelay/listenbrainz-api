import { HttpClient } from "../http.js";
import type { MbArtist, MbArtistTagsResponse, MbRecording, MbRelease, MbReleaseGroup } from "../types.js";
import { MUSICBRAINZ_API_BASE } from "../types.js";

export interface MusicBrainzClientOptions {
  baseUrl?: string;
  userAgent: string;
}
export class MusicBrainzBase {
  protected readonly http: HttpClient;
  private nextAllowedAt = 0;
  private queue: Promise<void> = Promise.resolve();

  constructor(opts: MusicBrainzClientOptions) {
    this.http = new HttpClient(
      (opts.baseUrl ?? MUSICBRAINZ_API_BASE).replace(/\/$/, ""),
      opts.userAgent,
    );
  }
  protected async throttled<T>(fn: () => Promise<T>): Promise<T> {
    const request = this.queue.then(async () => {
      const wait = this.nextAllowedAt - Date.now();
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
      try {
        return await fn();
      } finally {
        this.nextAllowedAt = Date.now() + 1000;
      }
    });
    this.queue = request.then(
      () => undefined,
      () => undefined,
    );
    return request;
  }
  lookupArtist(mbid: string): Promise<MbArtist> {
    return this.throttled(() =>
      this.http.request({ path: `/ws/2/artist/${encodeURIComponent(mbid)}`, query: { fmt: "json" } }),
    );
  }
  lookupArtistTags(mbid: string): Promise<MbArtistTagsResponse> {
    return this.throttled(() =>
      this.http.request({
        path: `/ws/2/artist/${encodeURIComponent(mbid)}`,
        query: { fmt: "json", inc: "tags+genres" },
      }),
    );
  }
  lookupRecording(mbid: string): Promise<MbRecording> {
    return this.lookupEntity("recording", mbid);
  }
  lookupReleaseGroup(mbid: string): Promise<MbReleaseGroup> {
    return this.lookupEntity("release-group", mbid);
  }
  lookupRelease(mbid: string): Promise<MbRelease> {
    return this.throttled(() =>
      this.http.request({
        path: `/ws/2/release/${encodeURIComponent(mbid)}`,
        query: { fmt: "json", inc: "recordings" },
      }),
    );
  }
  private lookupEntity<T>(entity: string, mbid: string): Promise<T> {
    return this.throttled(() =>
      this.http.request({ path: `/ws/2/${entity}/${encodeURIComponent(mbid)}`, query: { fmt: "json" } }),
    );
  }
}
