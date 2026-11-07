export interface MbTag {
  count: number;
  name: string;
}
export interface MbArtist {
  id: string;
  name: string;
  "sort-name"?: string;
  country?: string;
  type?: string;
  tags?: MbTag[];
  genres?: MbTag[];
  disambiguation?: string;
  [key: string]: unknown;
}
export interface MbRecording {
  id: string;
  title: string;
  length?: number;
  "artist-credit"?: Array<{ name: string; artist?: MbArtist }>;
  "first-release-date"?: string;
  releases?: Array<{ id: string; title: string; date?: string; [key: string]: unknown }>;
  [key: string]: unknown;
}
export interface MbReleaseGroup {
  id: string;
  title: string;
  "first-release-date"?: string;
  "primary-type"?: string;
  [key: string]: unknown;
}
export interface MbRelease {
  id: string;
  title: string;
  date?: string;
  country?: string;
  status?: string;
  "artist-credit"?: Array<{ name: string; artist?: MbArtist }>;
  "release-group"?: {
    id: string;
    title: string;
    "primary-type"?: string;
    "first-release-date"?: string;
  };
  media?: Array<{
    position?: number;
    format?: string;
    track_count?: number;
    tracks?: Array<{ id?: string; position?: number; number?: string; title?: string; length?: number }>;
  }>;
  [key: string]: unknown;
}
export interface MbSearchResponse {
  created?: string;
  count: number;
  offset: number;
  artists?: MbArtist[];
  recordings?: MbRecording[];
  releases?: MbRelease[];
  "release-groups"?: MbReleaseGroup[];
  tags?: Array<{ name: string }>;
  [key: string]: unknown;
}
export interface MbArtistTagsResponse {
  id: string;
  name: string;
  tags?: MbTag[];
  genres?: MbTag[];
  [key: string]: unknown;
}
