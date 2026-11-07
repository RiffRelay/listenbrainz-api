# Submitting listens, feedback and pins

Write calls require the user's ListenBrainz token. Pass it explicitly even
when the client also has a default token; this makes the target account clear.
The token is sent in the Authorization header.

## Submit a listen or now-playing update

```ts
import { createListen, createNowPlaying } from "listenbrainz-api";

const token = process.env.LISTENBRAINZ_TOKEN!;
const metadata = {
  artistName: "Daft Punk",
  trackName: "One More Time",
  releaseName: "Discovery",
  durationMs: 320_000,
  submissionClient: "MyPlayer",
  submissionClientVersion: "1.0",
};

await lb.submitListen(token, createListen({
  ...metadata,
  listenedAt: Math.floor(Date.now() / 1000),
}));
await lb.submitNowPlaying(token, createNowPlaying(metadata));
```

`createTrackMetadata` builds the ListenBrainz `track_metadata` object and
omits undefined optional fields. `createListen` adds `listenedAt` in Unix
seconds; `createNowPlaying` does not. A listen should only be submitted after
the service's scrobble threshold (at least half the track or four minutes,
whichever comes first). `submitImport(token, listens)` sends a batch import.
All submission methods return `{ status, count, error? }`.

## Love, hate and pins

The bot gets the current recording MSID from
`getPlayingNow(user).payload.listens[0].track_metadata.additional_info
.recording_msid`. If there is no current item or no MSID, it cannot submit
recording feedback or a pin.

```ts
await lb.submitFeedback(token, { recordingMsid, score: 1 });  // love
await lb.submitFeedback(token, { recordingMsid, score: -1 }); // hate
await lb.deleteFeedback(token, { recordingMsid });            // score 0
await lb.pin(token, { recordingMsid, blurb: "On repeat" });
await lb.unpin(token);
```

`getFeedback(user, { score, count, offset, metadata })` reads a user's
feedback; omit `score` to get all feedback. `getUserPins(user, { count,
offset })` returns `{ payload: { count, pins } }`. Pin records include their
track metadata and recording identifiers. Mutating a different user's data
requires that user's token; public reads do not.

## Delete one listen

`deleteListen(token, { listenedAt, recordingMsid })` schedules deletion of
that exact listen. Supply the timestamp and recording MSID from a listen
record, not the current playing item.
