import { PrismaClient } from '@prisma/client'
import path from 'node:path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// For Prisma 7 with SQLite, we need to use the proper initialization
// The datasource URL is configured via prisma.config.ts for CLI operations
// and via the constructor for runtime

const dbPath = path.join(process.cwd(), 'db', 'custom.db')

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    __internal: {
      debug: process.env.NODE_ENV === 'development',
    },
  } as any)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
