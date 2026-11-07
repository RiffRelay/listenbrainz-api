import type { FeedEventType, TrackMetadata } from "./common.js";

export interface Listen {
  listened_at?: number;
  playing_now?: boolean;
  track_metadata: TrackMetadata;
  track_name?: string;
  user_name?: string;
}

export interface ListensPayload {
  count: number;
  listens: Listen[];
  user_id: string;
  latest_listened_at?: number;
  oldest_listened_at?: number;
}
export interface ListensResponse {
  payload: ListensPayload;
}
export interface PlayingNowResponse {
  payload: { count: number; listens: Listen[] };
}
export interface FeedEvent {
  type: FeedEventType;
  user_name: string;
  created: number;
  hidden?: boolean;
  recording_mbid?: string;
  track_metadata?: TrackMetadata;
}
export interface FeedResponse {
  payload: { count: number; events: FeedEvent[]; latest_ts?: number; user_id: string };
}
export interface CountResponse {
  payload: { count: number };
}
export interface SimilarUser {
  user_name: string;
  similarity: number;
}
export interface SimilarUsersResponse {
  payload: { count: number; similar_users: SimilarUser[] };
}
export interface ListeningActivity {
  from_ts: number;
  to_ts: number;
  time_range: string;
  listen_count: number;
}
export interface ListeningActivityResponse {
  payload: ListeningActivity[];
}
export interface LatestImportResponse {
  payload: { latest_import: string | null };
}
export interface LatestActivityResponse {
  count: number;
  latest_listen_ts?: number;
  found?: boolean;
}
