export type StatsRange =
  | "today"
  | "yesterday"
  | "this_week"
  | "this_month"
  | "this_year"
  | "week"
  | "month"
  | "year"
  | "all_time";
export type StatsEntity = "artists" | "albums" | "releases" | "tracks" | "recordings" | "tags";
export type ListenType = "single" | "import" | "playing_now";
export type FeedbackScore = 1 | -1 | 0;
export type FeedEventType = "recording" | "pin" | "notification";

export interface ServiceStatus {
  dump_age: number;
  incoming_listen_count: number;
  sitewide_stats_age: number | null;
  stats: Array<{ age: number | null; name: string }>;
  stats_age: number | null;
  time: number;
}

export interface ValidateTokenResponse {
  code: number;
  message: string;
  valid: boolean;
  user_name?: string;
}

export interface TrackAdditionalInfo {
  artist_mbids?: string[];
  artist_msid?: string;
  duration_ms?: number;
  release_mbid?: string;
  recording_mbid?: string;
  recording_msid?: string;
  track_mbid?: string;
  tags?: string[];
  media_player?: string;
  submission_client?: string;
  submission_client_version?: string;
  spotify_id?: string;
  youtube_id?: string;
  listening_from?: string;
  origin_url?: string;
  caa_release_mbid?: string;
  [key: string]: unknown;
}

export interface TrackMetadata {
  artist_name: string;
  track_name: string;
  release_name?: string;
  additional_info?: TrackAdditionalInfo;
}

export interface TrackMetadataLookupResult {
  artist_credit_name?: string;
  artist_mbids?: string[];
  recording_mbid?: string;
  recording_name?: string;
  release_mbid?: string;
  release_name?: string;
  caa_id?: number;
  caa_release_mbid?: string;
}
