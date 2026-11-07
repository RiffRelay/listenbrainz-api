# Personal and sitewide statistics

Stats calls return a `StatsResponse` whose `payload` contains paging and time
metadata plus an entity-specific array. Select the corresponding property
(`artists`, `albums`, `releases`, `tracks`, `recordings`, or `tags`).

```ts
const response = await lb.getArtistStats("username", {
  range: "all_time",
  count: 10,
  offset: 0,
});
const artists = response.payload.artists as
  | Array<{ artist_name: string; listen_count: number }>
  | undefined;
```

Convenience methods are `getArtistStats`, `getAlbumStats`, `getReleaseStats`,
`getTrackStats`, `getRecordingStats`, and `getTagStats`. `getStats(user,
entity, options)` accepts a `StatsEntity` (`artists`, `albums`, `releases`,
`tracks`, `recordings`, or `tags`) when the entity is selected dynamically.
Options use `range`, `count`, and `offset`.

Supported `StatsRange` values are `today`, `yesterday`, `this_week`,
`this_month`, `this_year`, `week`, `month`, `year`, and `all_time`.
`payload.total_count`, `payload.from_ts`, `payload.to_ts`, `payload.offset`,
`payload.range`, and `payload.last_updated` describe the result. Stat rows can
have optional MBIDs and cover-art identifiers; do not assume they exist.

```ts
const totalListens = await lb.getListenCount("username");
const distinctArtists = await lb.getArtistCount("username");
const distinctReleases = await lb.getReleaseCount("username");
const sitewide = await lb.getSitewideStats("artists", { range: "week", count: 5 });
```

`getArtistCount` and `getReleaseCount` read the all-time totals from stats.
They are distinct catalog counts, not listen counts. Use `getSitewideStats`
for global rankings; its options and payload follow the user stats shape.

## Taste comparison pattern

The bot fetches each user's all-time artist list and compares artist MBIDs or
normalized names. Request enough rows to make the comparison meaningful, and
remember that missing MBIDs make name matching approximate.

```ts
const mine = await lb.getArtistStats("me", { range: "all_time", count: 100 });
const theirs = await lb.getArtistStats("friend", { range: "all_time", count: 100 });
const mineTop = mine.payload.artists;
const friendTop = theirs.payload.artists;
```

The stats payload is intentionally flexible because each endpoint's row type
differs and the service may add fields.
