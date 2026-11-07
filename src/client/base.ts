import { HttpClient, type HttpRequestOptions } from "../http.js";
import { LISTENBRAINZ_API_BASE } from "../types.js";
import type { ListenBrainzClientOptions } from "./options.js";

export class ClientBase {
  protected readonly http: HttpClient;
  protected readonly baseUrl: string;

  constructor(opts: ListenBrainzClientOptions = {}) {
    this.baseUrl = (opts.baseUrl ?? LISTENBRAINZ_API_BASE).replace(/\/$/, "");
    this.http = new HttpClient(
      this.baseUrl,
      opts.userAgent ?? "listenbrainz-api/0.2.1 (https://github.com/RiffRelay/listenbrainz-api)",
      opts.token,
    );
  }

  /** Escape hatch for documented endpoints not wrapped by a convenience method. */
  request<T>(options: HttpRequestOptions): Promise<T> {
    return this.http.request<T>(options);
  }
}
