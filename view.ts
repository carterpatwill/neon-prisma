process.on("uncaughtException", (err) => console.error("Uncaught:", err));
process.on("unhandledRejection", (err) => console.error("Unhandled:", err));

import http from "http";
import { PrismaClient, type rockies_players } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function getPlayers() {
  return prisma.rockies_players.findMany({ orderBy: { jersey_number: "asc" } });
}

function renderHTML(players: Awaited<ReturnType<typeof getPlayers>>) {
  const rows = players
    .map(
      (p: rockies_players) => `
    <tr>
      <td>${p.jersey_number}</td>
      <td>${p.name}</td>
      <td>${p.position}</td>
      <td>${p.batting_avg ?? "—"}</td>
      <td>${p.home_runs ?? "—"}</td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rockies Players</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #333366; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #333366; color: white; padding: 10px; text-align: left; }
    td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
    tr:hover { background: #f5f5f5; }
  </style>
</head>
<body>
  <h1>Colorado Rockies Players</h1>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Position</th>
        <th>Batting Avg</th>
        <th>Home Runs</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  try {
    const players = await getPlayers();
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(renderHTML(players));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error: " + (err as Error).message);
  }
});

server.listen(3000, () => {
  console.log("Open http://localhost:3000");
});
