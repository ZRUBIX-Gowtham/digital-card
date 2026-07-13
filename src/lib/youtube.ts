/**
 * Extract an 11-char YouTube video id from any common URL shape:
 * watch?v=, youtu.be/, /shorts/, /live/, /embed/, or a bare id.
 * Returns null if nothing valid is found.
 */
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
  ];

  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return m[1];
  }

  // Bare video id pasted on its own.
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;

  return null;
}
