import type { TrackMetadata } from "../types.js";

export interface ListenBrainzClientOptions {
  baseUrl?: string;
  token?: string;
  userAgent?: string;
}
export interface ListensQueryOptions {
  count?: number;
  maxTs?: number;
  minTs?: number;
  musicBrainzMetadata?: boolean;
}
export interface StatsQueryOptions {
  range?: import("../types.js").StatsRange;
  count?: number;
  offset?: number;
}
export interface MetadataLookupOptions {
  artistName: string;
  recordingName: string;
  releaseName?: string;
  durationMs?: number;
}
export interface SubmitPayload {
  listenedAt?: number;
  trackMetadata: TrackMetadata;
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
