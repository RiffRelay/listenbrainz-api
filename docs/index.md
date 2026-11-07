# listenbrainz-api

A typed, zero-runtime-dependency TypeScript client for ListenBrainz, with a
MusicBrainz companion client for searches and entity lookups.

## Start here

```sh
npm install listenbrainz-api
```

```ts
import { ListenBrainzClient } from "listenbrainz-api";

const lb = new ListenBrainzClient({
  userAgent: "MyApp/1.0 (https://example.com)",
});
const recent = await lb.getListens("username", { count: 10 });
```

- [Account setup, tokens, and service status](account.md)
- [Recent listens, now playing, and activity](listens.md)
- [Personal and sitewide statistics](stats.md)
- [Scrobbling, feedback, pins, and deletion](writes.md)
- [Metadata, discovery, and recommendations](discovery.md)
- [MusicBrainz search and lookups](musicbrainz.md)
- [Authentication, errors, and raw requests](usage.md)
- [ListenBrainz route reference](api/index.md)

The source API changes over time. Use the official
[ListenBrainz API reference](https://listenbrainz.readthedocs.io/en/latest/users/api/index.html)
for endpoint availability, required parameters, and authorization rules.
