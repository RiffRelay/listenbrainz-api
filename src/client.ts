import { HttpClient } from "./http.js";
import type {
  AlbumMetadata,
  ArtistMetadata,
  FeedbackResponse,
  FeedbackScore,
  FeedResponse,
  FreshReleasesResponse,
  LatestActivityResponse,
  LatestImportResponse,
  Listen,
  ListeningActivityResponse,
  ListensResponse,
  ListenType,
  PinResponse,
  PlayingNowResponse,
  PopularArtistsResponse,
  PopularRecordingsResponse,
  PopularReleaseGroupsResponse,
  PopularReleasesResponse,
  RecommendationResponse,
  RecommendationStatusResponse,
  RecordingMetadata,
  ReleaseGroupMetadata,
  ServiceStatus,
  SimilarUsersResponse,
  SitewideStatsResponse,
  StatsEntity,
  StatsRange,
  StatsResponse,
  SubmitListenResponse,
  TrackMetadata,
  TrackMetadataLookupResult,
  UserPinsResponse,
  ValidateTokenResponse,
} from "./types.js";
import { LISTENBRAINZ_API_BASE } from "./types.js";

export interface ListenBrainzClientOptions {
  /** Base URL — defaults to the official API. Override for testing/proxies. */
  baseUrl?: string;
  /** Persistent token used for all authenticated requests. */
  token?: string;
  /** User-Agent sent with every request (required by ListenBrainz policy). */
  userAgent?: string;
}

export interface ListensQueryOptions {
  count?: number;
  /** Only return listens with `listened_at <= maxTs`. */
  maxTs?: number;
  /** Only return listens with `listened_at >= minTs`. */
  minTs?: number;
  /** Fetch MusicBrainz metadata alongside each listen. */
  musicBrainzMetadata?: boolean;
}

export interface StatsQueryOptions {
  range?: StatsRange;
  count?: number;
  offset?: number;
}

export interface MetadataLookupOptions {
  artistName: string;
  recordingName: string;
  releaseName?: string;
  /** Matching hint in milliseconds, when known. */
  durationMs?: number;
}

export interface SubmitPayload {
  listenedAt?: number;
  trackMetadata: TrackMetadata;
}

export class ListenBrainzClient {
  private readonly http: HttpClient;
  private readonly baseUrl: string;

  constructor(opts: ListenBrainzClientOptions = {}) {
    this.baseUrl = (opts.baseUrl ?? LISTENBRAINZ_API_BASE).replace(/\/$/, "");
    this.http = new HttpClient(
      this.baseUrl,
      opts.userAgent ?? this.buildDefaultUserAgent(),
      opts.token,
    );
  }

  private buildDefaultUserAgent(): string {
    return `listenbrainz-api/0.1.0 (https://github.com/yourname/listenbrainz-api; bun)`;
  }

  /** Service status metrics — age of stats/dumps and the incoming listen queue. */
  async getServiceStatus(): Promise<ServiceStatus> {
    return this.http.request<ServiceStatus>({ path: "/1/status/service-status" });
  }

  /** Health check — a successful `GET /1/status/service-status` means healthy. */
  async isHealthy(): Promise<boolean> {
    try {
      await this.http.request<ServiceStatus>({ path: "/1/status/service-status" });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate a token without touching stored state. Returns the owning
   * username when `valid` is true.
   */
  async validateToken(token: string): Promise<ValidateTokenResponse> {
    return this.http.request<ValidateTokenResponse>({
      method: "GET",
      path: "/1/validate-token",
      query: { token },
      token,
    });
  }

  /** Fetch a user's most recent listens (newest first). */
  async getListens(userName: string, opts: ListensQueryOptions = {}): Promise<ListensResponse> {
    return this.http.request<ListensResponse>({
      path: `/1/user/${encodeURIComponent(userName)}/listens`,
      query: {
        count: opts.count,
        max_ts: opts.maxTs,
        min_ts: opts.minTs,
        metadata: opts.musicBrainzMetadata ? 1 : undefined,
      },
    });
  }

  /** What the user is currently playing (may be an empty payload). */
  async getPlayingNow(userName: string): Promise<PlayingNowResponse> {
    return this.http.request<PlayingNowResponse>({
      path: `/1/user/${encodeURIComponent(userName)}/playing-now`,
      query: { metadata: 1 },
    });
  }

  /**
   * Map a track to MusicBrainz via the ListenBrainz metadata service.
   * Requires an authenticated client (a linked user token).
   */
  async lookupTrackMetadata(opts: MetadataLookupOptions): Promise<TrackMetadataLookupResult> {
    const query: Record<string, string> = {
      artist_name: opts.artistName,
      recording_name: opts.recordingName,
    };
    if (opts.releaseName) query.release_name = opts.releaseName;
    if (opts.durationMs !== undefined) query.duration = String(opts.durationMs);
    return this.http.request<TrackMetadataLookupResult>({
      path: "/1/metadata/lookup",
      query,
    });
  }

  /** The user's activity feed (scrobbles, pins, notifications). */
  async getFeed(
    userName: string,
    opts: { count?: number; maxTs?: number } = {},
  ): Promise<FeedResponse> {
    return this.http.request<FeedResponse>({
      path: `/1/user/${encodeURIComponent(userName)}/get-feed`,
      query: { count: opts.count, max_ts: opts.maxTs },
    });
  }

  /** Total number of listens for a user. */
  async getListenCount(userName: string): Promise<number> {
    const res = await this.http.request<{ payload: { count: number } }>({
      path: `/1/user/${encodeURIComponent(userName)}/listen-count`,
    });
    return res.payload.count;
  }

  /**
   * Total number of distinct artists for a user.
   *
   * The legacy `/1/user/<name>/artist-count` endpoint is gone, so this reads
   * the all-time stats payload's `total_artist_count` instead.
   */
  async getArtistCount(userName: string): Promise<number> {
    const res = await this.http.request<{ payload: { total_artist_count: number } }>({
      path: `/1/stats/user/${encodeURIComponent(userName)}/artists`,
      query: { range: "all_time", count: 1 },
    });
    return res.payload.total_artist_count;
  }

  /**
   * Total number of distinct releases for a user.
   *
   * The legacy `/1/user/<name>/release-count` endpoint is gone, so this reads
   * the all-time stats payload's `total_release_count` instead.
   */
  async getReleaseCount(userName: string): Promise<number> {
    const res = await this.http.request<{ payload: { total_release_count: number } }>({
      path: `/1/stats/user/${encodeURIComponent(userName)}/releases`,
      query: { range: "all_time", count: 1 },
    });
    return res.payload.total_release_count;
  }

  /** Users most similar to a user (by listening history similarity). */
  async getSimilarUsers(
    userName: string,
    opts: { count?: number } = {},
  ): Promise<SimilarUsersResponse> {
    return this.http.request<SimilarUsersResponse>({
      path: `/1/user/${encodeURIComponent(userName)}/similar-users`,
      query: { count: opts.count },
    });
  }

  /** Listen activity bucketed by time range (week/month/year). */
  async getListeningActivity(
    userName: string,
    opts: { fromTs?: number; toTs?: number } = {},
  ): Promise<ListeningActivityResponse> {
    return this.http.request<ListeningActivityResponse>({
      path: `/1/user/${encodeURIComponent(userName)}/listening-activity`,
      query: { from_ts: opts.fromTs, to_ts: opts.toTs },
    });
  }

  /** The timestamp of the most recent Last.fm import, if any. */
  async getLatestImport(userName: string): Promise<LatestImportResponse> {
    return this.http.request<LatestImportResponse>({
      path: `/1/user/${encodeURIComponent(userName)}/latest-import`,
    });
  }

  /** Top artists for a user, for a given range. */
  async getArtistStats(userName: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(userName, "artists", opts);
  }

  /** Top albums for a user. */
  async getAlbumStats(userName: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(userName, "albums", opts);
  }

  /** Top release groups for a user. */
  async getReleaseStats(userName: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(userName, "releases", opts);
  }

  /** Top tracks for a user. */
  async getTrackStats(userName: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(userName, "tracks", opts);
  }

  /** Top recordings for a user. */
  async getRecordingStats(userName: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(userName, "recordings", opts);
  }

  /** Top tags for a user. */
  async getTagStats(userName: string, opts: StatsQueryOptions = {}): Promise<StatsResponse> {
    return this.getStats(userName, "tags", opts);
  }

  /** Generic stats accessor — `entity` must be one of the `StatsEntity` values. */
  async getStats(
    userName: string,
    entity: StatsEntity,
    opts: StatsQueryOptions = {},
  ): Promise<StatsResponse> {
    return this.http.request<StatsResponse>({
      path: `/1/stats/user/${encodeURIComponent(userName)}/${entity}`,
      query: {
        range: opts.range,
        count: opts.count,
        offset: opts.offset,
      },
    });
  }

  /** The timestamp of the user's most recent listen. */
  async getLatestActivity(
    userName: string,
    opts: { previousTs?: number } = {},
  ): Promise<LatestActivityResponse> {
    return this.http.request<LatestActivityResponse>({
      path: `/1/stats/user/${encodeURIComponent(userName)}/latest-activity`,
      query: { previous_ts: opts.previousTs },
    });
  }

  /** Sitewide (all users) stats for an entity. */
  async getSitewideStats(
    entity: StatsEntity,
    opts: StatsQueryOptions = {},
  ): Promise<SitewideStatsResponse> {
    return this.http.request<SitewideStatsResponse>({
      path: `/1/stats/sitewide/${entity}`,
      query: { range: opts.range, count: opts.count, offset: opts.offset },
    });
  }

  /** Submit a single listen with an explicit timestamp. */
  async submitListen(token: string, payload: SubmitPayload): Promise<SubmitListenResponse> {
    return this.submit(token, "single", [payload]);
  }

  /** Broadcast "now playing" (no `listenedAt`, replaces current now-playing). */
  async submitNowPlaying(
    token: string,
    trackMetadata: TrackMetadata,
  ): Promise<SubmitListenResponse> {
    return this.submit(token, "playing_now", [{ trackMetadata }]);
  }

  /** Bulk-import a batch of listens. */
  async submitImport(token: string, listens: SubmitPayload[]): Promise<SubmitListenResponse> {
    return this.submit(token, "import", listens);
  }

  private async submit(
    token: string,
    listenType: ListenType,
    listens: SubmitPayload[],
  ): Promise<SubmitListenResponse> {
    return this.http.request<SubmitListenResponse>({
      method: "POST",
      path: "/1/submit-listens",
      token,
      body: {
        listen_type: listenType,
        payload: listens.map((l) => ({
          ...(l.listenedAt !== undefined ? { listened_at: l.listenedAt } : {}),
          track_metadata: l.trackMetadata,
        })),
      },
    });
  }

  /** Delete a specific listen (requires `recordingMsid`). */
  async deleteListen(
    token: string,
    opts: { listenedAt: number; recordingMsid: string },
  ): Promise<{ status: "ok" }> {
    return this.http.request<{ status: "ok" }>({
      method: "POST",
      path: "/1/delete-listen",
      token,
      body: { listened_at: opts.listenedAt, recording_msid: opts.recordingMsid },
    });
  }

  /** Pin a recording (uses the recording MSID). */
  async pin(token: string, opts: { recordingMsid: string; blurb?: string }): Promise<PinResponse> {
    return this.http.request<PinResponse>({
      method: "POST",
      path: "/1/pin",
      token,
      body: { recording_msid: opts.recordingMsid, blurb: opts.blurb },
    });
  }

  /** Unpin the current recording. */
  async unpin(token: string): Promise<PinResponse> {
    return this.http.request<PinResponse>({ method: "POST", path: "/1/unpin", token });
  }

  /** A user's pinned recordings. */
  async getUserPins(
    userName: string,
    opts: { count?: number; offset?: number } = {},
  ): Promise<UserPinsResponse> {
    return this.http.request<UserPinsResponse>({
      path: `/1/user/${encodeURIComponent(userName)}/pins`,
      query: { count: opts.count, offset: opts.offset },
    });
  }

  /** Set feedback on a recording: `1` love, `-1` hate, `0` remove. */
  async submitFeedback(
    token: string,
    opts: { recordingMsid: string; score: FeedbackScore },
  ): Promise<{ status: "ok" }> {
    return this.http.request<{ status: "ok" }>({
      method: "POST",
      path: "/1/feedback/recording-feedback",
      token,
      body: { recording_msid: opts.recordingMsid, score: opts.score },
    });
  }

  /** Remove feedback for a recording. */
  async deleteFeedback(token: string, opts: { recordingMsid: string }): Promise<{ status: "ok" }> {
    return this.http.request<{ status: "ok" }>({
      method: "POST",
      path: "/1/feedback/recording-feedback/delete",
      token,
      body: { recording_msid: opts.recordingMsid },
    });
  }

  /** A user's feedback (love/hate) on recordings. */
  async getFeedback(
    userName: string,
    opts: { recordingMsid?: string; count?: number; offset?: number } = {},
  ): Promise<FeedbackResponse> {
    return this.http.request<FeedbackResponse>({
      path: `/1/feedback/user/${encodeURIComponent(userName)}/recording-feedback`,
      query: {
        recording_msid: opts.recordingMsid,
        count: opts.count,
        offset: opts.offset,
      },
    });
  }

  /** Full metadata for a recording MBID. */
  async getRecordingMetadata(mbid: string): Promise<RecordingMetadata> {
    return this.http.request<RecordingMetadata>({ path: `/1/recording/${mbid}` });
  }

  /** Full metadata for an artist MBID. */
  async getArtistMetadata(mbid: string): Promise<ArtistMetadata> {
    return this.http.request<ArtistMetadata>({ path: `/1/artist/${mbid}` });
  }

  /** Full metadata for an album/release MBID. */
  async getAlbumMetadata(mbid: string): Promise<AlbumMetadata> {
    return this.http.request<AlbumMetadata>({ path: `/1/album/${mbid}` });
  }

  /** Full metadata for a release-group MBID. */
  async getReleaseGroupMetadata(mbid: string): Promise<ReleaseGroupMetadata> {
    return this.http.request<ReleaseGroupMetadata>({ path: `/1/release-group/${mbid}` });
  }

  async getPopularArtists(count = 25): Promise<PopularArtistsResponse> {
    return this.http.request<PopularArtistsResponse>({
      path: "/1/explore/popular-artists",
      query: { count },
    });
  }

  async getPopularRecordings(count = 25): Promise<PopularRecordingsResponse> {
    return this.http.request<PopularRecordingsResponse>({
      path: "/1/explore/popular-recordings",
      query: { count },
    });
  }

  async getPopularReleases(count = 25): Promise<PopularReleasesResponse> {
    return this.http.request<PopularReleasesResponse>({
      path: "/1/explore/popular-releases",
      query: { count },
    });
  }

  async getPopularReleaseGroups(count = 25): Promise<PopularReleaseGroupsResponse> {
    return this.http.request<PopularReleaseGroupsResponse>({
      path: "/1/explore/popular-release-groups",
      query: { count },
    });
  }

  /** Releases released within the last `days` days. */
  async getFreshReleases(days = 30): Promise<FreshReleasesResponse> {
    return this.http.request<FreshReleasesResponse>({
      path: "/1/fresh-releases/",
      query: { days },
    });
  }

  /** Collaborative-filtering recording recommendations for a user. */
  async getRecommendedRecordings(
    userName: string,
    opts: { count?: number } = {},
  ): Promise<RecommendationResponse> {
    return this.http.request<RecommendationResponse>({
      path: `/1/recommendation/cf-recording/${encodeURIComponent(userName)}/top`,
      query: { count: opts.count },
    });
  }

  /** Status of the recommendation engine for a user. */
  async getRecommendationStatus(userName: string): Promise<RecommendationStatusResponse> {
    return this.http.request<RecommendationStatusResponse>({
      path: `/1/recommendation/cf-recording/${encodeURIComponent(userName)}/status`,
    });
  }
}

export interface TrackMetadataInput {
  artistName: string;
  trackName: string;
  releaseName?: string;
  durationMs?: number;
  recordingMbid?: string;
  releaseMbid?: string;
  trackMbid?: string;
  artistMbids?: string[];
  tags?: string[];
  mediaPlayer?: string;
  submissionClient?: string;
  submissionClientVersion?: string;
  spotifyId?: string;
  youtubeId?: string;
}

export function createTrackMetadata(input: TrackMetadataInput): TrackMetadata {
  const additional_info: TrackMetadata["additional_info"] = {
    duration_ms: input.durationMs,
    recording_mbid: input.recordingMbid,
    release_mbid: input.releaseMbid,
    track_mbid: input.trackMbid,
    artist_mbids: input.artistMbids,
    tags: input.tags,
    media_player: input.mediaPlayer,
    submission_client: input.submissionClient,
    submission_client_version: input.submissionClientVersion,
    spotify_id: input.spotifyId,
    youtube_id: input.youtubeId,
  };
  for (const key of Object.keys(additional_info)) {
    if (additional_info[key] === undefined) delete additional_info[key];
  }
  return {
    artist_name: input.artistName,
    track_name: input.trackName,
    ...(input.releaseName ? { release_name: input.releaseName } : {}),
    additional_info,
  };
}

/** Convenience: now-playing payload for `submitNowPlaying`. */
export function createNowPlaying(input: TrackMetadataInput): TrackMetadata {
  return createTrackMetadata({ ...input, mediaPlayer: input.mediaPlayer ?? "BrainzBot" });
}

/** Convenience: a completed listen payload for `submitListen`. */
export function createListen(input: TrackMetadataInput & { listenedAt: number }): SubmitPayload {
  return {
    listenedAt: input.listenedAt,
    trackMetadata: createTrackMetadata({ ...input, mediaPlayer: input.mediaPlayer ?? "BrainzBot" }),
  };
}

// Re-export the most useful types here so consumers have a single import path.
export type { Listen, ListenType, TrackMetadata };
