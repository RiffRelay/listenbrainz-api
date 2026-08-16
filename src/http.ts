import { ListenBrainzError, ListenBrainzTimeoutError } from "./errors.js";

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

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function delayForRetry(status: number, retryAfter: string | null, attempt: number): number {
  if (status === 429 && retryAfter) {
    const seconds = Number.parseInt(retryAfter, 10);
    if (Number.isFinite(seconds)) return seconds * 1000;
  }
  return 250 * 2 ** attempt;
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

    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const requestHeaders: Record<string, string> = {
      "User-Agent": this.userAgent,
      Accept: "application/json",
      ...headers,
    };
    const authToken = token ?? this.defaultToken;
    if (authToken) requestHeaders.Authorization = `Token ${authToken}`;
    if (body !== undefined) requestHeaders["Content-Type"] = "application/json";

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
        await sleep(delayForRetry(response.status, response.headers.get("retry-after"), attempt));
        attempt += 1;
        continue;
      }

      const raw = await response.text();
      let json: unknown = null;
      if (raw.length > 0) {
        try {
          json = JSON.parse(raw);
        } catch {
          // Non-JSON body (HTML error page etc.)
          json = null;
        }
      }

      if (!response.ok) {
        const apiMessage =
          json && typeof json === "object" && "message" in json && typeof json.message === "string"
            ? json.message
            : response.statusText;
        throw new ListenBrainzError({
          status: response.status,
          message: apiMessage || `HTTP ${response.status}`,
          path,
          method,
          body: json,
        });
      }

      return json as T;
    }
  }
}
