export interface ArtistCredit {
  artist_mbid?: string;
  artist_credit_name: string;
  join_phrase?: string;
}
export interface RecordingMetadata {
  id: string;
  title: string;
  artist_credit: ArtistCredit[];
  release_date?: string;
  release_group_mbid?: string;
  artist_mbids?: string[];
  length?: number;
  caa_id?: number;
  caa_release_mbid?: string;
  first_release_date?: string;
  [key: string]: unknown;
}
export interface ArtistMetadata {
  id: string;
  name: string;
  artist_credit?: ArtistCredit[];
  type?: string;
  country?: string;
  caa_release_mbid?: string;
  [key: string]: unknown;
}
export interface AlbumMetadata {
  id: string;
  title: string;
  artist_credit: ArtistCredit[];
  release_date?: string;
  release_group_mbid?: string;
  artist_mbids?: string[];
  caa_id?: number;
  caa_release_mbid?: string;
  length?: number;
  tracks?: RecordingMetadata[];
  [key: string]: unknown;
}
export interface ReleaseGroupMetadata {
  id: string;
  title: string;
  artist_credit: ArtistCredit[];
  release_date?: string;
  artist_mbids?: string[];
  caa_id?: number;
  caa_release_mbid?: string;
  length?: number;
  first_release_date?: string;
  [key: string]: unknown;
}
