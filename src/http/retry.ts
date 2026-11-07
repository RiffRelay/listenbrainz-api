export function delayForRetry(status: number, retryAfter: string | null, attempt: number): number {
  if (status === 429 && retryAfter) {
    const seconds = Number.parseInt(retryAfter, 10);
    if (Number.isFinite(seconds)) return seconds * 1000;
  }
  return 250 * 2 ** attempt;
}
