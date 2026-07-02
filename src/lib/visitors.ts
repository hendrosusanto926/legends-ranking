export interface Visitor {
  id: string;
  ipHash: string;
  city: string;
  region: string;
  country: string;
  latitude: string;
  longitude: string;
  browser: string;
  os: string;
  device: string;
  visitedAt: string;
}

const VISITOR_BRANCH = "visitor-data";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    throw new Error("Missing GitHub configuration: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO");
  }

  return { token, owner, repo, branch: VISITOR_BRANCH };
}

const FILE_PATH = "public/data/visitors.json";
const API_BASE = "https://api.github.com";

interface GitHubContent {
  sha: string;
  content: string;
  encoding: string;
}

async function getFileContent(): Promise<{ visitors: Visitor[]; sha: string }> {
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

  if (res.status === 404) {
    return { visitors: [], sha: "" };
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${err}`);
  }

  const data: GitHubContent = await res.json();
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  const visitors: Visitor[] = JSON.parse(decoded);

  return { visitors, sha: data.sha };
}

export async function getVisitors(): Promise<Visitor[]> {
  const { visitors } = await getFileContent();
  return visitors.sort(
    (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
  );
}

export async function trackVisitor(visitor: Visitor): Promise<Visitor> {
  const { token, owner, repo, branch } = getConfig();
  const { visitors, sha } = await getFileContent();

  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  const existingIndex = visitors.findIndex(
    (v) => v.ipHash === visitor.ipHash && new Date(v.visitedAt).getTime() > twentyFourHoursAgo
  );

  if (existingIndex >= 0) {
    visitors[existingIndex].visitedAt = visitor.visitedAt;
  } else {
    visitors.push(visitor);
  }

  const content = Buffer.from(
    JSON.stringify(visitors, null, 2),
    "utf-8"
  ).toString("base64");

  const body: Record<string, unknown> = {
    message: "Track visitor",
    content,
    branch,
  };
  if (sha) body.sha = sha;

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
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub commit error (${res.status}): ${err}`);
  }

  return visitor;
}
