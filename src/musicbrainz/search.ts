import type { MbArtist, MbRecording, MbRelease, MbReleaseGroup, MbSearchResponse } from "../types.js";
import { MusicBrainzBase } from "./base.js";

export class MusicBrainzClient extends MusicBrainzBase {
  async searchArtist(query: string, limit = 5): Promise<MbArtist[]> {
    return (await this.search("artist", query, limit)).artists ?? [];
  }
  async searchRecording(query: string, limit = 5): Promise<MbRecording[]> {
    return (await this.search("recording", query, limit)).recordings ?? [];
  }
  async searchRelease(query: string, limit = 5): Promise<MbRelease[]> {
    return (await this.search("release", query, limit)).releases ?? [];
  }
  async searchReleaseGroup(query: string, limit = 5): Promise<MbReleaseGroup[]> {
    return (await this.search("release-group", query, limit))["release-groups"] ?? [];
  }
  async getArtistTopTags(mbid: string, limit = 5): Promise<MbTagName[]> {
    const artist = await this.lookupArtistTags(mbid);
    const tags = [...(artist.genres ?? []), ...(artist.tags ?? [])];
    const unique = new Map(tags.map(({ name, count }) => [name.toLowerCase(), { name: name.toLowerCase(), count }]));
    return [...unique.values()].sort((a, b) => b.count - a.count).slice(0, limit);
  }
  private search(entity: string, query: string, limit: number): Promise<MbSearchResponse> {
    return this.throttled(() =>
      this.http.request({ path: `/ws/2/${entity}`, query: { query, fmt: "json", limit } }),
    );
  }
}
export interface MbTagName {
  name: string;
  count: number;
}
