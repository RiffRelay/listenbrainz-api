import type { StatsRange } from "./common.js";

export interface ArtistStat {
  artist_mbid?: string;
  artist_name: string;
  listen_count: number;
  total_listen_count?: number;
}
export interface AlbumStat {
  artist_mbids?: string[];
  artist_name?: string;
  caa_id?: number;
  caa_release_mbid?: string;
  release_mbid?: string;
  release_name: string;
  listen_count: number;
  total_listen_count?: number;
}
export interface ReleaseStat {
  artist_mbids?: string[];
  artist_name?: string;
  caa_id?: number;
  caa_release_mbid?: string;
  release_group_mbid?: string;
  release_name: string;
  listen_count: number;
}
export interface TrackStat {
  artist_mbids?: string[];
  artist_name?: string;
  track_name: string;
  listen_count: number;
  total_listen_count?: number;
}
export interface RecordingStat {
  artist_mbids?: string[];
  artist_name?: string;
  recording_mbid?: string;
  track_name: string;
  caa_id?: number;
  caa_release_mbid?: string;
  release_name?: string;
  listen_count: number;
}
export interface TagStat {
  tag: string;
  listen_count: number;
  total_listen_count?: number;
}
export type StatsEntityItem =
  | ArtistStat
  | AlbumStat
  | ReleaseStat
  | TrackStat
  | RecordingStat
  | TagStat;
export interface StatsPayload {
  count: number;
  total_count: number;
  from_ts: number;
  to_ts: number;
  last_updated: number;
  offset: number;
  range: StatsRange | string;
  [entity: string]: unknown;
}
export interface StatsResponse {
  payload: StatsPayload;
}
export interface SitewideStatsResponse {
  payload: StatsPayload;
}
