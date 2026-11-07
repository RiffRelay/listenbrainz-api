import { ListenBrainzError, ListenBrainzTimeoutError } from "./errors.js";
import { createRequestHeaders, createRequestUrl } from "./http/request.js";
import { decodeResponse } from "./http/response.js";
import { delayForRetry } from "./http/retry.js";

export interface HttpRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  /** Path appended to the base URL, e.g. `/1/user/alice/listens`. */
  path: string;
  /** Query parameters; `undefined`/`null` values are dropped. */
  query?: Record<string, string | number | boolean | undefined | null>;
  /** JSON body; sent with `Content-Type: application/json`. */
  body?: unknown;
  /** Token used for the `Authorization: Token <token>` header. */
  token?: string;
  /** Extra headers. */
  headers?: Record<string, string>;
  /** Number of retries for 429 / 5xx responses (default 2). */
  retries?: number;
  /** Per-attempt timeout in ms (default 15000). */
  timeoutMs?: number;
}

export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly userAgent: string,
    private readonly defaultToken?: string,
  ) {}

  async request<T>(opts: HttpRequestOptions): Promise<T> {
    const {
      method = "GET",
      path,
      query,
      body,
      token,
      headers,
      retries = 2,
      timeoutMs = 15_000,
    } = opts;

    const url = createRequestUrl(this.baseUrl, path, query);
    const requestHeaders = createRequestHeaders(this.userAgent, this.defaultToken, {
      token,
      headers,
      hasBody: body !== undefined,
    });

    let attempt = 0;
    while (true) {
      let response: Response;
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
          response = await fetch(url, {
            method,
            headers: requestHeaders,
            body: body !== undefined ? JSON.stringify(body) : undefined,
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          throw new ListenBrainzTimeoutError(
            `Request timed out after ${timeoutMs}ms`,
            path,
            method,
          );
        }
        throw new ListenBrainzError({
          status: 0,
          message: `Network error contacting ${url.host}: ${(err as Error).message}`,
          path,
          method,
        });
      }

      const shouldRetry = response.status === 429 || response.status >= 500;
      if (shouldRetry && attempt < retries) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, delayForRetry(response.status, response.headers.get("retry-after"), attempt)),
        );
        attempt += 1;
        continue;
      }

      return decodeResponse<T>(response, path, method);
    }
  }
}
