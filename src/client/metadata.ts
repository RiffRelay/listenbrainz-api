import type {
  AlbumMetadata,
  ArtistMetadata,
  RecordingMetadata,
  ReleaseGroupMetadata,
  TrackMetadataLookupResult,
} from "../types.js";
import type { MetadataLookupOptions } from "./options.js";
import { RecordingClient } from "./recordings.js";

export class MetadataClient extends RecordingClient {
  lookupTrackMetadata(opts: MetadataLookupOptions): Promise<TrackMetadataLookupResult> {
    return this.http.request({
      path: "/1/metadata/lookup",
      query: {
        artist_name: opts.artistName,
        recording_name: opts.recordingName,
        release_name: opts.releaseName,
        duration: opts.durationMs,
      },
    });
  }
  getRecordingMetadata(mbid: string): Promise<RecordingMetadata> {
    return this.http.request({ path: `/1/recording/${encodeURIComponent(mbid)}` });
  }
  getArtistMetadata(mbid: string): Promise<ArtistMetadata> {
    return this.http.request({ path: `/1/artist/${encodeURIComponent(mbid)}` });
  }
  getAlbumMetadata(mbid: string): Promise<AlbumMetadata> {
    return this.http.request({ path: `/1/album/${encodeURIComponent(mbid)}` });
  }
  getReleaseGroupMetadata(mbid: string): Promise<ReleaseGroupMetadata> {
    return this.http.request({ path: `/1/release-group/${encodeURIComponent(mbid)}` });
  }
}
