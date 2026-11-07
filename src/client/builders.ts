import type { TrackMetadata } from "../types.js";
import type { SubmitPayload, TrackMetadataInput } from "./options.js";

export function createTrackMetadata(input: TrackMetadataInput): TrackMetadata {
  const additional_info = Object.fromEntries(
    Object.entries({
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
    }).filter(([, value]) => value !== undefined),
  ) as TrackMetadata["additional_info"];
  return {
    artist_name: input.artistName,
    track_name: input.trackName,
    ...(input.releaseName ? { release_name: input.releaseName } : {}),
    additional_info,
  };
}
export function createNowPlaying(input: TrackMetadataInput): TrackMetadata {
  return createTrackMetadata({ ...input, mediaPlayer: input.mediaPlayer ?? "BrainzBot" });
}
export function createListen(input: TrackMetadataInput & { listenedAt: number }): SubmitPayload {
  return {
    listenedAt: input.listenedAt,
    trackMetadata: createTrackMetadata({ ...input, mediaPlayer: input.mediaPlayer ?? "BrainzBot" }),
  };
}
