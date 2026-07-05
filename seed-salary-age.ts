/**
 * Salary + age seed — matches the `2_add_salary_age` migration.
 *
 * Run this AFTER applying the `2_add_salary_age` migration (which adds the
 * `salary` and `age` columns). It fills those new columns for the seeded
 * roster, demonstrating how a schema change on a Neon branch flows through to
 * the data. Any player without an entry below is skipped.
 *
 * Note: salary/age values are illustrative demo data.
 *
 *   DATABASE_URL=$(neon connection-string) npx tsx seed-salary-age.ts
 */
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const playerData: Record<string, { salary: number; age: number }> = {
  "Nolan Arenado":   { salary: 35_000_000, age: 34 },
  "Charlie Blackmon": { salary: 21_000_000, age: 38 },
  "Kris Bryant":     { salary: 27_000_000, age: 33 },
  "Ryan McMahon":    { salary: 15_750_000, age: 29 },
  "C.J. Cron":       { salary:  7_250_000, age: 35 },
  "Kyle Freeland":   { salary:  8_000_000, age: 31 },
  "Germán Márquez":  { salary: 15_000_000, age: 30 },
  "Brendan Rodgers": { salary:  3_500_000, age: 27 },
  "Elias Diaz":      { salary:  8_000_000, age: 33 },
  "Daniel Bard":     { salary:  9_500_000, age: 39 },
  "Randal Grichuk":  { salary:  2_000_000, age: 33 },
  "Connor Joe":      { salary:    720_000, age: 32 },
};

async function main() {
  const players = await prisma.rockies_players.findMany();
  for (const player of players) {
    const data = playerData[player.name];
    if (data) {
      await prisma.rockies_players.update({ where: { id: player.id }, data });
      console.log(`Updated ${player.name}`);
    } else {
      console.log(`No salary/age data for ${player.name} — skipped`);
    }
  }
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
