/** Last path segment when it looks like a Solana mint address. */
export function mintFromPathname(pathname: string): string | null {
  const segment = pathname.split("/").filter(Boolean).pop();
  if (!segment || segment === "trade") return null;
  if (segment.length < 32 || segment.length > 64) return null;
  return segment;
}

export function looksLikeMint(value: string): boolean {
  const s = value.trim();
  return s.length >= 32 && s.length <= 64 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(s);
}
