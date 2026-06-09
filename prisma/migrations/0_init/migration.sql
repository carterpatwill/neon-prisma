-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "rockies_players" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "jersey_number" INTEGER NOT NULL,
    "batting_avg" DECIMAL(4,3),
    "home_runs" INTEGER,

    CONSTRAINT "rockies_players_pkey" PRIMARY KEY ("id")
);

