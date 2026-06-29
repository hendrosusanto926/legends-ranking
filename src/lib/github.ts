import type { Player } from "@/types/player";

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

const FILE_PATH = "public/data/players.json";
const API_BASE = "https://api.github.com";

interface GitHubContent {
  sha: string;
  content: string;
  encoding: string;
}

async function getFileContent(): Promise<{ players: Player[]; sha: string }> {
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
  const players: Player[] = JSON.parse(decoded);

  return { players, sha: data.sha };
}

async function commitFile(
  players: Player[],
  message: string
): Promise<void> {
  const { token, owner, repo, branch } = getConfig();

  const { sha } = await getFileContent();

  players.sort((a, b) => b.score - a.score);

  const content = Buffer.from(
    JSON.stringify(players, null, 2),
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
        message,
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
}

export async function addPlayer(
  playerData: Omit<Player, "id">,
  commitMessage: string
): Promise<Player> {
  const { players } = await getFileContent();
  const maxId = players.reduce((max, p) => Math.max(max, p.id), 0);

  const newPlayer: Player = {
    id: maxId + 1,
    ...playerData,
  };

  players.push(newPlayer);
  await commitFile(players, commitMessage);

  return newPlayer;
}

export async function updatePlayer(
  id: number,
  playerData: Omit<Player, "id">,
  commitMessage: string
): Promise<Player> {
  const { players } = await getFileContent();
  const index = players.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error("Player not found");
  }

  players[index] = { id, ...playerData };
  await commitFile(players, commitMessage);

  return players[index];
}

export async function deletePlayer(
  id: number,
  commitMessage: string
): Promise<Player> {
  const { players } = await getFileContent();
  const index = players.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error("Player not found");
  }

  const removed = players.splice(index, 1)[0];
  await commitFile(players, commitMessage);

  return removed;
}
