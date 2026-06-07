export interface ParsedRepo {
  owner: string;
  repo: string;
}

const GITHUB_HOST = "github.com";

export function parseGithubUrl(input: string): ParsedRepo | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const shortMatch = /^([\w.-]+)\/([\w.-]+?)(?:\.git)?$/.exec(trimmed);
  if (shortMatch && !trimmed.includes("://") && !trimmed.includes("@")) {
    return { owner: shortMatch[1], repo: shortMatch[2] };
  }

  const candidate = trimmed.startsWith("git@")
    ? trimmed.replace("git@github.com:", "https://github.com/")
    : trimmed;

  try {
    const url = new URL(
      candidate.startsWith("http") ? candidate : `https://${candidate}`,
    );
    if (!url.hostname.endsWith(GITHUB_HOST)) return null;
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length < 2) return null;
    const owner = segments[0];
    const repo = segments[1].replace(/\.git$/, "");
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}