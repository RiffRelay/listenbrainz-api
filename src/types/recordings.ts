import type { FeedbackScore, TrackMetadata } from "./common.js";

export interface DeleteListenResponse {
  status: "ok";
}
export interface SubmitListenResponse {
  status: "ok" | "failed";
  count: number;
  error?: string;
}
export interface Pin {
  pinned_recording_id: number;
  blurb?: string;
  created: number;
  pinned_until?: number | null;
  recording_mbid?: string;
  recording_msid: string;
  track_metadata: TrackMetadata;
  user_name: string;
}
export interface UserPinsResponse {
  payload: { count: number; pins: Pin[] };
}
export interface PinResponse {
  status: "ok";
}
export interface FeedbackItem {
  recording_msid: string;
  score: FeedbackScore;
  user_id: string;
  created?: number;
  recording_mbid?: string;
}
export interface FeedbackResponse {
  count: number;
  offset: number;
  total_count: number;
  feedback: FeedbackItem[];
}
