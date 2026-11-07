# Music metadata and discovery

## ListenBrainz metadata

`lookupTrackMetadata({ artistName, recordingName, releaseName?, durationMs? })`
asks ListenBrainz to map a track to MusicBrainz. The optional release and
duration improve matching; `durationMs` is milliseconds. The result can
include recording/release MBIDs and a Cover Art Archive release MBID.

```ts
const match = await lb.lookupTrackMetadata({
  artistName: "Radiohead",
  recordingName: "Paranoid Android",
});
if (match.recording_mbid) {
  const recording = await lb.getRecordingMetadata(match.recording_mbid);
  console.log(recording.title, recording.artist_credit);
}
```

Metadata getters accept MBIDs: `getRecordingMetadata`, `getArtistMetadata`,
`getAlbumMetadata`, and `getReleaseGroupMetadata`. These are ListenBrainz
metadata responses, not raw MusicBrainz Web Service records.

## Explore and recommendations

`getPopularArtists`, `getPopularRecordings`, `getPopularReleases`, and
`getPopularReleaseGroups` accept an optional result count (default 25).
`getFreshReleases(days)` requests releases within the given number of days
(default 30). Inspect each response's `payload` or `releases` property as
defined by its response type.

`getRecommendedRecordings(user, { count })` returns recording MBIDs in
`payload.mbids`. `getRecommendationStatus(user)` reports the service's
recommendation status and may not include a payload until results are ready.

For MusicBrainz text search and detailed entity records, use the separate
[`MusicBrainzClient`](musicbrainz.md), which handles the required request
throttle.
