const LB = "https://listenbrainz.org";

/** User profile page. */
export const lbUserUrl = (user: string): string =>
  `${LB}/user/${encodeURIComponent(user)}`;

/** User settings / token page. */
export const lbSettingsUrl = (): string => `${LB}/settings/`;

/** ListenBrainz homepage. */
export const lbHomeUrl = (): string => LB;

const MB = "https://musicbrainz.org";

/** Artist page. */
export const mbArtistUrl = (mbid: string): string => `${MB}/artist/${mbid}`;

/** Recording page. */
export const mbRecordingUrl = (mbid: string): string => `${MB}/recording/${mbid}`;

/** Release page. */
export const mbReleaseUrl = (mbid: string): string => `${MB}/release/${mbid}`;

const CAA = "https://coverartarchive.org";

/** Front cover for a release. Falls back to `undefined` if no mbid. */
export const coverArtUrl = (mbid: string | undefined | null, size = 250): string | undefined =>
  mbid ? `${CAA}/release/${mbid}/front-${size}` : undefined;
