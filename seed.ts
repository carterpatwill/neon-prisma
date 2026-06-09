import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const playerData: Record<string, { salary: number; age: number }> = {
  "Charlie Blackmon":  { salary: 21_000_000, age: 38 },
  "Ryan McMahon":      { salary: 15_750_000, age: 29 },
  "Kyle Freeland":     { salary:  8_000_000, age: 31 },
  "Brendan Rodgers":   { salary:  3_500_000, age: 27 },
  "Elias Diaz":        { salary:  8_000_000, age: 33 },
  "Nolan Jones":       { salary:    720_000, age: 25 },
  "Ezequiel Tovar":    { salary:    720_000, age: 22 },
  "Brenton Doyle":     { salary:    720_000, age: 26 },
  "Michael Toglia":    { salary:    720_000, age: 26 },
  "Austin Gomber":     { salary:  4_500_000, age: 30 },
};

async function main() {
  const players = await prisma.rockies_players.findMany();
  for (const player of players) {
    const data = playerData[player.name];
    if (data) {
      await prisma.rockies_players.update({
        where: { id: player.id },
        data,
      });
      console.log(`Updated ${player.name}`);
    } else {
      console.log(`No data for ${player.name} — skipped`);
    }
  }
  await prisma.$disconnect();
}

main();
