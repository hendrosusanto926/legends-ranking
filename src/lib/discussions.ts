import type { Discussion } from "@/types/discussion";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "master";

  if (!token || !owner || !repo) {
    throw new Error("Missing GitHub configuration: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO");
  }

  return { token, owner, repo, branch };
}

const FILE_PATH = "public/data/discussions.json";
const API_BASE = "https://api.github.com";

interface GitHubContent {
  sha: string;
  content: string;
  encoding: string;
}

async function getFileContent(): Promise<{ discussions: Discussion[]; sha: string }> {
  const { token, owner, repo, branch } = getConfig();

  const res = await fetch(
    `${API_BASE}/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "football-legends-ranking",
      },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${err}`);
  }

  const data: GitHubContent = await res.json();
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  const discussions: Discussion[] = JSON.parse(decoded);

  return { discussions, sha: data.sha };
}

export async function getDiscussions(): Promise<Discussion[]> {
  const { discussions } = await getFileContent();
  return discussions.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export async function addDiscussion(
  discussion: Discussion
): Promise<Discussion> {
  const { token, owner, repo, branch } = getConfig();
  const { discussions, sha } = await getFileContent();

  discussions.push(discussion);

  discussions.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const content = Buffer.from(
    JSON.stringify(discussions, null, 2),
    "utf-8"
  ).toString("base64");

  const res = await fetch(
    `${API_BASE}/repos/${owner}/${repo}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "football-legends-ranking",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add discussion by ${discussion.name}`,
        content,
        sha,
        branch,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub commit error (${res.status}): ${err}`);
  }

  return discussion;
}
