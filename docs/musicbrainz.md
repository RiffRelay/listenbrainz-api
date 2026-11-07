# MusicBrainz companion client

Use `MusicBrainzClient` when a user supplies a name rather than a MusicBrainz
ID. The client searches the MusicBrainz Web Service, then its lookup methods
fetch a selected entity by MBID.

```ts
import { MusicBrainzClient } from "listenbrainz-api";

const mb = new MusicBrainzClient({
  userAgent: "RiffRelay/1.0 (https://github.com/RiffRelay/RiffRelayBot)",
});
const recordings = await mb.searchRecording("Paranoid Android", 5);
const recording = recordings[0]
  ? await mb.lookupRecording(recordings[0].id)
  : undefined;
```

`searchArtist`, `searchRecording`, `searchRelease`, and `searchReleaseGroup`
return arrays (default limit 5). `lookupArtist`, `lookupRecording`,
`lookupRelease`, and `lookupReleaseGroup` return the corresponding entity.
`lookupRelease` includes its recordings. `lookupArtistTags` requests tags and
genres; `getArtistTopTags(mbid, limit)` merges both lists, removes duplicates,
sorts by count, and returns `{ name, count }` items.

MusicBrainz requires a descriptive, contactable User-Agent and at most one
request per second. Use one client instance and await searches/lookups rather
than launching parallel calls. The throttle is shared by that instance.
MusicBrainz records use API field names such as `"artist-credit"` and
`"first-release-date"`, not ListenBrainz' snake_case listen metadata.
