import type { SitewideStatsResponse, StatsEntity, StatsResponse } from "../types.js";
import { ListensClient } from "./listens.js";
import type { StatsQueryOptions } from "./options.js";

export class StatsClient extends ListensClient {
  getArtistStats(user: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(user, "artists", opts);
  }
  getAlbumStats(user: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(user, "albums", opts);
  }
  getReleaseStats(user: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(user, "releases", opts);
  }
  getTrackStats(user: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(user, "tracks", opts);
  }
  getRecordingStats(user: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(user, "recordings", opts);
  }
  getTagStats(user: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(user, "tags", opts);
  }
  getStats(user: string, entity: StatsEntity, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.http.request({
      path: `/1/stats/user/${encodeURIComponent(user)}/${entity}`,
      query: { range: opts.range, count: opts.count, offset: opts.offset },
    });
  }
  getSitewideStats(entity: StatsEntity, opts: StatsQueryOptions = {}): Promise<SitewideStatsResponse> {
    return this.http.request({
      path: `/1/stats/sitewide/${entity}`,
      query: { range: opts.range, count: opts.count, offset: opts.offset },
    });
  }
  async getArtistCount(user: string): Promise<number> {
    return this.totalFor(user, "artists", "total_artist_count");
  }
  async getReleaseCount(user: string): Promise<number> {
    return this.totalFor(user, "releases", "total_release_count");
  }
  private async totalFor(user: string, entity: StatsEntity, key: string): Promise<number> {
    const response = await this.getStats(user, entity, { range: "all_time", count: 1 });
    return Number(response.payload[key] ?? 0);
  }
}
