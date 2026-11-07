# Playlist routes

- `/1/user/{playlist_user_name}/playlists`
- `/1/user/{playlist_user_name}/playlists/collaborator`
- `/1/user/{playlist_user_name}/playlists/createdfor`
- `/1/playlist/create`
- `/1/playlist/search`
- `/1/playlist/edit/{playlist_mbid}`
- `/1/playlist/{playlist_mbid}`
- `/1/playlist/{playlist_mbid}/item/add/{offset}`
- `/1/playlist/{playlist_mbid}/item/move`
- `/1/playlist/{playlist_mbid}/item/delete`
- `/1/playlist/{playlist_mbid}/delete`
- `/1/playlist/{playlist_mbid}/copy`

Playlist bodies follow the JSPF format with MusicBrainz extensions. Check the
official docs for ownership and collaborator requirements before writing.
