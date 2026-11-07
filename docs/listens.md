# Reading listens and user activity

All ListenBrainz usernames are URL-encoded by the convenience methods. The
returned data is under `response.payload`.

## Recent listens

```ts
const response = await lb.getListens("username", {
  count: 20,
  maxTs: Math.floor(Date.now() / 1000),
  musicBrainzMetadata: true,
});

for (const listen of response.payload.listens) {
  const track = listen.track_metadata;
  console.log(track.artist_name, track.track_name, listen.listened_at);
}
```

`count` controls page size. Use either `maxTs` (older than that timestamp) or
`minTs` (newer than that timestamp), not both. Timestamps are Unix seconds.
`musicBrainzMetadata` requests enrichment from ListenBrainz; fields such as
recording MBIDs can still be absent when a match is unavailable. Use the
export endpoints for full-history downloads instead of paging this endpoint.

## Now playing, feed and activity

`getPlayingNow(user)` returns `{ payload: { count, listens } }`. `count` is
zero when nothing is playing; a now-playing item does not have `listened_at`.
`getFeed(user, { count, maxTs })` reads the user's activity feed, including
recording and pin events.

`getListenCount(user)` returns a number directly. `getLatestImport(user)`
returns `payload.latest_import` (or `null`). `getLatestActivity(user,
{ previousTs })` returns the latest activity timestamp. For time buckets,
`getListeningActivity(user, { fromTs, toTs })` returns `payload`, an array of
`{ from_ts, to_ts, time_range, listen_count }`.

```ts
const now = await lb.getPlayingNow("username");
const current = now.payload.listens[0];
if (current) {
  console.log(`${current.track_metadata.artist_name} — ${current.track_metadata.track_name}`);
}
```

## Related users

`getSimilarUsers(user, { count })` returns `payload.similar_users`; each entry
has `user_name` and a `similarity` fraction from `0` to `1`. Multiply by 100
for a displayed percentage.
