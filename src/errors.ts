export interface ListenBrainzErrorInit {
  status: number;
  message: string;
  path?: string;
  method?: string;
  body?: unknown;
}

export class ListenBrainzError extends Error {
  /** HTTP status code, or `0` for network-level failures. */
  readonly status: number;
  /** Request path that failed, e.g. `/1/user/alice/listens`. */
  readonly path?: string;
  /** HTTP method that failed, e.g. `GET` or `POST`. */
  readonly method?: string;
  /** Parsed response body (if the API returned one). */
  readonly body?: unknown;
  /** Whether the API is asking us to slow down. */
  readonly isRateLimit: boolean;

  constructor(init: ListenBrainzErrorInit) {
    super(init.message);
    this.name = "ListenBrainzError";
    this.status = init.status;
    this.path = init.path;
    this.method = init.method;
    this.body = init.body;
    this.isRateLimit = init.status === 429;
  }

  /** Convenience guard for `catch` blocks. */
  static isInstance(err: unknown): err is ListenBrainzError {
    return err instanceof ListenBrainzError;
  }
}

/** Thrown when the HTTP layer times out. */
export class ListenBrainzTimeoutError extends ListenBrainzError {
  constructor(message = "Request timed out", path?: string, method?: string) {
    super({ status: 0, message, path, method });
    this.name = "ListenBrainzTimeoutError";
  }
}

/** Thrown when a response body could not be decoded as JSON. */
export class ListenBrainzParseError extends ListenBrainzError {
  constructor(message: string, path?: string, body?: unknown) {
    super({ status: 0, message, path, body });
    this.name = "ListenBrainzParseError";
  }
}
