process.on("uncaughtException", (err) => console.error("Uncaught:", err));
process.on("unhandledRejection", (err) => console.error("Unhandled:", err));

import http from "http";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getTableData(): Promise<{ tableName: string; columns: string[]; rows: Record<string, unknown>[] }> {
  const client = await pool.connect();
  try {
    const tableRes = await client.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
       LIMIT 1`
    );

    if (tableRes.rows.length === 0) throw new Error("No tables found in the database.");

    const tableName = tableRes.rows[0].table_name;
    const dataRes = await client.query(`SELECT * FROM "${tableName}"`);

    const columns = dataRes.fields.map((f) => f.name);
    const rows = dataRes.rows as Record<string, unknown>[];

    return { tableName, columns, rows };
  } finally {
    client.release();
  }
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}

function renderHTML(tableName: string, columns: string[], rows: Record<string, unknown>[]): string {
  const headers = columns.map((c) => `<th>${c}</th>`).join("");
  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${columns.map((c) => `<td>${formatCell(row[c])}</td>`).join("")}</tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${tableName}</title>
  <style>
    body { font-family: sans-serif; max-width: 95%; margin: 40px auto; padding: 0 20px; }
    h1 { color: #333366; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: max-content; }
    th { background: #333366; color: white; padding: 10px; text-align: left; white-space: nowrap; }
    td { padding: 8px 10px; border-bottom: 1px solid #ddd; white-space: nowrap; }
    tr:hover { background: #f5f5f5; }
  </style>
</head>
<body>
  <h1>${tableName}</h1>
  <div class="table-wrap">
    <table>
      <thead><tr>${headers}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  </div>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  try {
    const { tableName, columns, rows } = await getTableData();
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(renderHTML(tableName, columns, rows));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error: " + (err as Error).message);
  }
});

server.listen(3000, () => {
  console.log("Open http://localhost:3000");
});
