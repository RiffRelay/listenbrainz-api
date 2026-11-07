# Statistics routes

- `/1/stats/user/{user_name}/artists`
- `/1/stats/user/{user_name}/releases`
- `/1/stats/user/{user_name}/release-groups`
- `/1/stats/user/{user_name}/recordings`
- `/1/stats/user/{user_name}/listening-activity`
- `/1/stats/user/{user_name}/daily-activity`
- `/1/stats/user/{user_name}/artist-map`
- `/1/stats/artist/{artist_mbid}/listeners`
- `/1/stats/release-group/{release_group_mbid}/listeners`
- `/1/stats/sitewide/artists`
- `/1/stats/sitewide/releases`
- `/1/stats/sitewide/release-groups`
- `/1/stats/sitewide/recordings`
- `/1/stats/sitewide/listening-activity`
- `/1/stats/sitewide/artist-map`
- `/1/stats/user/{user_name}/year-in-music/{year}`

For all user-history exports use the export routes, not unbounded pagination of
the recent-listens endpoint.
