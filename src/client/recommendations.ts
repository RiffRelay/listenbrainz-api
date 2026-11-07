import type { RecommendationResponse, RecommendationStatusResponse } from "../types.js";
import { ExploreClient } from "./explore.js";

export class ListenBrainzClient extends ExploreClient {
  getRecommendedRecordings(
    user: string,
    opts: { count?: number } = {},
  ): Promise<RecommendationResponse> {
    return this.http.request({
      path: `/1/recommendation/cf-recording/${encodeURIComponent(user)}/top`,
      query: { count: opts.count },
    });
  }
  getRecommendationStatus(user: string): Promise<RecommendationStatusResponse> {
    return this.http.request({
      path: `/1/recommendation/cf-recording/${encodeURIComponent(user)}/status`,
    });
  }
}
