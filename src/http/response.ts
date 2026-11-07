import { ListenBrainzError } from "../errors.js";

export async function decodeResponse<T>(
  response: Response,
  path: string,
  method: string,
): Promise<T> {
  const raw = await response.text();
  let json: unknown = null;
  if (raw) {
    try {
      json = JSON.parse(raw);
    } catch {
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
