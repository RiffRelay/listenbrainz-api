# ListenBrainz API route index

This route map is based on the community
[ListenBrainz OpenAPI description](https://github.com/rain0r/listenbrainz-openapi)
(version 2026-09-30) and cross-referenced against the
[official API reference](https://listenbrainz.readthedocs.io/en/latest/users/api/index.html).
The live API is authoritative; endpoint availability and schemas can change.

Every listed route is callable using `ListenBrainzClient.request<T>`. The
client's convenience methods wrap common routes. Use the route-category files
below for the documented surface; the generic request method is also useful
for undocumented or newly added routes.

- [Core and radio](core.md)
- [Statistics](statistics.md)
- [Playlists](playlists.md)
- [Recordings, feedback and pins](recordings.md)
- [Popularity and metadata](catalog.md)
- [Social](social.md)
- [Recommendations](recommendations.md)
- [Miscellaneous and exports](misc.md)
- [Art](art.md)

Authentication uses `Authorization: Token <user-token>` for protected routes.
Follow ListenBrainz' rate limits and provide a contactable User-Agent.

For runnable client examples, see the guides for [reading listens](../listens.md),
[stats](../stats.md), [writes](../writes.md), and
[metadata/discovery](../discovery.md). The route names are not a substitute
for each endpoint's current required parameters and authorization rules.
