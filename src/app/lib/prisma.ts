import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { envVars } from '../config/env.config';
import { PrismaClient } from '../../generated/prisma/client';

const connectionString = envVars.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const ensureEventStatusSchema = async () => {
  await prisma.$executeRawUnsafe(`
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EventStatus') THEN
		CREATE TYPE "EventStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
	END IF;
END
$$;
	`);

  await prisma.$executeRawUnsafe(`
ALTER TABLE "Event"
ADD COLUMN IF NOT EXISTS "status" "EventStatus" NOT NULL DEFAULT 'ACTIVE';
	`);

  await prisma.$executeRawUnsafe(`
CREATE INDEX IF NOT EXISTS "Event_status_idx" ON "Event" ("status");
	`);
};

const prismaSchemaReady = ensureEventStatusSchema().catch(error => {
  console.error('Failed to ensure Event.status schema compatibility:', error);
  throw error;
});

export { prisma, prismaSchemaReady };
