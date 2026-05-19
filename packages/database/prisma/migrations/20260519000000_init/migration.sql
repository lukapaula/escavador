-- Initial migration for the enterprise LGPD-compliant LegalOps platform.
-- The canonical database definition is packages/database/prisma/schema.prisma.
-- Run `npm run db:migrate` to let Prisma create provider-accurate SQL for PostgreSQL.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
