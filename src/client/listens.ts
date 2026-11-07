import type { Listen, ListensResponse, PlayingNowResponse } from "../types.js";
import type { ListensQueryOptions } from "./options.js";
import { UserClient } from "./user.js";

export class ListensClient extends UserClient {
  getListens(user: string, opts: ListensQueryOptions = {}): Promise<ListensResponse> {
    return this.http.request({
      path: `/1/user/${encodeURIComponent(user)}/listens`,
      query: {
        count: opts.count,
        max_ts: opts.maxTs,
        min_ts: opts.minTs,
        metadata: opts.musicBrainzMetadata ? 1 : undefined,
      },
    });
  }
  getPlayingNow(user: string): Promise<PlayingNowResponse> {
    return this.http.request({
      path: `/1/user/${encodeURIComponent(user)}/playing-now`,
      query: { metadata: 1 },
    });
  }
  async getListenCount(user: string): Promise<number> {
    const res = await this.http.request<{ payload: { count: number } }>({
      path: `/1/user/${encodeURIComponent(user)}/listen-count`,
    });
    return res.payload.count;
  }
}

export type { Listen };
