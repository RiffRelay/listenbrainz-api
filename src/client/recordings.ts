import type {
  FeedbackResponse,
  FeedbackScore,
  PinResponse,
  UserPinsResponse,
} from "../types.js";
import { SubmissionClient } from "./submission.js";

export class RecordingClient extends SubmissionClient {
  pin(token: string, opts: { recordingMsid: string; blurb?: string }): Promise<PinResponse> {
    return this.http.request({
      method: "POST",
      path: "/1/pin",
      token,
      body: { recording_msid: opts.recordingMsid, blurb: opts.blurb },
    });
  }
  unpin(token: string): Promise<PinResponse> {
    return this.http.request({ method: "POST", path: "/1/unpin", token });
  }
  getUserPins(user: string, opts: { count?: number; offset?: number } = {}): Promise<UserPinsResponse> {
    return this.http.request({
      path: `/1/user/${encodeURIComponent(user)}/pins`,
      query: { count: opts.count, offset: opts.offset },
    });
  }
  submitFeedback(
    token: string,
    opts: { recordingMsid: string; score: FeedbackScore },
  ): Promise<{ status: "ok" }> {
    return this.http.request({
      method: "POST",
      path: "/1/feedback/recording-feedback",
      token,
      body: { recording_msid: opts.recordingMsid, score: opts.score },
    });
  }
  deleteFeedback(token: string, opts: { recordingMsid: string }): Promise<{ status: "ok" }> {
    return this.http.request({
      method: "POST",
      path: "/1/feedback/recording-feedback",
      token,
      body: { recording_msid: opts.recordingMsid, score: 0 },
    });
  }
  getFeedback(
    user: string,
    opts: { score?: FeedbackScore; count?: number; offset?: number; metadata?: boolean } = {},
  ): Promise<FeedbackResponse> {
    return this.http.request({
      path: `/1/feedback/user/${encodeURIComponent(user)}/get-feedback`,
      query: {
        score: opts.score,
        count: opts.count,
        offset: opts.offset,
        metadata: opts.metadata,
      },
    });
  }
}
