/**
 * Tiny, dependency-free User-Agent parser. We only need coarse buckets for the
 * analytics dashboard (which browser / OS / form-factor), not exhaustive
 * version detection, so a handful of ordered checks is plenty — and it keeps
 * the bundle lean and works the same on the server where UA strings are read.
 */

export type DeviceKind = "mobile" | "tablet" | "desktop";

export interface UaInfo {
  os?: string;
  browser?: string;
  device?: DeviceKind;
}

export function parseUserAgent(ua: string): UaInfo {
  if (!ua) return {};
  return { os: detectOs(ua), browser: detectBrowser(ua), device: detectDevice(ua) };
}

function detectBrowser(ua: string): string | undefined {
  // Order matters: Chrome's UA also contains "Safari", Edge contains "Chrome",
  // so the more specific brands must be matched first.
  if (/\bEdg(A|iOS|OS)?\//.test(ua)) return "Edge";
  if (/\b(OPR|Opera)\b/.test(ua)) return "Opera";
  if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
  if (/\bUCBrowser\b/.test(ua)) return "UC Browser";
  if (/\bFirefox\/|\bFxiOS\//.test(ua)) return "Firefox";
  if (/\bCriOS\//.test(ua)) return "Chrome";
  if (/\bChrome\//.test(ua)) return "Chrome";
  if (/\bSafari\//.test(ua) && /\bVersion\//.test(ua)) return "Safari";
  return undefined;
}

function detectOs(ua: string): string | undefined {
  if (/Windows NT/.test(ua)) return "Windows";
  if (/\b(iPhone|iPad|iPod)\b/.test(ua)) return "iOS";
  if (/\bAndroid\b/.test(ua)) return "Android";
  if (/\bCrOS\b/.test(ua)) return "ChromeOS";
  if (/Mac OS X|Macintosh/.test(ua)) return "macOS";
  if (/\bLinux\b/.test(ua)) return "Linux";
  return undefined;
}

function detectDevice(ua: string): DeviceKind {
  if (/\biPad\b/.test(ua)) return "tablet";
  if (/\bAndroid\b/.test(ua) && !/\bMobile\b/.test(ua)) return "tablet";
  if (/\bTablet\b/.test(ua)) return "tablet";
  if (/\bMobi|iPhone|iPod|Android\b/.test(ua)) return "mobile";
  return "desktop";
}
