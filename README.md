# listenbrainz-api

A fully typed, zero-dependency [ListenBrainz](https://listenbrainz.org) REST API client for modern TypeScript (Node 18+, Bun). Includes a throttled [MusicBrainz](https://musicbrainz.org) companion client for entity lookup and search.

> The existing npm `listenbrainz` package is unmaintained. This client is a
> from-scratch implementation built against the live API.

## Features

- **Complete API coverage** — listens, now-playing, stats, scrobble submission, pins, feedback/love, explore, fresh releases, recommendations, and MusicBrainz metadata lookup.
- **Zero runtime dependencies** — built on the platform `fetch`; runs on Node 18+, Bun, Deno and Cloudflare Workers.
- **Resilient by default** — automatic retries with exponential backoff on `429`/`5xx` (honouring `Retry-After`), per-request timeouts, and a uniform `ListenBrainzError`.
- **Type-safe end to end** — strict TypeScript, discriminated responses, no `any` leaks, no stringly-typed payloads.
- **Scrobble helpers** — `createListen` / `createNowPlaying` / `createTrackMetadata` builders that construct valid payloads with zero boilerplate.
- **MusicBrainz etiquette built in** — enforced ~1 req/s throttle on the companion client.

## Requirements

- **Node.js ≥ 18** (or any modern runtime with global `fetch`, e.g. Bun, Deno)
- TypeScript ≥ 5 if you want the built-in types

## Install

```sh
npm install listenbrainz-api
# or
pnpm add listenbrainz-api
# or
bun add listenbrainz-api
```

The package is **ESM-only** (`type: "module"`).

## Quick start

```ts
import { ListenBrainzClient, createNowPlaying, createListen } from "listenbrainz-api";

const lb = new ListenBrainzClient({
  token: "YOUR_LB_TOKEN", // optional: persistent token for authenticated requests
});

// Now playing
const np = await lb.getPlayingNow("myusername");
if (np.payload.count > 0) {
  const track = np.payload.listens[0]!.track_metadata;
  console.log(`${track.artist_name} — ${track.track_name}`);
}

// Submit a scrobble
const result = await lb.submitListen(
  "YOUR_LB_TOKEN",
  createListen({
    artistName: "Daft Punk",
    trackName: "One More Time",
    releaseName: "Discovery",
    listenedAt: Math.floor(Date.now() / 1000),
  }),
);

// Update now-playing (does not count as a scrobble)
await lb.submitNowPlaying("YOUR_LB_TOKEN", createNowPlaying({ artistName: "Daft Punk", trackName: "One More Time" }));
```

## Client options

```ts
new ListenBrainzClient({
  baseUrl?: string,  // default: https://api.listenbrainz.org
  token?: string,    // persistent token used when a method takes none explicitly
  userAgent?: string // User-Agent sent with every request (ListenBrainz policy)
});
```

## API reference

All methods return typed promises and throw `ListenBrainzError` on failure.

### Service & info

| Method | Returns | Notes |
| --- | --- | --- |
| `getServiceStatus()` | `ServiceStatus` | Current service status |
| `isHealthy()` | `boolean` | Fast health probe |
| `validateToken(token)` | `ValidateTokenResponse` | Returns the owning username |

### Listens & activity

| Method | Returns | Notes |
| --- | --- | --- |
| `getListens(user, opts?)` | `ListensResponse` | Paginated listens; `ListensQueryOptions { count?, minTs?, maxTs?, musicBrainzMetadata? }` |
| `getPlayingNow(user)` | `PlayingNowResponse` | Current track, if any |
| `getFeed(user, opts?)` | `FeedResponse` | Activity feed; `{ count?, maxTs? }` |
| `getListenCount(user)` | `number` | Total listen count |
| `getLatestImport(user)` | `LatestImportResponse` | Last import timestamp |
| `getLatestActivity(user, opts?)` | `LatestActivityResponse` | `{ previousTs? }` |

### Stats

| Method | Returns | Notes |
| --- | --- | --- |
| `getArtistStats(user, opts?)` / `getAlbumStats` / `getReleaseStats` / `getTrackStats` / `getRecordingStats` / `getTagStats` | `StatsResponse` | Per-entity stats; `StatsQueryOptions { range?, count?, offset? }` |
| `getStats(user, entity, opts?)` | `StatsResponse` | Generic stats by `StatsEntity` |
| `getSitewideStats(entity, opts?)` | `SitewideStatsResponse` | All-users stats |
| `getSimilarUsers(user, opts?)` | `SimilarUsersResponse` | Taste-matching users |
| `getListeningActivity(user, opts?)` | `ListeningActivityResponse` | Daily/weekly/monthly buckets |
| `getArtistCount(user)` / `getReleaseCount(user)` | `number` | Catalog size counters |

### Scrobbling

| Method | Returns | Notes |
| --- | --- | --- |
| `submitListen(token, payload)` | `SubmitListenResponse` | Submit a single scrobble |
| `submitNowPlaying(token, payload)` | `SubmitListenResponse` | Update now-playing only |
| `submitImport(token, listens[])` | `SubmitListenResponse` | Bulk-import many scrobbles |
| `deleteListen(token, { listenedAt, recordingMsid })` | `{ status: "ok" }` | Delete a specific listen |

See [Scrobble payload builders](#scrobble-payload-builders) for constructing `payload`.

### Pins & feedback

| Method | Returns | Notes |
| --- | --- | --- |
| `pin(token, { recordingMsid, blurb? })` | `PinResponse` | Pin a recording |
| `unpin(token)` | `PinResponse` | Unpin current recording |
| `getUserPins(user, opts?)` | `UserPinsResponse` | `{ count?, offset? }` |
| `submitFeedback(token, { recordingMsid, score })` | `{ status: "ok" }` | `score`: `1` love, `-1` hate, `0` remove |
| `deleteFeedback(token, { recordingMsid })` | `{ status: "ok" }` | Remove feedback |
| `getFeedback(user, opts?)` | `FeedbackResponse` | `{ recordingMsid?, count?, offset? }` |

### Explore & recommendations

| Method | Returns | Notes |
| --- | --- | --- |
| `getPopularArtists(count?)` / `getPopularRecordings` / `getPopularReleases` / `getPopularReleaseGroups` | `*Response` | Trending entities |
| `getFreshReleases(days?)` | `FreshReleasesResponse` | Recently released albums (`days` defaults to 30) |
| `getRecommendedRecordings(user, opts?)` | `RecommendationResponse` | `{ count? }` |
| `getRecommendationStatus(user)` | `RecommendationStatusResponse` | Engine status for a user |

### MusicBrainz metadata (via ListenBrainz)

| Method | Returns | Notes |
| --- | --- | --- |
| `getRecordingMetadata(mbid)` | `RecordingMetadata` | Artist credits, tags, genres |
| `getArtistMetadata(mbid)` | `ArtistMetadata` | |
| `getAlbumMetadata(mbid)` | `AlbumMetadata` | |
| `getReleaseGroupMetadata(mbid)` | `ReleaseGroupMetadata` | |
| `lookupTrackMetadata({ artistName, recordingName, releaseName?, durationMs? })` | `TrackMetadataLookupResult` | Best-effort metadata match for a track |

## Scrobble payload builders

Use the exported helpers instead of hand-rolling payloads:

```ts
import { createListen, createNowPlaying } from "listenbrainz-api";

const metadata = createTrackMetadata({
  artistName: "Daft Punk",
  trackName: "One More Time",
  releaseName: "Discovery",
  durationMs: 5 * 60 * 1000,      // recommended for matching
  recordingMbid: "…",             // optional, improves match accuracy
  releaseMbid: "…",
  trackMbid: "…",
  artistMbids: ["…"],
  tags: ["electronic"],
  mediaPlayer: "MyApp",           // default: "BrainzBot"
  submissionClient: "MyApp",
  submissionClientVersion: "1.0.0",
  spotifyId: "…",                 // optional enrichment
  youtubeId: "…",
});

await lb.submitListen("TOKEN", createListen({ ...metadata, listenedAt: Math.floor(Date.now() / 1000) }));
await lb.submitNowPlaying("TOKEN", createNowPlaying(metadata));
```

`createListen` requires `listenedAt` (a unix timestamp in **seconds**). `createNowPlaying` omits it — now-playing updates are never counted as scrobbles.

## Auth model

- **Public endpoints** (stats, listens, explore, feedback reads…) require no token.
- **Write/private endpoints** (`submitListen`, `pin`, `submitFeedback`, `deleteListen`, …) take the token explicitly as the first argument. Pass the same token in the client constructor to avoid repeating it.
- The token is only ever sent via the `Authorization: Token <token>` header — never in URLs or query strings.

## Error handling

All failures throw `ListenBrainzError`:

```ts
import { ListenBrainzError, ListenBrainzTimeoutError, ListenBrainzParseError } from "listenbrainz-api";

try {
  await lb.getListens("myusername");
} catch (err) {
  if (ListenBrainzError.isInstance(err)) {
    console.log(err.status, err.message); // status: 0 for network/timeout failures
    console.log(err.path, err.method, err.body);
    console.log(err.isRateLimit);         // true when the API asked us to slow down
  }
}
```

- `status` — HTTP status code, or `0` for network-level failures
- `path` / `method` — the failed request
- `body` — parsed response body, when the API returned one
- `isRateLimit` — `true` on `429`

`ListenBrainzTimeoutError` and `ListenBrainzParseError` subclass it for precise handling. Guard with the `ListenBrainzError.isInstance` helper to avoid importing error classes into your type-level graph.

## Timeouts & retries

- Every request times out after **15 s** (configurable in the HTTP layer) and throws `ListenBrainzTimeoutError`.
- `429` and `5xx` responses are retried up to **2 times** with exponential backoff (`250 ms · 2^n`), honouring the `Retry-After` header on `429`.

## MusicBrainz client

ListenBrainz removed its `/1/search/*` API in December 2025 (anti-scraper measures). Use the bundled `MusicBrainzClient` for all entity search and lookup instead.

```ts
import { MusicBrainzClient } from "listenbrainz-api";

const mb = new MusicBrainzClient({
  userAgent: "MyApp/1.0 (https://example.com)", // required by MB etiquette
});

const results = await mb.searchArtist("daft punk", 5);
const album = await mb.lookupRelease("26e56f3f-c82a-4c35-9f4b-6b7a4f0f2b99");

const tags = await mb.getArtistTopTags("56b4e2f8-2b9e-4a7d-b4a2-8d5f0e7e2f0e", 5);
```

| Method | Returns |
| --- | --- |
| `lookupArtist(mbid)` | `MbArtist` |
| `lookupArtistTags(mbid)` | `MbArtistTagsResponse` |
| `lookupRecording(mbid)` | `MbRecording` |
| `lookupReleaseGroup(mbid)` | `MbReleaseGroup` |
| `lookupRelease(mbid)` | `MbRelease` |
| `searchArtist(query, limit?)` | `MbArtist[]` |
| `searchRecording(query, limit?)` | `MbRecording[]` |
| `searchRelease(query, limit?)` | `MbRelease[]` |
| `searchReleaseGroup(query, limit?)` | `MbReleaseGroup[]` |
| `getArtistTopTags(mbid, limit?)` | `MbTagName[]` |

All MusicBrainz calls share a single ~1 req/s throttle, as required by [MusicBrainz API etiquette](https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting).

## License

[GPL-3.0-only](LICENSE)

## Development

```sh
bun install
bun run typecheck   # strict TS
bun test            # unit tests against a local HTTP mock
bun run build       # unbundled ESM + .d.ts into dist/
bun run lint        # biome lint + import sorting
```
