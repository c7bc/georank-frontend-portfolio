// A callback can remember a local route. Only the configured dashboard may use another origin.
const CALLBACK_ORIGIN = "https://georank.invalid";

export function resolveLoginDestination(callback: string | null, dashboard: string): string {
  if (!callback?.startsWith("/") || callback.startsWith("//") || /[\\\s\u0000-\u001f\u007f]/u.test(callback)) {
    return dashboard;
  }

  const destination = new URL(callback, CALLBACK_ORIGIN);
  if (
    destination.origin !== CALLBACK_ORIGIN ||
    destination.pathname.startsWith("//") ||
    (["/", "/dashboard"].includes(destination.pathname) && !destination.search && !destination.hash)
  ) {
    return dashboard;
  }

  return `${destination.pathname}${destination.search}${destination.hash}`;
}
