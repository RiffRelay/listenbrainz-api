import type {
  FeedResponse,
  LatestActivityResponse,
  LatestImportResponse,
  ListeningActivityResponse,
  ServiceStatus,
  SimilarUsersResponse,
  ValidateTokenResponse,
} from "../types.js";
import { ClientBase } from "./base.js";

export class UserClient extends ClientBase {
  getServiceStatus(): Promise<ServiceStatus> {
    return this.http.request({ path: "/1/status/service-status" });
  }
  async isHealthy(): Promise<boolean> {
    try {
      await this.getServiceStatus();
      return true;
    } catch {
      return false;
    }
  }
  validateToken(token: string): Promise<ValidateTokenResponse> {
    return this.http.request({ path: "/1/validate-token", token });
  }
  getFeed(user: string, opts: { count?: number; maxTs?: number } = {}): Promise<FeedResponse> {
    return this.http.request({
      path: `/1/user/${encodeURIComponent(user)}/get-feed`,
      query: { count: opts.count, max_ts: opts.maxTs },
    });
  }
  getListeningActivity(
    user: string,
    opts: { fromTs?: number; toTs?: number } = {},
  ): Promise<ListeningActivityResponse> {
    return this.http.request({
      path: `/1/user/${encodeURIComponent(user)}/listening-activity`,
      query: { from_ts: opts.fromTs, to_ts: opts.toTs },
    });
  }
  getLatestImport(user: string): Promise<LatestImportResponse> {
    return this.http.request({ path: `/1/user/${encodeURIComponent(user)}/latest-import` });
  }
  getSimilarUsers(user: string, opts: { count?: number } = {}): Promise<SimilarUsersResponse> {
    return this.http.request({
      path: `/1/user/${encodeURIComponent(user)}/similar-users`,
      query: { count: opts.count },
    });
  }
  getLatestActivity(
    user: string,
    opts: { previousTs?: number } = {},
  ): Promise<LatestActivityResponse> {
    return this.http.request({
      path: `/1/stats/user/${encodeURIComponent(user)}/latest-activity`,
      query: { previous_ts: opts.previousTs },
    });
  }
}
