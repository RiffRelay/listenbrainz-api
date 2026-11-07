# listenbrainz-api

A typed, zero-dependency ListenBrainz REST client for Node 18+, Bun, Deno and
other runtimes with `fetch`. Includes a rate-limited MusicBrainz client.

[Read the full documentation](https://listenbrainzbot.github.io/listenbrainz-api/docs).

```sh
npm install listenbrainz-api
```

```ts
import { ListenBrainzClient, createListen } from "listenbrainz-api";

const lb = new ListenBrainzClient({
  token: process.env.LISTENBRAINZ_TOKEN,
  userAgent: "MyApp/1.0 (https://example.com)",
});
const listens = await lb.getListens("username", { count: 10 });
await lb.submitListen(
  process.env.LISTENBRAINZ_TOKEN!,
  createListen({
    artistName: "Daft Punk",
    trackName: "One More Time",
    listenedAt: Math.floor(Date.now() / 1000),
  }),
);
```

`ListenBrainzClient` wraps commonly used listens, stats, submission, feedback,
metadata, explore and recommendation endpoints. Every other documented route
is available through `client.request<T>({ method, path, query, body, token })`.
See the [endpoint index](docs/api/index.md) and official
[ListenBrainz API documentation](https://listenbrainz.readthedocs.io/en/latest/users/api/index.html).

Requests include `Authorization: Token ...` when a token is configured, send a
descriptive User-Agent, retry rate-limited/server errors, and throw typed
`ListenBrainzError` exceptions. Tokens are never added to URLs.

Read the practical guides for [account setup](docs/account.md),
[listens](docs/listens.md), [stats](docs/stats.md), [writes](docs/writes.md),
[discovery](docs/discovery.md), and
[MusicBrainz](docs/musicbrainz.md). The [API guide](docs/usage.md) covers
authentication, errors, and raw requests.

```sh
bun install
bun run typecheck
bun test
bun run build
```

License: [GPL-3.0-only](LICENSE).
