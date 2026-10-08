// Next's local server may normalize 127.0.0.1 to localhost in NextRequest.
// Only these loopback aliases are equivalent, only in development, at the same port.
export function allowedOrigin(
  origin: string | null,
  requestOrigin: string,
  configuredOrigin?: string,
  development = false,
) {
  if (!origin) return false;
  try {
    const actual = new URL(origin);
    const expected = new URL(configuredOrigin || requestOrigin);
    if (actual.origin === expected.origin) return true;
    const loopback = new Set(["localhost", "127.0.0.1", "[::1]"]);
    return (
      development &&
      loopback.has(actual.hostname) &&
      loopback.has(expected.hostname) &&
      actual.protocol === expected.protocol &&
      actual.port === expected.port
    );
  } catch {
    return false;
  }
}
