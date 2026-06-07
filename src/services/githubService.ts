import { parseGithubUrl } from "@/utils/githubParser";
import type { GithubRepoData } from "@/types";

const BASE_URL = import.meta.env.VITE_GITHUB_API_BASE_URL ?? "https://api.github.com";
const REQUEST_TIMEOUT_MS = 8000;

export class GithubError extends Error {
  readonly kind: "invalid-url" | "not-found" | "rate-limited" | "timeout" | "network";

  constructor(kind: GithubError["kind"], message: string) {
    super(message);
    this.kind = kind;
  }
}

interface RepoResponse {
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string | null;
  license: { name?: string | null; spdx_id?: string | null } | null;
  topics?: string[];
}

interface ReadmeResponse {
  name?: string;
}

interface WorkflowFile {
  type: string;
  name: string;
}

async function safeFetch(url: string, signal: AbortSignal): Promise<Response> {
  try {
    return await fetch(url, {
      signal,
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") {
      throw new GithubError("timeout", "GitHub request timed out");
    }
    throw new GithubError("network", "Network error while contacting GitHub");
  }
}

async function fetchJson<T>(path: string, signal: AbortSignal): Promise<T | null> {
  const response = await safeFetch(`${BASE_URL}${path}`, signal);
  if (response.status === 404) return null;
  if (response.status === 403 || response.status === 429) {
    throw new GithubError("rate-limited", "GitHub API rate limit reached");
  }
  if (!response.ok) {
    throw new GithubError("network", `GitHub returned ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchRepoData(input: string): Promise<GithubRepoData> {
  const parsed = parseGithubUrl(input);
  if (!parsed) {
    throw new GithubError("invalid-url", "Not a valid GitHub repository URL");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const repoPath = `/repos/${parsed.owner}/${parsed.repo}`;
    const repo = await fetchJson<RepoResponse>(repoPath, controller.signal);
    if (!repo) {
      throw new GithubError("not-found", "Repository not found");
    }

    const [readme, workflows] = await Promise.all([
      fetchJson<ReadmeResponse>(`${repoPath}/readme`, controller.signal).catch(() => null),
      fetchJson<WorkflowFile[]>(`${repoPath}/contents/.github/workflows`, controller.signal).catch(
        () => null,
      ),
    ]);

    const workflowFiles = Array.isArray(workflows)
      ? workflows.filter((item) => item.type === "file" && /\.ya?ml$/i.test(item.name))
      : [];

    return {
      owner: parsed.owner,
      repo: parsed.repo,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      lastPush: repo.pushed_at,
      hasReadme: readme !== null,
      license: repo.license?.spdx_id ?? repo.license?.name ?? null,
      topics: repo.topics ?? [],
      hasWorkflows: workflowFiles.length > 0,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function answersFromRepo(data: GithubRepoData): Record<string, "yes" | "partial" | "no"> {
  const answers: Record<string, "yes" | "partial" | "no"> = {};
  if (data.hasReadme) answers["docs-readme"] = "yes";
  if (data.hasWorkflows) answers["ci-pipeline"] = "yes";
  return answers;
}
