# Account and service status

## Validate a token

`validateToken(token)` checks the supplied user token and returns
`{ valid, user_name?, code, message }`. The client sends the token in the
Authorization header; it does not put credentials in the query string.

```ts
const result = await lb.validateToken(candidate);
if (!result.valid) throw new Error("ListenBrainz token is invalid");
console.log(`Connected as ${result.user_name}`);
```

In the bot, token validation happens before the token is encrypted and saved.
Keep that order in account-linking flows: reject invalid credentials, then
persist them securely. Never echo a submitted token in an error or log.

## Service health

`getServiceStatus()` returns service metrics including `time`, `dump_age`,
`incoming_listen_count`, and stats refresh ages. Individual stats may have
`age: null` while a job is running. `isHealthy()` performs the same status
request and returns `false` on request errors; use `getServiceStatus()` when
you need the details or want to report the failure.

```ts
const status = await lb.getServiceStatus();
console.log(status.incoming_listen_count, status.stats_age);
if (!(await lb.isHealthy())) console.error("ListenBrainz is unavailable");
```

The package also provides `lbUserUrl`, `lbSettingsUrl`, `lbHomeUrl`,
`mbArtistUrl`, `mbRecordingUrl`, `mbReleaseUrl`, and `coverArtUrl` to generate
canonical web links. They return URLs, not fetched data.
