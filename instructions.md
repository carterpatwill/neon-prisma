1. made new neon branch 
2. checked out neon branch 
3. npm init -y 
4.install Prisma:                                                                                    
  npm install prisma --save-dev                                                                         
  npm install @prisma/client
5. npx prisma init
6. deleted .env
7. npm install --save-dev dotenv
8. DATABASE_URL=$(neon cs) npx prisma db pull
9. mkdir -p prisma/migrations/0_init
10. DATABASE_URL=$(neon cs) npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
11. npx prisma migrate resolve --applied 0_init
12. npx prisma generate

prisma set 

run type script
npm install --save-dev typescript ts-node @types/node
npm install @prisma/adapter-pg
npm install pg @types/pg
npm install --save-dev tsx
DATABASE_URL=$(neon cs) npx tsx view.ts