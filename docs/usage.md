# Getting started and shared behavior

## Create a client

```ts
import { ListenBrainzClient } from "listenbrainz-api";

const lb = new ListenBrainzClient({
  userAgent: "BrainzBot/1.0 (https://github.com/ListenBrainzBot/ListenBrainzBot)",
  token: process.env.LISTENBRAINZ_TOKEN,
});
```

`baseUrl` can point at a compatible proxy or a local test server. `token` is
optional and becomes the default `Authorization: Token ...` value; methods
that write data also take an explicit token so the account being modified is
visible at each call site. Do not log or put tokens in URLs.

ListenBrainz requires HTTPS, a useful User-Agent, and responsible API usage.
Honor `429` responses and the published rate limits; the default HTTP client
retries `429` and `5xx` twice, using `Retry-After` when supplied.

## Errors and custom routes

```ts
import { ListenBrainzError } from "listenbrainz-api";

try {
  const result = await lb.getListens("username", { count: 10 });
} catch (error) {
  if (!ListenBrainzError.isInstance(error)) throw error;
  console.error(error.status, error.method, error.path, error.message);
}
```

Network errors use status `0`; API errors include their HTTP status and parsed
body. A timeout raises `ListenBrainzTimeoutError`. `isHealthy()` is the
exception: it intentionally converts a failed service-status request to
`false`.

Use the generic method for a route without a convenience wrapper. `path` is
appended to the configured ListenBrainz base URL; query values that are
`undefined` or `null` are omitted.

```ts
const result = await lb.request<{ payload: { count: number } }>({
  path: `/1/user/${encodeURIComponent("user name")}/listen-count`,
  method: "GET",
  query: { extra_info: 1 },
});
```

The [route index](api/index.md) lists the API surface. For method signatures
and response fields, see [account](account.md), [listens](listens.md),
[stats](stats.md), [writes](writes.md), and [discovery](discovery.md).
