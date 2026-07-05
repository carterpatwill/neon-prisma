/**
 * Base roster seed — matches the `0_init` migration.
 *
 * Inserts the Colorado Rockies roster (name, position, jersey number, batting
 * average, home runs). Idempotent: it clears the table and re-inserts, so it is
 * safe to run repeatedly and on any Neon branch.
 *
 *   DATABASE_URL=$(neon connection-string) npx tsx seed.ts
 */
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const roster = [
  { name: "Nolan Arenado",   position: "Third Base",       jersey_number: 28, batting_avg: 0.293, home_runs: 38 },
  { name: "Todd Helton",     position: "First Base",       jersey_number: 17, batting_avg: 0.316, home_runs: 30 },
  { name: "Larry Walker",    position: "Right Field",      jersey_number: 33, batting_avg: 0.379, home_runs: 49 },
  { name: "Charlie Blackmon", position: "Center Field",    jersey_number: 19, batting_avg: 0.331, home_runs: 37 },
  { name: "Trevor Story",    position: "Shortstop",        jersey_number: 27, batting_avg: 0.293, home_runs: 35 },
  { name: "Carlos Gonzalez", position: "Left Field",       jersey_number: 5,  batting_avg: 0.302, home_runs: 40 },
  { name: "Matt Holliday",   position: "Left Field",       jersey_number: 5,  batting_avg: 0.340, home_runs: 36 },
  { name: "Vinny Castilla",  position: "Third Base",       jersey_number: 9,  batting_avg: 0.304, home_runs: 46 },
  { name: "Dante Bichette",  position: "Left Field",       jersey_number: 10, batting_avg: 0.340, home_runs: 40 },
  { name: "Ellis Burks",     position: "Center Field",     jersey_number: 41, batting_avg: 0.344, home_runs: 40 },
  { name: "Kris Bryant",     position: "Third Base",       jersey_number: 23, batting_avg: 0.265, home_runs: 25 },
  { name: "C.J. Cron",       position: "First Base",       jersey_number: 25, batting_avg: 0.281, home_runs: 28 },
  { name: "Ryan McMahon",    position: "Second Base",      jersey_number: 24, batting_avg: 0.267, home_runs: 23 },
  { name: "Brendan Rodgers", position: "Second Base",      jersey_number: 7,  batting_avg: 0.274, home_runs: 15 },
  { name: "Elias Diaz",      position: "Catcher",          jersey_number: 35, batting_avg: 0.268, home_runs: 18 },
  { name: "Germán Márquez",  position: "Starting Pitcher", jersey_number: 48, batting_avg: 0.000, home_runs: 0 },
  { name: "Kyle Freeland",   position: "Starting Pitcher", jersey_number: 21, batting_avg: 0.000, home_runs: 0 },
  { name: "Daniel Bard",     position: "Relief Pitcher",   jersey_number: 52, batting_avg: 0.000, home_runs: 0 },
  { name: "Randal Grichuk",  position: "Center Field",     jersey_number: 15, batting_avg: 0.261, home_runs: 22 },
  { name: "Connor Joe",      position: "Left Field",       jersey_number: 9,  batting_avg: 0.250, home_runs: 12 },
];

async function main() {
  await prisma.rockies_players.deleteMany();
  await prisma.rockies_players.createMany({ data: roster });
  console.log(`Seeded ${roster.length} players.`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
