# Neon + Prisma: Database Branching & Migrations Demo ⚾

A small, self-contained demo showing how **[Neon](https://neon.tech) database branching** works together with **[Prisma](https://www.prisma.io) migrations** — built for a live presentation.

The idea: just like you branch your *code* in Git, Neon lets you branch your *database*. You can spin up an isolated copy of your data, apply a schema migration on that branch, verify it, and only then bring the change back to your main branch — all without touching production data.

Sample data is a roster of Colorado Rockies players. 🏔️

---

## What this demo shows

1. **A starting schema** — a `rockies_players` table created by the `0_init` migration.
2. **A database branch** — an isolated copy of the database, created with one Neon command.
3. **A migration on the branch** — `2_add_salary_age` adds `salary` and `age` columns *only on the branch*, so main stays untouched while you test.
4. **Seeing the result** — a tiny web page (`view.ts`) renders whatever table lives on the branch you're connected to.

Because every Neon branch has its own connection string, switching branches is just a matter of pointing `DATABASE_URL` at a different branch.

---

## Project layout

```
.
├── prisma/
│   ├── schema.prisma              # the data model (source of truth for migrations)
│   └── migrations/
│       ├── 0_init/                # creates the rockies_players table
│       └── 2_add_salary_age/      # adds salary + age columns (the "branch" change)
├── seed.ts                        # inserts the base roster  (matches 0_init)
├── seed-salary-age.ts             # fills salary + age       (matches 2_add_salary_age)
├── view.ts                        # tiny web server that renders the table as HTML
├── prisma.config.ts               # Prisma config (schema + migrations paths)
└── .env.example                   # copy to .env and add your Neon connection string
```

---

## Prerequisites

- [Node.js](https://nodejs.org) 18+
- A free [Neon account](https://console.neon.tech) and a project
- The [Neon CLI](https://neon.tech/docs/reference/neon-cli) (optional but handy): `npm install -g neonctl`

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure your database connection
cp .env.example .env
#    then edit .env and paste your Neon connection string into DATABASE_URL
#    (grab it from the Neon Console, or run: neon connection-string)

# 3. Generate the Prisma client
npm run prisma:generate

# 4. Apply migrations and seed the base roster
npm run prisma:migrate     # applies 0_init (and any others present)
npm run seed               # inserts the 20-player roster
```

> The npm scripts load `DATABASE_URL` from `.env` automatically. To target a
> different branch for a single command, override it inline, e.g.
> `DATABASE_URL=$(neon connection-string my-branch) npm run view`.

---

## Run the viewer

```bash
npm run view
# → open http://localhost:3000
```

You'll see the `rockies_players` table for whichever branch `DATABASE_URL` points at.

---

## The branching walkthrough (the actual demo)

This is the story to tell during the presentation:

**1. Start on `main`.** The table has the base columns (name, position, jersey, batting average, home runs).

```bash
npm run view   # shows the base table
```

**2. Create a database branch.** An instant, copy-on-write clone of your data:

```bash
neon branches create --name feature/salary-age
```

**3. Point the app at the branch and apply the new migration:**

```bash
export DATABASE_URL=$(neon connection-string feature/salary-age)
npm run prisma:migrate      # applies 2_add_salary_age on the BRANCH only
npm run seed:salary-age     # fills in the new columns
npm run view                # now shows salary + age
```

**4. Compare.** Switch `DATABASE_URL` back to `main` and run `npm run view` again — `main` still has the original schema. The change is fully isolated on the branch.

**5. Promote when ready.** Once the migration is verified on the branch, apply it to `main` (or merge the branch), confident it works.

---

## How the migrations were created

For reference, the migrations in `prisma/migrations/` were generated like this:

```bash
# baseline an existing database into a first migration
mkdir -p prisma/migrations/0_init
DATABASE_URL=$(neon connection-string) \
  npx prisma migrate diff --from-empty \
  --to-schema-datamodel prisma/schema.prisma --script \
  > prisma/migrations/0_init/migration.sql
npx prisma migrate resolve --applied 0_init

# later, after editing schema.prisma to add salary + age:
npx prisma migrate dev --name add_salary_age
```

---

## Tech stack

- **[Neon](https://neon.tech)** — serverless Postgres with instant database branching
- **[Prisma](https://www.prisma.io) 7** — schema, migrations, and type-safe client (via the `@prisma/adapter-pg` driver adapter)
- **[node-postgres (`pg`)](https://node-postgres.com)** — connection pool used by the viewer
- **[tsx](https://github.com/privatenumber/tsx)** — run the TypeScript files directly

---

## License

[MIT](./LICENSE)
