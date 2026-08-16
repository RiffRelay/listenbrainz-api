import { HttpClient } from "./http.js";
import type {
  MbArtist,
  MbArtistTagsResponse,
  MbRecording,
  MbRelease,
  MbReleaseGroup,
  MbSearchResponse,
} from "./types.js";
import { MUSICBRAINZ_API_BASE } from "./types.js";

export interface MusicBrainzClientOptions {
  baseUrl?: string;
  /**
   * Required by MusicBrainz' API etiquette: should identify your app and a
   * contact URL, e.g. `MyApp/1.0 ( https://example.com )`.
   */
  userAgent: string;
}

export class MusicBrainzClient {
  private readonly http: HttpClient;
  private nextAllowedAt = 0;

  constructor(opts: MusicBrainzClientOptions) {
    this.http = new HttpClient(
      (opts.baseUrl ?? MUSICBRAINZ_API_BASE).replace(/\/$/, ""),
      opts.userAgent,
    );
  }

  private async throttled<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const wait = this.nextAllowedAt - now;
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    try {
      return await fn();
    } finally {
      this.nextAllowedAt = Date.now() + 1000;
    }
  }

  async lookupArtist(mbid: string): Promise<MbArtist> {
    return this.throttled(() =>
      this.http.request<MbArtist>({ path: `/ws/2/artist/${mbid}`, query: { fmt: "json" } }),
    );
  }

  /** Artist with tags + genres resolved. */
  async lookupArtistTags(mbid: string): Promise<MbArtistTagsResponse> {
    return this.throttled(() =>
      this.http.request<MbArtistTagsResponse>({
        path: `/ws/2/artist/${mbid}`,
        query: { fmt: "json", inc: "tags+genres" },
      }),
    );
  }

  async lookupRecording(mbid: string): Promise<MbRecording> {
    return this.throttled(() =>
      this.http.request<MbRecording>({
        path: `/ws/2/recording/${mbid}`,
        query: { fmt: "json" },
      }),
    );
  }

  async lookupReleaseGroup(mbid: string): Promise<MbReleaseGroup> {
    return this.throttled(() =>
      this.http.request<MbReleaseGroup>({
        path: `/ws/2/release-group/${mbid}`,
        query: { fmt: "json" },
      }),
    );
  }

  /** Full release with its track list (inc=recordings). */
  async lookupRelease(mbid: string): Promise<MbRelease> {
    return this.throttled(() =>
      this.http.request<MbRelease>({
        path: `/ws/2/release/${mbid}`,
        query: { fmt: "json", inc: "recordings" },
      }),
    );
  }

  async searchArtist(query: string, limit = 5): Promise<MbArtist[]> {
    const res = await this.throttled(() =>
      this.http.request<MbSearchResponse>({
        path: "/ws/2/artist",
        query: { query, fmt: "json", limit },
      }),
    );
    return res.artists ?? [];
  }

  async searchRecording(query: string, limit = 5): Promise<MbRecording[]> {
    const res = await this.throttled(() =>
      this.http.request<MbSearchResponse>({
        path: "/ws/2/recording",
        query: { query, fmt: "json", limit },
      }),
    );
    return res.recordings ?? [];
  }

  async searchRelease(query: string, limit = 5): Promise<MbRelease[]> {
    const res = await this.throttled(() =>
      this.http.request<MbSearchResponse>({
        path: "/ws/2/release",
        query: { query, fmt: "json", limit },
      }),
    );
    return res.releases ?? [];
  }

  async searchReleaseGroup(query: string, limit = 5): Promise<MbReleaseGroup[]> {
    const res = await this.throttled(() =>
      this.http.request<MbSearchResponse>({
        path: "/ws/2/release-group",
        query: { query, fmt: "json", limit },
      }),
    );
    return res["release-groups"] ?? [];
  }

  /** Top tags (incl. genres) for an artist, sorted by popularity. */
  async getArtistTopTags(mbid: string, limit = 5): Promise<MbTagName[]> {
    const res = await this.lookupArtistTags(mbid);
    const all = [...(res.genres ?? []), ...(res.tags ?? [])];
    const seen = new Set<string>();
    const unique: MbTagName[] = [];
    for (const t of all) {
      const name = t.name.toLowerCase();
      if (seen.has(name)) continue;
      seen.add(name);
      unique.push({ name, count: t.count });
    }
    unique.sort((a, b) => b.count - a.count);
    return unique.slice(0, limit);
  }
}

export interface MbTagName {
  name: string;
  count: number;
}
