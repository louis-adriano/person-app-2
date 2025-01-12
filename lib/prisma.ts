import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection
prisma.$connect()
  .then(() => console.log('Successfully connected to the database'))
  .catch((error) => console.error('Failed to connect to the database:', error))

export default prisma

