import type {
  FreshReleasesResponse,
  PopularArtistsResponse,
  PopularRecordingsResponse,
  PopularReleaseGroupsResponse,
  PopularReleasesResponse,
} from "../types.js";
import { MetadataClient } from "./metadata.js";

export class ExploreClient extends MetadataClient {
  getPopularArtists(count = 25): Promise<PopularArtistsResponse> {
    return this.http.request({ path: "/1/explore/popular-artists", query: { count } });
  }
  getPopularRecordings(count = 25): Promise<PopularRecordingsResponse> {
    return this.http.request({ path: "/1/explore/popular-recordings", query: { count } });
  }
  getPopularReleases(count = 25): Promise<PopularReleasesResponse> {
    return this.http.request({ path: "/1/explore/popular-releases", query: { count } });
  }
  getPopularReleaseGroups(count = 25): Promise<PopularReleaseGroupsResponse> {
    return this.http.request({ path: "/1/explore/popular-release-groups", query: { count } });
  }
  getFreshReleases(days = 30): Promise<FreshReleasesResponse> {
    return this.http.request({ path: "/1/explore/fresh-releases/", query: { days } });
  }
}
