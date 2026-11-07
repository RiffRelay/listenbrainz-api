import type { DeleteListenResponse, ListenType, SubmitListenResponse, TrackMetadata } from "../types.js";
import type { SubmitPayload } from "./options.js";
import { StatsClient } from "./stats.js";

export class SubmissionClient extends StatsClient {
  submitListen(token: string, payload: SubmitPayload): Promise<SubmitListenResponse> {
    return this.submit(token, "single", [payload]);
  }
  submitNowPlaying(token: string, metadata: TrackMetadata): Promise<SubmitListenResponse> {
    return this.submit(token, "playing_now", [{ trackMetadata: metadata }]);
  }
  submitImport(token: string, listens: SubmitPayload[]): Promise<SubmitListenResponse> {
    return this.submit(token, "import", listens);
  }
  private submit(token: string, type: ListenType, listens: SubmitPayload[]) {
    return this.http.request<SubmitListenResponse>({
      method: "POST",
      path: "/1/submit-listens",
      token,
      body: {
        listen_type: type,
        payload: listens.map(({ listenedAt, trackMetadata }) => ({
          ...(listenedAt !== undefined ? { listened_at: listenedAt } : {}),
          track_metadata: trackMetadata,
        })),
      },
    });
  }
  deleteListen(
    token: string,
    opts: { listenedAt: number; recordingMsid: string },
  ): Promise<DeleteListenResponse> {
    return this.http.request({
      method: "POST",
      path: "/1/delete-listen",
      token,
      body: { listened_at: opts.listenedAt, recording_msid: opts.recordingMsid },
    });
  }
}
