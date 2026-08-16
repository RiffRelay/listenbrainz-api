export const LISTENBRAINZ_API_BASE = "https://api.listenbrainz.org";
export const MUSICBRAINZ_API_BASE = "https://musicbrainz.org";

/** Time ranges accepted by the stats endpoints. */
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

/** Entities accepted by the stats endpoints. */
export type StatsEntity = "artists" | "albums" | "releases" | "tracks" | "recordings" | "tags";

/** `listen_type` accepted by `/1/submit-listens`. */
export type ListenType = "single" | "import" | "playing_now";

/** Feedback score: `1` = love, `-1` = hate, `0` = remove. */
export type FeedbackScore = 1 | -1 | 0;

export type FeedEventType = "recording" | "pin" | "notification";

/**
 * Response of `GET /1/status/service-status` — recently updated metrics for
 * age of stats, dumps and the incoming listen queue.
 */
export interface ServiceStatus {
  dump_age: number;
  incoming_listen_count: number;
  /** Seconds since the sitewide stats last ran (`null` while running). */
  sitewide_stats_age: number;
  stats: Array<{ age: number | null; name: string }>;
  /** Seconds since stats last ran (`null` while running). */
  stats_age: number | null;
  time: number;
}

export interface ValidateTokenResponse {
  code: number;
  message: string;
  valid: boolean;
  /** Present when the token is valid. */
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
  /** Lowercase genre-ish tags, e.g. `["rock", "live"]`. */
  tags?: string[];
  media_player?: string;
  submission_client?: string;
  submission_client_version?: string;
  spotify_id?: string;
  youtube_id?: string;
  listening_from?: string;
  [key: string]: unknown;
}

export interface TrackMetadata {
  artist_name: string;
  track_name: string;
  release_name?: string;
  additional_info?: TrackAdditionalInfo;
}

/** Result of the ListenBrainz metadata mapping service (`/1/metadata/lookup`). */
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

export interface Listen {
  /** Unix seconds when the listen happened. */
  listened_at: number;
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
  payload: {
    count: number;
    listens: Listen[];
  };
}

export interface FeedEvent {
  type: FeedEventType;
  user_name: string;
  /** Unix seconds. */
  created: number;
  hidden?: boolean;
  recording_mbid?: string;
  track_metadata?: TrackMetadata;
}

export interface FeedResponse {
  payload: {
    count: number;
    events: FeedEvent[];
    latest_ts?: number;
    user_id: string;
  };
}

export interface CountResponse {
  payload: { count: number };
}

export interface SimilarUser {
  user_name: string;
  similarity: number;
}

export interface SimilarUsersResponse {
  payload: {
    count: number;
    similar_users: SimilarUser[];
  };
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
  /** The live API names recordings by `track_name` (there is no `recording_name`). */
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
  ArtistStat | AlbumStat | ReleaseStat | TrackStat | RecordingStat | TagStat;

export interface StatsPayload {
  count: number;
  total_count: number;
  from_ts: number;
  to_ts: number;
  last_updated: number;
  offset: number;
  range: StatsRange | string;
  /** Singular entity key holds the array: `artist`, `album`, `release`, `track`, `recording` or `tag`. */
  [entity: string]: unknown;
}

export interface StatsResponse {
  payload: StatsPayload;
}

export interface SitewideStatsResponse {
  payload: StatsPayload;
}

export interface LatestActivityResponse {
  count: number;
  latest_listen_ts?: number;
  found?: boolean;
}

export interface SubmitListenResponse {
  status: "ok" | "failed";
  count: number;
  error?: string;
}

export interface DeleteListenResponse {
  status: "ok";
}

export interface Pin {
  pinned_recording_id: number;
  blurb?: string;
  created: number;
  pinned_until?: number | null;
  recording_mbid?: string;
  recording_msid: string;
  track_metadata: TrackMetadata;
  user_name: string;
}

export interface UserPinsResponse {
  payload: {
    count: number;
    pins: Pin[];
  };
}

export interface PinResponse {
  status: "ok";
}

export interface FeedbackItem {
  recording_msid: string;
  score: FeedbackScore;
  user_id: string;
  created?: number;
  recording_mbid?: string;
}

export interface FeedbackResponse {
  count: number;
  offset: number;
  total_count: number;
  feedback: FeedbackItem[];
}

export interface ArtistCredit {
  artist_mbid?: string;
  artist_credit_name: string;
  join_phrase?: string;
}

export interface RecordingMetadata {
  id: string;
  title: string;
  artist_credit: ArtistCredit[];
  release_date?: string;
  release_group_mbid?: string;
  artist_mbids?: string[];
  length?: number;
  caa_id?: number;
  caa_release_mbid?: string;
  first_release_date?: string;
  [key: string]: unknown;
}

export interface ArtistMetadata {
  id: string;
  name: string;
  artist_credit?: ArtistCredit[];
  type?: string;
  country?: string;
  /** Cover art, via the "front" cover of a linked release. */
  caa_release_mbid?: string;
  [key: string]: unknown;
}

export interface AlbumMetadata {
  id: string;
  title: string;
  artist_credit: ArtistCredit[];
  release_date?: string;
  release_group_mbid?: string;
  artist_mbids?: string[];
  caa_id?: number;
  caa_release_mbid?: string;
  length?: number;
  tracks?: RecordingMetadata[];
  [key: string]: unknown;
}

export interface ReleaseGroupMetadata {
  id: string;
  title: string;
  artist_credit: ArtistCredit[];
  release_date?: string;
  artist_mbids?: string[];
  caa_id?: number;
  caa_release_mbid?: string;
  length?: number;
  first_release_date?: string;
  [key: string]: unknown;
}

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
  payload: {
    count: number;
    mbids: string[];
    user_name: string;
  };
}

export interface RecommendationStatusResponse {
  status: string;
  payload?: {
    user_name: string;
    count: number;
    last_updated: number;
  };
}

export interface MbTag {
  count: number;
  name: string;
}

export interface MbArtist {
  id: string;
  name: string;
  "sort-name"?: string;
  country?: string;
  type?: string;
  tags?: MbTag[];
  genres?: MbTag[];
  disambiguation?: string;
  [key: string]: unknown;
}

export interface MbRecording {
  id: string;
  title: string;
  length?: number;
  "artist-credit"?: Array<{ name: string; artist?: MbArtist }>;
  "first-release-date"?: string;
  releases?: Array<{
    id: string;
    title: string;
    date?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface MbReleaseGroup {
  id: string;
  title: string;
  "first-release-date"?: string;
  "primary-type"?: string;
  [key: string]: unknown;
}

export interface MbRelease {
  id: string;
  title: string;
  date?: string;
  country?: string;
  status?: string;
  "artist-credit"?: Array<{ name: string; artist?: MbArtist }>;
  "release-group"?: {
    id: string;
    title: string;
    "primary-type"?: string;
    "first-release-date"?: string;
  };
  media?: Array<{
    position?: number;
    format?: string;
    track_count?: number;
    tracks?: Array<{
      id?: string;
      position?: number;
      number?: string;
      title?: string;
      length?: number;
    }>;
  }>;
  [key: string]: unknown;
}

export interface MbSearchResponse {
  created?: string;
  count: number;
  offset: number;
  artists?: MbArtist[];
  recordings?: MbRecording[];
  releases?: MbRelease[];
  "release-groups"?: MbReleaseGroup[];
  tags?: Array<{ name: string }>;
  [key: string]: unknown;
}

export interface MbArtistTagsResponse {
  id: string;
  name: string;
  tags?: MbTag[];
  genres?: MbTag[];
  [key: string]: unknown;
}
