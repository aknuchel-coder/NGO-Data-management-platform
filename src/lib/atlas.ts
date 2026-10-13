export function rotationFromProgress(progress: number): number {
  return Math.max(0, Math.min(1, progress)) * 360;
}

export function scrollProgress(
  top: number,
  height: number,
  viewport: number,
): number {
  return Math.max(0, Math.min(1, -top / Math.max(1, height - viewport)));
}

export function visibleOnGlobe(
  longitude: number,
  latitude: number,
  center: number,
  tilt = 12,
): boolean {
  const r = Math.PI / 180;
  return (
    Math.sin(tilt * r) * Math.sin(latitude * r) +
      Math.cos(tilt * r) *
        Math.cos(latitude * r) *
        Math.cos((longitude - center) * r) >
    0
  );
}

export function powerBiEmbedUrl(value: string): string | null {
  if (!value.trim()) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "app.powerbi.com" ||
      url.username ||
      url.password
    )
      return null;
    if (!["/view", "/reportEmbed"].includes(url.pathname)) return null;
    if (url.pathname === "/view" && !url.searchParams.get("r")) return null;
    if (url.pathname === "/reportEmbed" && !url.searchParams.get("reportId"))
      return null;
    return url.href;
  } catch {
    return null;
  }
}
