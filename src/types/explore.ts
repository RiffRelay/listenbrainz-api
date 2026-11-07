import type { ArtistStat, RecordingStat, ReleaseStat } from "./stats.js";

export interface PopularArtistsResponse {
  payload: { artists: ArtistStat[] };
}
export interface PopularRecordingsResponse {
  payload: { recordings: RecordingStat[] };
}
export interface PopularReleasesResponse {
  payload: { releases: ReleaseStat[] };
}
export interface PopularReleaseGroupsResponse {
  payload: { releases: ReleaseStat[] };
}
export interface FreshReleasesResponse {
  count?: number;
  releases?: Array<{
    artist_name: string;
    release_name: string;
    release_mbid: string;
    release_group_mbid: string;
    release_date: string;
    [key: string]: unknown;
  }>;
}
export interface RecommendationResponse {
  payload: { count: number; mbids: string[]; user_name: string };
}
export interface RecommendationStatusResponse {
  status: string;
  payload?: { user_name: string; count: number; last_updated: number };
}
