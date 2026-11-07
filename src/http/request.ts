import type { HttpRequestOptions } from "../http.js";

type Query = HttpRequestOptions["query"];

export function createRequestUrl(baseUrl: string, path: string, query?: Query): URL {
  const url = new URL(`${baseUrl}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  return url;
}

export function createRequestHeaders(
  userAgent: string,
  defaultToken: string | undefined,
  opts: { token?: string; headers?: Record<string, string>; hasBody: boolean },
): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": userAgent,
    Accept: "application/json",
    ...opts.headers,
  };
  const token = opts.token ?? defaultToken;
  if (token) headers.Authorization = `Token ${token}`;
  if (opts.hasBody) headers["Content-Type"] = "application/json";
  return headers;
}
